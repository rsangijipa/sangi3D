/**
 * Meteorologia das Emocoes — entrada do usuario.
 * Arrasto angular nos mostradores (com zona morta e snap), raycaster nos
 * objetos interativos do mundo, botoes +- e atalhos de teclado.
 * A camera pausa enquanto o HUD captura entrada.
 */

import * as THREE from 'three';
import type { GameState, Action, WeatherKind } from '../game/state.js';
import { Scene3D } from '../scene/index.js';
import { Tween, easeOutCubic } from '../scene/animation.js';
import { audioManager } from '../audio/index.js';

export type DialState = { kind: WeatherKind; value: number; dial: THREE.Group };

export class InputController {
  private scene: Scene3D;
  private dispatch: (action: Action) => void;
  private state: () => GameState;

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private pointerDown = false;
  private activeDial: DialState | null = null;
  private startAngle = 0;
  private startValue = 0;
  private startPointer = new THREE.Vector2();
  private deadZone = 0.08;

  constructor(scene: Scene3D, dispatch: (action: Action) => void, state: () => GameState) {
    this.scene = scene;
    this.dispatch = dispatch;
    this.state = state;

    const canvas = scene.renderer.domElement;
    canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    canvas.addEventListener('pointermove', (e) => this.onPointerMove(e));
    canvas.addEventListener('pointerup', (e) => this.onPointerUp(e));
    canvas.addEventListener('pointercancel', () => this.onPointerUp(null as any));
    canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('visibilitychange', () => this.onVisibilityChange());
  }

  private onPointerDown(e: PointerEvent): void {
    if (e.button !== 0) return;
    const rect = this.scene.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const hits = this.intersectDials();
    if (hits.length > 0) {
      const dial = hits[0].object as THREE.Group;
      const kind = dial.userData.kind as WeatherKind;
      this.pointerDown = true;
      this.activeDial = { kind, value: this.state().weather[kind], dial };
      this.startPointer.set(e.clientX, e.clientY);
      this.startAngle = this.pointerToAngle(e.clientX, e.clientY, dial);
      this.startValue = this.state().weather[kind];
      audioManager.playUiClick('click');
      this.scene.setPointerLocked(true);
      return;
    }
  }

  private onPointerMove(e: PointerEvent): void {
    if (!this.pointerDown || !this.activeDial) return;
    const dx = e.clientX - this.startPointer.x;
    const dy = e.clientY - this.startPointer.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < this.deadZone * 100) return;

    const angle = this.pointerToAngle(e.clientX, e.clientY, this.activeDial.dial);
    const delta = this.shortestAngleDelta(this.startAngle, angle);
    const step = (55 * Math.PI) / 180;
    const raw = this.startValue + delta / step;
    const value = Math.round(raw);
    this.setDialValue(this.activeDial.kind, value);
  }

  private onPointerUp(_e: PointerEvent | null): void {
    if (this.activeDial) audioManager.playUiClick('tick');
    this.pointerDown = false;
    this.activeDial = null;
    this.scene.setPointerLocked(false);
  }

  private onWheel(e: WheelEvent): void {
    e.preventDefault();
  }
  private onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.dispatch({ type: 'PAUSE' });
      audioManager.playUiClick('click');
      return;
    }
    if (e.key === 'Enter') {
      this.dispatch({ type: 'NEXT_STEP' });
      audioManager.playUiClick('confirm');
      return;
    }
  }

  adjust(kind: WeatherKind, delta: number): void {
    const s = this.state();
    const cur = s.weather[kind];
    const next = Math.min(4, Math.max(0, cur + delta));
    if (next === cur) return;
    this.setDialValue(kind, next);
    audioManager.playUiClick('tick');
  }

  private setDialValue(kind: WeatherKind, value: number): void {
    this.dispatch({ type: 'SET_WEATHER', kind, value });
    const dial = this.scene.dials.get(kind);
    if (dial) {
      const pointer = dial.children.find((c) => c.name === `${kind}_pointer`) as THREE.Group | undefined;
      if (pointer) {
        const to = ((-110 + value * 55) * Math.PI) / 180;
        const tween = new Tween(pointer.rotation.z, to, 0.6, easeOutCubic, (v) => {
          pointer.rotation.z = v;
        });
        this.scene.tweenManager.add(tween);
      }
    }
  }

  private intersectDials(): THREE.Intersection[] {
    this.raycaster.setFromCamera(this.mouse, this.scene.camera);
    const objects: THREE.Object3D[] = [];
    this.scene.dials.forEach((d) => objects.push(d));
    return this.raycaster.intersectObjects(objects, false);
  }

  private pointerToAngle(clientX: number, clientY: number, dial: THREE.Group): number {
    const rect = this.scene.renderer.domElement.getBoundingClientRect();
    const mx = ((clientX - rect.left) / rect.width) * 2 - 1;
    const my = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(new THREE.Vector2(mx, my), this.scene.camera);

    const center = new THREE.Vector3();
    dial.getWorldPosition(center);
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(dial.quaternion);
    const plane = new THREE.Plane(normal, -center.dot(normal));
    const target = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(plane, target);
    if (!target) return 0;

    const local = target.clone().sub(center);
    const axisX = new THREE.Vector3(1, 0, 0).applyQuaternion(dial.quaternion);
    const axisZ = new THREE.Vector3(0, 0, 1).applyQuaternion(dial.quaternion);
    return Math.atan2(local.dot(axisZ), local.dot(axisX));
  }

  private shortestAngleDelta(from: number, to: number): number {
    let d = to - from;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return d;
  }

  private onVisibilityChange(): void {
    if (document.hidden) {
      this.dispatch({ type: 'PAUSE' });
    } else {
      this.dispatch({ type: 'RESUME' });
    }
  }

  destroy(): void {
    const canvas = this.scene.renderer.domElement;
    canvas.removeEventListener('pointerdown', (e: PointerEvent) => this.onPointerDown(e));
    canvas.removeEventListener('pointermove', (e: PointerEvent) => this.onPointerMove(e));
    canvas.removeEventListener('pointerup', (e: PointerEvent) => this.onPointerUp(e));
    window.removeEventListener('keydown', (e: KeyboardEvent) => this.onKeyDown(e));
    window.removeEventListener('visibilitychange', () => this.onVisibilityChange());
  }
}

