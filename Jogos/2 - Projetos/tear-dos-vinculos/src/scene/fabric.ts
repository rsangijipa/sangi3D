// Tecido: malha atualizada por fileira (uma malha por passada, reconstruída só quando a passada muda),
// passada ativa, fio livre em Verlet até a lançadeira, pontas soltas/presas/atadas, seleção e lacunas.
import * as THREE from 'three';
import { YARNS, thicknessById, type Crossing } from '../game/content.ts';
import { entityHeight, rowPitch, type LooseEnd, type RowEntity, type SceneState } from '../game/state.ts';
import { VerletRope } from '../sim/verlet.ts';
import { groupHalf, hashString, makeLayout, warpX, weftPath, type LoomLayout, type PathPoint } from '../sim/weavePath.ts';
import { LOOM } from './loom.ts';
import type { MaterialKit } from './materials.ts';
import { RopeMesh } from './ropeMesh.ts';

interface RowVisual {
  mesh: THREE.Mesh;
  key: string;
  y: number;
  targetY: number;
}

interface EndVisual {
  key: string;
  rope: VerletRope | null;
  ropeMesh: RopeMesh | null;
  extra: THREE.Object3D | null;
  anchor: THREE.Vector3;
}

export interface FabricLayoutInfo {
  fellY: number;
  activeY: number;
  shift: number;
  rowY: Map<string, number>;
  gapY: Map<string, [number, number]>;
}

const UP = new THREE.Vector3(0, 1, 0);

export class FabricView {
  readonly group = new THREE.Group();
  layout: LoomLayout;
  private mats = new Map<string, THREE.Material>();
  private rows = new Map<string, RowVisual>();
  private ends = new Map<string, EndVisual>();
  private activeMesh: THREE.Mesh | null = null;
  private activeKey = '';
  readonly freeRope: VerletRope;
  readonly freeMesh: RopeMesh;
  private freeVisible = false;
  private freeA = new THREE.Vector3();
  private freeB = new THREE.Vector3();
  private selection: THREE.Mesh;
  private selUniforms = { uTime: { value: 0 }, uAlpha: { value: 0 } };
  readonly nextRing: THREE.Mesh;
  readonly chipOver: THREE.Sprite;
  readonly chipUnder: THREE.Sprite;
  readonly gapMarkers = new THREE.Group();
  info: FabricLayoutInfo = { fellY: LOOM.fabricBase, activeY: LOOM.fabricBase, shift: 0, rowY: new Map(), gapY: new Map() };
  private lite: boolean;
  private clip: THREE.Plane;
  private last: SceneState | null = null;
  /** posição atual da lançadeira (local do tear), escrita pelo mundo */
  shuttleTip = new THREE.Vector3();
  hint: Crossing | null = null;
  hintLevel = 0;
  private time = 0;

  constructor(kit: MaterialKit, warpCount: number, lite: boolean) {
    this.group.name = 'tecido';
    this.lite = lite;
    this.layout = makeLayout(warpCount, LOOM.warpWidth);
    // Plano de corte em y: o tecido enrolado some no rolo.
    this.clip = new THREE.Plane(new THREE.Vector3(0, 1, 0), -LOOM.fabricBase + 0.004);
    for (const y of YARNS) {
      const m = kit.yarn.get(y.id)!.clone();
      m.clippingPlanes = [this.clip];
      m.name = `trama_${y.id}`;
      this.mats.set(y.id, m);
    }
    this.freeRope = new VerletRope({ x: 0, y: 1, z: 0 }, { x: 0.1, y: 1, z: 0 }, { segments: 18, length: 0.1, tension: 0.5, damping: 0.97 });
    this.freeMesh = new RopeMesh(19, thicknessById('media').raio, this.mats.get('salvia')!, lite ? 4 : 6);
    this.freeMesh.name = 'fio_livre_verlet';
    this.freeMesh.visible = false;
    this.group.add(this.freeMesh);

    const selMat = new THREE.ShaderMaterial({
      name: 'selecao_trecho',
      transparent: true,
      depthWrite: false,
      uniforms: this.selUniforms,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform float uTime; uniform float uAlpha; varying vec2 vUv;
        void main(){ vec2 d = min(vUv, 1.0 - vUv); float edge = 1.0 - smoothstep(0.0, 0.035, min(d.x*0.25, d.y));
          float dash = step(0.5, fract(vUv.x * 30.0 - uTime * 0.6));
          float a = (edge * (0.55 + 0.45*dash) + 0.07) * uAlpha;
          gl_FragColor = vec4(vec3(1.0, 0.82, 0.42) * 1.4, a); }`,
    });
    this.selection = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), selMat);
    this.selection.name = 'selecao_trecho';
    this.selection.renderOrder = 10;
    this.selection.visible = false;
    this.group.add(this.selection);

    const ringMat = new THREE.MeshBasicMaterial({ color: '#FFD27A', transparent: true, opacity: 0.85, depthWrite: false, name: 'destaque_proximo_fio' });
    this.nextRing = new THREE.Mesh(new THREE.TorusGeometry(0.0062, 0.0011, 8, 24), ringMat);
    this.nextRing.name = 'destaque_proximo_fio';
    this.nextRing.rotation.x = Math.PI / 2;
    this.nextRing.renderOrder = 9;
    this.group.add(this.nextRing);

    this.chipOver = makeChip('over');
    this.chipUnder = makeChip('under');
    this.group.add(this.chipOver, this.chipUnder);
    this.gapMarkers.name = 'marcas_corte';
    this.group.add(this.gapMarkers);
  }

  materialFor(yarnId: string): THREE.Material {
    return this.mats.get(yarnId) ?? this.mats.get('linho')!;
  }

  setWarpCount(n: number): void {
    if (n === this.layout.warpCount) return;
    this.layout = makeLayout(n, LOOM.warpWidth);
    for (const v of this.rows.values()) { this.group.remove(v.mesh); v.mesh.geometry.dispose(); }
    this.rows.clear();
    this.activeKey = '';
  }

  /** Reconcilia malhas com o estado. Fileiras inalteradas não são reconstruídas. */
  sync(s: SceneState, instant = false): void {
    this.setWarpCount(s.warpCount);
    this.last = s;
    const base = LOOM.fabricBase;
    let cum = 0;
    const rowY = new Map<string, number>();
    const gapY = new Map<string, [number, number]>();
    for (const e of s.fabric) {
      const h = entityHeight(e);
      if (e.kind === 'row') rowY.set(e.id, base + cum + h / 2);
      else gapY.set(e.id, [base + cum, base + cum + h]);
      cum += h;
    }
    const activePitch = s.active ? rowPitch(s.active.thickness) : rowPitch(s.thickness);
    const fellRaw = base + cum;
    const shift = Math.max(0, fellRaw + activePitch - LOOM.maxFell);
    for (const [k, v] of rowY) rowY.set(k, v - shift);
    for (const [k, v] of gapY) gapY.set(k, [v[0] - shift, v[1] - shift]);
    this.info = { fellY: fellRaw - shift, activeY: fellRaw - shift + activePitch / 2, shift, rowY, gapY };

    // Fileiras
    const seen = new Set<string>();
    for (const e of s.fabric) {
      if (e.kind !== 'row') continue;
      seen.add(e.id);
      const key = rowKey(e, s.warpCount);
      let v = this.rows.get(e.id);
      const ty = rowY.get(e.id)!;
      if (!v || v.key !== key) {
        if (v) { this.group.remove(v.mesh); v.mesh.geometry.dispose(); }
        const mesh = this.buildRowMesh(e);
        const startY = v ? v.y : ty + (instant ? 0 : 0.014);
        v = { mesh, key, y: startY, targetY: ty };
        mesh.position.y = startY;
        this.rows.set(e.id, v);
        this.group.add(mesh);
      }
      v.targetY = ty;
      if (instant) { v.y = ty; v.mesh.position.y = ty; }
    }
    for (const [id, v] of this.rows) if (!seen.has(id)) { this.group.remove(v.mesh); v.mesh.geometry.dispose(); this.rows.delete(id); }

    // Passada ativa (parcial)
    const a = s.active;
    const aKey = a ? `${a.id}|${a.crossings.join('')}|${a.tension.toFixed(3)}|${a.thickness}|${a.yarnId}|${s.warpCount}` : '';
    if (aKey !== this.activeKey) {
      if (this.activeMesh) { this.group.remove(this.activeMesh); this.activeMesh.geometry.dispose(); this.activeMesh = null; }
      if (a && a.crossings.length > 0) {
        const pts = weftPath(this.layout, { crossings: a.crossings, direction: a.direction, thickness: a.thickness, tension: a.tension, y: 0, seed: hashString(a.id) });
        const ordered = a.direction === 1 ? pts : pts.slice().reverse();
        // Um único cruzamento: trecho curto que entra pela ourela até o primeiro grupo.
        if (ordered.length < 2) {
          const p0 = ordered[0];
          ordered.unshift({ x: p0.x - a.direction * (groupHalf(this.layout) + 0.012), y: p0.y, z: p0.z * 0.5 });
        }
        this.activeMesh = this.tube(ordered, thicknessById(a.thickness).raio, this.materialFor(a.yarnId), 'passada_ativa');
        this.activeMesh.userData.rowId = a.id;
        this.group.add(this.activeMesh);
      }
      this.activeKey = aKey;
    }
    if (this.activeMesh) this.activeMesh.position.y = this.info.activeY;

    this.syncEnds(s);
    this.syncSelection(s);
    this.syncGaps();
  }

  private buildRowMesh(row: RowEntity): THREE.Mesh {
    const pts = weftPath(this.layout, { crossings: row.crossings, direction: row.direction, thickness: row.thickness, tension: row.tension, y: 0, seed: hashString(row.id) });
    const r = thicknessById(row.thickness).raio;
    const pitch = rowPitch(row.thickness);
    // Volta na ourela: a trama contorna o último fio e sobe para a próxima passada.
    const ordered: PathPoint[] = row.direction === 1 ? pts : pts.slice().reverse();
    const end = ordered[ordered.length - 1];
    const out = row.direction;
    const gh = groupHalf(this.layout);
    ordered.push({ x: end.x + out * gh * 0.6, y: end.y, z: end.z });
    for (let i = 1; i <= 6; i++) {
      const a = (i / 6) * Math.PI;
      ordered.push({ x: end.x + out * (gh + Math.sin(a) * (r * 1.6 + 0.0025)), y: end.y + (1 - Math.cos(a)) * pitch * 0.5, z: end.z * Math.cos(a) });
    }
    const m = this.tube(ordered, r, this.materialFor(row.yarnId), `fileira_${row.id}`);
    m.userData.rowId = row.id;
    return m;
  }

  private tube(points: PathPoint[], r: number, mat: THREE.Material, name: string): THREE.Mesh {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(p.x, p.y, p.z)), false, 'centripetal');
    const len = curve.getLength();
    const geo = new THREE.TubeGeometry(curve, Math.max(8, Math.round(points.length * (this.lite ? 1 : 1.6))), r, this.lite ? 4 : 7, false);
    const uv = geo.getAttribute('uv') as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * (len / 0.011));
    const m = new THREE.Mesh(geo, mat);
    m.name = name;
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }

  // ---------- pontas ----------

  private endAnchor(e: LooseEnd, out: THREE.Vector3): boolean {
    const y = this.info.rowY.get(e.rowId) ?? (this.last?.active?.id === e.rowId ? this.info.activeY : undefined);
    if (y === undefined) return false;
    const r = thicknessById(this.rowThickness(e.rowId)).raio;
    const gh = groupHalf(this.layout);
    const xEdge = e.side === 'left' ? warpX(this.layout, 0) - gh - r * 1.4 - 0.004 : warpX(this.layout, this.layout.warpCount - 1) + gh + r * 1.4 + 0.004;
    out.set(xEdge, y, 0.003);
    return true;
  }

  private rowThickness(id: string) {
    const s = this.last;
    const row = s?.fabric.find((e): e is RowEntity => e.kind === 'row' && e.id === id);
    return row?.thickness ?? s?.active?.thickness ?? 'media';
  }

  private syncEnds(s: SceneState): void {
    const seen = new Set<string>();
    const anchor = new THREE.Vector3();
    for (const e of s.ends) {
      if (!this.endAnchor(e, anchor)) continue;
      seen.add(e.id);
      const key = `${e.state}|${e.yarnId}|${this.rowThickness(e.rowId)}`;
      let v = this.ends.get(e.id);
      if (v && v.key !== key) { this.disposeEnd(v); v = undefined; }
      if (!v) {
        v = this.buildEnd(e, anchor);
        this.ends.set(e.id, v);
      }
      v.anchor.copy(anchor);
    }
    for (const [id, v] of this.ends) if (!seen.has(id)) { this.disposeEnd(v); this.ends.delete(id); }
  }

  private buildEnd(e: LooseEnd, anchor: THREE.Vector3): EndVisual {
    const r = thicknessById(this.rowThickness(e.rowId)).raio;
    const mat = this.materialFor(e.yarnId);
    const sideSign = e.side === 'left' ? -1 : 1;
    const v: EndVisual = { key: `${e.state}|${e.yarnId}|${this.rowThickness(e.rowId)}`, rope: null, ropeMesh: null, extra: null, anchor: anchor.clone() };
    if (e.state === 'solta' || e.state === 'atada') {
      const len = e.state === 'solta' ? 0.13 : 0.035;
      const seg = e.state === 'solta' ? 12 : 5;
      const rope = new VerletRope(anchor, { x: anchor.x + sideSign * 0.02, y: anchor.y - len, z: anchor.z + 0.01 }, { segments: seg, length: len, tension: 1, damping: 0.96 });
      rope.minZ = 0.004;
      rope.pin(0, anchor);
      // impulso inicial para o fio "cair" com naturalidade
      for (let i = 1; i <= seg; i++) rope.prev[i * 3] -= sideSign * 0.002 * (i / seg);
      const rm = new RopeMesh(seg + 1, r * 0.92, mat, this.lite ? 4 : 6);
      rm.name = `ponta_${e.state}_${e.id}`;
      rm.userData.endId = e.id;
      this.group.add(rm);
      v.rope = rope;
      v.ropeMesh = rm;
    }
    if (e.state === 'presa') {
      // A ponta foi passada de volta pela urdidura com a agulha: trecho curto embutido na ourela.
      const pts = [
        new THREE.Vector3(anchor.x, anchor.y, anchor.z),
        new THREE.Vector3(anchor.x + sideSign * 0.004, anchor.y - r * 1.2, anchor.z + 0.004),
        new THREE.Vector3(anchor.x - sideSign * 0.012, anchor.y - r * 2.6, anchor.z + 0.006),
        new THREE.Vector3(anchor.x - sideSign * 0.03, anchor.y - r * 3.2, anchor.z + 0.002),
      ].map((p) => p.sub(anchor));
      const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, r * 0.85, 6);
      const m = new THREE.Mesh(geo, mat);
      m.name = `ponta_presa_${e.id}`;
      m.castShadow = true;
      m.userData.endId = e.id;
      v.extra = m;
      this.group.add(m);
    }
    if (e.state === 'atada') {
      const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(r * 1.25, r * 0.62, 40, 6, 2, 3), mat);
      knot.name = `no_${e.id}`;
      knot.castShadow = true;
      knot.userData.endId = e.id;
      v.extra = knot;
      this.group.add(knot);
    }
    return v;
  }

  private disposeEnd(v: EndVisual): void {
    if (v.ropeMesh) { this.group.remove(v.ropeMesh); v.ropeMesh.geometry.dispose(); }
    if (v.extra) { this.group.remove(v.extra); (v.extra as THREE.Mesh).geometry?.dispose(); }
  }

  /** Posição (local do tear) de uma ponta, para animar a agulha até ela. */
  endPosition(endId: string, out: THREE.Vector3): boolean {
    const v = this.ends.get(endId);
    if (!v) return false;
    out.copy(v.anchor);
    return true;
  }

  // ---------- seleção e lacunas ----------

  private syncSelection(s: SceneState): void {
    const sel = s.selection;
    if (!sel) { this.selection.visible = false; return; }
    const ids = [sel.fromId, sel.toId ?? sel.fromId];
    const idx = ids.map((id) => s.fabric.findIndex((e) => e.id === id)).filter((i) => i >= 0);
    if (!idx.length) { this.selection.visible = false; return; }
    const a = Math.min(...idx), b = Math.max(...idx);
    let y0 = Infinity, y1 = -Infinity;
    for (let i = a; i <= b; i++) {
      const e = s.fabric[i];
      const c = e.kind === 'row' ? this.info.rowY.get(e.id)! : (this.info.gapY.get(e.id)![0] + this.info.gapY.get(e.id)![1]) / 2;
      const h = entityHeight(e);
      y0 = Math.min(y0, c - h / 2); y1 = Math.max(y1, c + h / 2);
    }
    const pad = 0.004;
    this.selection.visible = true;
    this.selection.position.set(0, (y0 + y1) / 2, 0.022);
    this.selection.scale.set(this.layout.width + 0.06, Math.max(0.01, y1 - y0 + pad * 2), 1);
  }

  private syncGaps(): void {
    for (const c of [...this.gapMarkers.children]) { this.gapMarkers.remove(c); (c as THREE.Mesh).geometry?.dispose(); }
    for (const [, [y0, y1]] of this.info.gapY) {
      // Linha tracejada indicando o trecho aberto aguardando reconexão.
      const g = new THREE.PlaneGeometry(this.layout.width + 0.02, Math.max(0.004, y1 - y0));
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: '#FFE2A8', transparent: true, opacity: 0.08, depthWrite: false }));
      m.position.set(0, (y0 + y1) / 2, -0.012);
      m.name = 'lacuna';
      this.gapMarkers.add(m);
    }
  }

  // ---------- consultas ----------

  rowMeshes(): THREE.Object3D[] {
    return [...this.rows.values()].map((v) => v.mesh);
  }

  nextCrossingWarp(s: SceneState): number | null {
    const idx = s.active ? s.active.crossings.length : 0;
    if (idx >= s.warpCount) return null;
    const dir = s.active ? s.active.direction : nextDir(s);
    return dir === 1 ? idx : s.warpCount - 1 - idx;
  }

  /** Ponto (local) do último cruzamento feito, para ancorar o fio livre. */
  lastCrossPoint(s: SceneState, out: THREE.Vector3): boolean {
    const a = s.active;
    if (a && a.crossings.length) {
      const w = a.direction === 1 ? a.crossings.length - 1 : s.warpCount - a.crossings.length;
      out.set(warpX(this.layout, w), this.info.activeY, 0);
      return true;
    }
    return false;
  }

  // ---------- quadro ----------

  update(dt: number, s: SceneState, reducedMotion: boolean): void {
    this.time += dt;
    const k = reducedMotion ? 1 : 1 - Math.exp(-dt * 9);
    for (const v of this.rows.values()) {
      v.y += (v.targetY - v.y) * k;
      if (Math.abs(v.targetY - v.y) < 1e-5) v.y = v.targetY;
      v.mesh.position.y = v.y;
      v.mesh.visible = v.y > LOOM.fabricBase - 0.02;
    }
    // Pontas com Verlet
    const p = new THREE.Vector3();
    for (const v of this.ends.values()) {
      if (v.rope) {
        v.rope.pin(0, v.anchor);
        v.rope.update(dt);
        v.ropeMesh!.setFromArray(v.rope.pos);
      }
      if (v.extra) v.extra.position.copy(v.anchor).add(p.set(0, 0, 0.004));
    }
    // Fio livre: do último cruzamento (ou fim da última fileira) até a lançadeira.
    const a = s.active;
    let anchorOk = false;
    let yarn = s.selectedYarn;
    let thick = s.thickness;
    let tension = s.tension;
    if (a && a.crossings.length) { anchorOk = this.lastCrossPoint(s, this.freeA); yarn = a.yarnId; thick = a.thickness; tension = a.tension; }
    else if (!a) {
      const last = [...s.fabric].reverse().find((e): e is RowEntity => e.kind === 'row');
      if (last && last.yarnId === s.selectedYarn && this.info.rowY.has(last.id)) {
        const w = last.direction === 1 ? s.warpCount - 1 : 0;
        const rr = thicknessById(last.thickness).raio;
        this.freeA.set(warpX(this.layout, w) + last.direction * (groupHalf(this.layout) + rr * 1.6 + 0.002), this.info.rowY.get(last.id)! + rowPitch(last.thickness) * 0.5, 0);
        anchorOk = true; yarn = last.yarnId; thick = last.thickness; tension = last.tension;
      }
    }
    if (anchorOk) {
      this.freeB.copy(this.shuttleTip);
      const dist = this.freeA.distanceTo(this.freeB);
      if (!this.freeVisible) {
        this.freeRope.reset(this.freeA, this.freeB);
        this.freeVisible = true;
      }
      this.freeRope.setLength(Math.max(0.01, dist));
      this.freeRope.setTension(tension);
      this.freeRope.pin(0, this.freeA);
      this.freeRope.pin(this.freeRope.n - 1, this.freeB);
      this.freeRope.update(dt);
      if (!this.freeRope.isFinite()) this.freeRope.reset(this.freeA, this.freeB);
      this.freeMesh.material = this.materialFor(yarn);
      this.freeMesh.radius = thicknessById(thick).raio * 0.95;
      this.freeMesh.setFromArray(this.freeRope.pos);
      this.freeMesh.visible = true;
    } else {
      this.freeVisible = false;
      this.freeMesh.visible = false;
    }

    // Afordâncias do próximo cruzamento
    const w = this.nextCrossingWarp(s);
    const show = w !== null && this.hintLevel >= 0;
    this.nextRing.visible = show && this.hintLevel >= 1;
    this.chipOver.visible = this.chipUnder.visible = show;
    if (w !== null) {
      const x = warpX(this.layout, w);
      const y = this.info.activeY;
      this.nextRing.position.set(x, y + 0.03, 0);
      this.nextRing.scale.set(1 + (groupHalf(this.layout) / 0.0062) * 0.9, 1, 1);
      const pulse = 0.5 + 0.5 * Math.sin(this.time * 4);
      (this.nextRing.material as THREE.MeshBasicMaterial).opacity = 0.55 + pulse * 0.35;
      // Mesma âncora; o deslocamento é em pixels (center do sprite), então não se sobrepõem a nenhuma distância.
      this.chipOver.position.set(x, y + 0.075, 0.03);
      this.chipUnder.position.set(x, y + 0.075, 0.03);
      const base = 0.042; // tamanho constante na tela (sizeAttenuation desligado)
      const sOver = this.hint === 'over' && this.hintLevel >= 2 ? base * (1.12 + pulse * 0.08) : base;
      const sUnder = this.hint === 'under' && this.hintLevel >= 2 ? base * (1.12 + pulse * 0.08) : base;
      this.chipOver.scale.set(sOver * 2, sOver, 1);
      this.chipUnder.scale.set(sUnder * 2, sUnder, 1);
      (this.chipOver.material as THREE.SpriteMaterial).opacity = this.hint === 'under' && this.hintLevel >= 2 ? 0.55 : 0.97;
      (this.chipUnder.material as THREE.SpriteMaterial).opacity = this.hint === 'over' && this.hintLevel >= 2 ? 0.55 : 0.97;
    }
    this.selUniforms.uTime.value = this.time;
    this.selUniforms.uAlpha.value = Math.min(1, this.selUniforms.uAlpha.value + dt * 4);
    // Clipping acompanha a posição do grupo no mundo.
    this.group.updateWorldMatrix(true, false);
    const worldBase = new THREE.Vector3(0, LOOM.fabricBase - 0.004, 0).applyMatrix4(this.group.matrixWorld);
    this.clip.set(UP, -worldBase.y);
  }

  setChipsVisible(v: boolean): void {
    this.hintLevel = v ? Math.max(0, this.hintLevel) : -1;
  }
}

function rowKey(e: RowEntity, n: number): string {
  return `${e.crossings.join('')}|${e.tension.toFixed(3)}|${e.thickness}|${e.yarnId}|${e.direction}|${n}`;
}

function nextDir(s: SceneState): 1 | -1 {
  for (let i = s.fabric.length - 1; i >= 0; i--) {
    const e = s.fabric[i];
    if (e.kind === 'row') return e.direction === 1 ? -1 : 1;
  }
  return 1;
}

function makeChip(kind: Crossing): THREE.Sprite {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 128;
  const x = c.getContext('2d')!;
  const r = 52;
  x.fillStyle = 'rgba(38,52,48,0.92)';
  x.beginPath(); x.roundRect(6, 6, 244, 116, r); x.fill();
  x.strokeStyle = 'rgba(238,229,212,0.85)'; x.lineWidth = 4; x.stroke();
  // ícone: fio vertical (urdidura) e trama passando por cima ou por baixo
  x.lineCap = 'round';
  const cx = 64, cy = 64;
  const drawWarp = () => { x.strokeStyle = '#EEE5D4'; x.lineWidth = 7; x.beginPath(); x.moveTo(cx, 26); x.lineTo(cx, 102); x.stroke(); };
  const drawWeft = () => { x.strokeStyle = '#D7B86D'; x.lineWidth = 11; x.beginPath(); x.moveTo(cx - 34, cy); x.lineTo(cx + 34, cy); x.stroke(); };
  if (kind === 'over') { drawWarp(); drawWeft(); } else { drawWeft(); x.strokeStyle = 'rgba(38,52,48,1)'; x.lineWidth = 15; x.beginPath(); x.moveTo(cx, cy - 12); x.lineTo(cx, cy + 12); x.stroke(); drawWarp(); }
  x.fillStyle = '#EEE5D4';
  x.font = '600 40px "Segoe UI", system-ui, sans-serif';
  x.textBaseline = 'middle';
  x.fillText(kind === 'over' ? 'cima' : 'baixo', 112, 66);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  const m = new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true, toneMapped: false, sizeAttenuation: false });
  const s = new THREE.Sprite(m);
  s.name = kind === 'over' ? 'chip_por_cima' : 'chip_por_baixo';
  s.userData.crossing = kind;
  s.renderOrder = 20;
  s.center.set(0.5, kind === 'over' ? -0.08 : 1.08);
  return s;
}
