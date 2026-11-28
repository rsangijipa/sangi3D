import * as THREE from 'three';
import { lathe, taperedTube, cylinderBetween } from '../core/model';

/**
 * Luminária articulada de aço escovado (lamp_arm): base, haste, ombro, braço inferior duplo com mola,
 * cotovelo, braço superior e cúpula. A pose vem de uma IK de dois segmentos que leva a cúpula até o ponto
 * pedido (azimute/elevação em torno da amostra). A SpotLight fica dentro da cúpula e projeta sombra.
 */

export interface LampParts {
  root: THREE.Group;
  yaw: THREE.Group;
  head: THREE.Group;
  spot: THREE.SpotLight;
  bulbMat: THREE.MeshStandardMaterial;
  innerMat: THREE.MeshStandardMaterial;
  cone: THREE.Mesh;
  coneMat: THREE.ShaderMaterial;
  /** Coloca a cúpula no ponto `headWorld` mirando `target`. */
  pose(headWorld: THREE.Vector3, target: THREE.Vector3): void;
  /** Posição atual do bulbo (mundo) e direção do facho. */
  bulbWorld(out: THREE.Vector3): THREE.Vector3;
  aimWorld(out: THREE.Vector3): THREE.Vector3;
  setLevel(level: number, color: THREE.Color): void;
  picks: THREE.Object3D[];
}

const L1 = 0.3;
const L2 = 0.29;
const SHOULDER_Y = 0.085;
const NECK = 0.055;

export function buildLamp(o: { steel: THREE.Material; dark: THREE.Material; shadowSize: number; quality: 'alta' | 'media' | 'baixa' }): LampParts {
  const root = new THREE.Group();
  root.name = 'lamp_arm';
  const steel = o.steel;

  // base torneada pesada
  const base = new THREE.Mesh(
    lathe(
      [
        [0.0, 0.0],
        [0.082, 0.0],
        [0.086, 0.004],
        [0.087, 0.012],
        [0.083, 0.019],
        [0.07, 0.024],
        [0.03, 0.028],
        [0.018, 0.034],
        [0.0, 0.034],
      ],
      64,
    ),
    steel,
  );
  root.add(base);
  const felt = new THREE.Mesh(new THREE.CircleGeometry(0.08, 48), o.dark);
  felt.rotation.x = Math.PI / 2;
  felt.position.y = 0.0005;
  root.add(felt);

  const yaw = new THREE.Group();
  yaw.name = 'lamp_yaw';
  root.add(yaw);
  // haste curta e garfo do ombro
  yaw.add(cylinderBetween(new THREE.Vector3(0, 0.03, 0), new THREE.Vector3(0, SHOULDER_Y, 0), 0.009, steel, 20));
  const knuckle = (r: number, w: number) => {
    const g = new THREE.Group();
    const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 24), steel);
    c.rotation.x = Math.PI / 2;
    g.add(c);
    for (const s of [-1, 1]) {
      const knob = new THREE.Mesh(lathe([[0, 0], [r * 1.25, 0], [r * 1.3, 0.003], [r * 1.2, 0.007], [0, 0.008]], 24), o.dark);
      knob.rotation.x = (s * Math.PI) / 2;
      knob.position.z = (s * w) / 2;
      g.add(knob);
    }
    return g;
  };
  const shoulder = new THREE.Group();
  shoulder.position.y = SHOULDER_Y;
  yaw.add(shoulder);
  shoulder.add(knuckle(0.011, 0.03));

  const rodGeo = new THREE.CylinderGeometry(0.0042, 0.0042, 1, 14);
  rodGeo.translate(0, 0.5, 0);
  const lower = new THREE.Group();
  shoulder.add(lower);
  for (const z of [-0.011, 0.011]) {
    const rod = new THREE.Mesh(rodGeo, steel);
    rod.scale.y = L1;
    rod.position.z = z;
    lower.add(rod);
  }
  // mola helicoidal ao longo do braço inferior
  const springPts: THREE.Vector3[] = [];
  for (let i = 0; i <= 160; i++) {
    const t = i / 160;
    const a = t * Math.PI * 2 * 26;
    springPts.push(new THREE.Vector3(Math.cos(a) * 0.0045 - 0.012, 0.05 + t * 0.16, Math.sin(a) * 0.0045));
  }
  const spring = new THREE.Mesh(taperedTube(springPts, () => 0.0008, { radial: 5, segments: 640 }), steel);
  lower.add(spring);

  const elbow = new THREE.Group();
  elbow.position.y = L1;
  lower.add(elbow);
  elbow.add(knuckle(0.01, 0.034));
  const upper = new THREE.Group();
  elbow.add(upper);
  for (const z of [-0.009, 0.009]) {
    const rod = new THREE.Mesh(rodGeo, steel);
    rod.scale.y = L2;
    rod.position.z = z;
    upper.add(rod);
  }
  const wrist = new THREE.Group();
  wrist.position.y = L2;
  upper.add(wrist);
  wrist.add(knuckle(0.0085, 0.026));

  // cúpula (abertura para +Z depois da rotação)
  const head = new THREE.Group();
  head.name = 'lamp_head';
  root.add(head);
  const profile: [number, number][] = [
    [0.014, -0.012],
    [0.016, 0.0],
    [0.032, 0.008],
    [0.048, 0.02],
    [0.06, 0.038],
    [0.067, 0.06],
    [0.07, 0.082],
    [0.071, 0.09],
  ];
  const shadeGeo = lathe(profile, 64);
  shadeGeo.rotateX(Math.PI / 2);
  const shade = new THREE.Mesh(shadeGeo, steel);
  head.add(shade);
  const innerMat = new THREE.MeshStandardMaterial({ color: '#efe6d6', roughness: 0.55, metalness: 0.2, side: THREE.BackSide, emissive: new THREE.Color('#ffd9a0'), emissiveIntensity: 0 });
  const inner = new THREE.Mesh(shadeGeo, innerMat);
  inner.scale.setScalar(0.985);
  inner.castShadow = false;
  head.add(inner);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.071, 0.0022, 10, 72), steel);
  rim.position.z = 0.09;
  head.add(rim);
  const neck = cylinderBetween(new THREE.Vector3(0, 0, -NECK), new THREE.Vector3(0, 0, -0.01), 0.0065, steel, 16);
  head.add(neck);
  const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.016, 0.022, 24), o.dark);
  socket.rotation.x = Math.PI / 2;
  socket.position.z = 0.014;
  head.add(socket);
  const bulbMat = new THREE.MeshStandardMaterial({ color: '#fff6e6', emissive: new THREE.Color('#ffe2b0'), emissiveIntensity: 0, roughness: 0.3 });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.019, 24, 16), bulbMat);
  bulb.position.z = 0.043;
  bulb.castShadow = false;
  bulb.userData.noAO = true;
  head.add(bulb);

  const spot = new THREE.SpotLight('#ffe0b2', 0, 3, 0.62, 0.72, 2);
  spot.position.set(0, 0, 0.05);
  spot.castShadow = true;
  spot.shadow.mapSize.set(o.shadowSize, o.shadowSize);
  spot.shadow.radius = o.quality === 'baixa' ? 1 : 3;
  spot.shadow.bias = -0.0002;
  spot.shadow.normalBias = 0.0012;
  spot.shadow.camera.near = 0.04;
  spot.shadow.camera.far = 1.4;
  spot.shadow.camera.updateProjectionMatrix();
  head.add(spot);
  const spotTarget = new THREE.Object3D();
  root.add(spotTarget);
  spot.target = spotTarget;

  // cone volumétrico suave (aditivo, esmaece perto da câmera e com a distância)
  const coneLen = 0.5;
  const coneGeo = new THREE.CylinderGeometry(0.03, Math.tan(0.62) * coneLen * 0.72, coneLen, 40, 1, true);
  coneGeo.translate(0, -coneLen / 2, 0);
  coneGeo.rotateX(-Math.PI / 2);
  const coneMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uColor: { value: new THREE.Color('#ffd9a0') }, uIntensity: { value: 0 }, uLen: { value: coneLen } },
    vertexShader: /* glsl */ `
      varying vec3 vW; varying vec3 vN; varying float vAlong;
      void main(){
        vAlong = clamp(position.z / ${coneLen.toFixed(3)}, 0.0, 1.0);
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz;
        vN = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uIntensity;
      varying vec3 vW; varying vec3 vN; varying float vAlong;
      void main(){
        vec3 v = normalize(cameraPosition - vW);
        float edge = pow(abs(dot(normalize(vN), v)), 2.0);
        // amostras MSAA na borda extrapolam o varying: sem clamp, pow(negativo) vira NaN
        float al = clamp(vAlong, 0.0, 1.0);
        float fade = pow(1.0 - al, 1.8) * smoothstep(0.0, 0.12, al);
        float near = smoothstep(0.08, 0.35, distance(cameraPosition, vW));
        float a = edge * fade * near * uIntensity;
        gl_FragColor = vec4(uColor * a, a);
      }`,
  });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  cone.position.z = 0.05;
  cone.userData.noAO = true;
  cone.renderOrder = 6;
  cone.castShadow = false;
  cone.receiveShadow = false;
  cone.raycast = () => {};
  head.add(cone);

  root.traverse((c) => {
    if ((c as THREE.Mesh).isMesh && !c.userData.noAO && c !== cone && c !== inner) {
      c.castShadow = true;
      c.receiveShadow = true;
    }
  });
  // a própria cúpula não deve sombrear o bulbo: a SpotLight está à frente da abertura
  shade.castShadow = true;

  const tmp = new THREE.Vector3();
  const tmp2 = new THREE.Vector3();
  const inv = new THREE.Matrix4();

  function pose(headWorld: THREE.Vector3, target: THREE.Vector3) {
    root.updateMatrixWorld(true);
    const aim = tmp2.copy(target).sub(headWorld).normalize();
    // punho atrás da cúpula
    const wristW = headWorld.clone().addScaledVector(aim, -NECK);
    inv.copy(root.matrixWorld).invert();
    const wl = wristW.clone().applyMatrix4(inv);
    yaw.rotation.y = Math.atan2(-wl.z, wl.x);
    const horiz = Math.hypot(wl.x, wl.z);
    const dx = horiz;
    const dy = wl.y - SHOULDER_Y;
    let D = Math.hypot(dx, dy);
    D = THREE.MathUtils.clamp(D, Math.abs(L1 - L2) + 0.12, L1 + L2 - 0.002);
    const base = Math.atan2(dy, dx);
    const cosA = THREE.MathUtils.clamp((L1 * L1 + D * D - L2 * L2) / (2 * L1 * D), -1, 1);
    const th1 = base + Math.acos(cosA); // cotovelo para cima
    const cosB = THREE.MathUtils.clamp((L1 * L1 + L2 * L2 - D * D) / (2 * L1 * L2), -1, 1);
    const elbowInner = Math.acos(cosB);
    // os grupos apontam o eixo +Y: rotação em Z, plano do braço = XY local do yaw
    lower.rotation.z = th1 - Math.PI / 2;
    upper.rotation.z = -(Math.PI - elbowInner);
    root.updateMatrixWorld(true);
    // a cúpula acompanha o punho real (após o limite de alcance)
    const headW = wrist.getWorldPosition(tmp).addScaledVector(aim, NECK);
    head.position.copy(headW.applyMatrix4(inv));
    head.lookAt(target);
    head.updateMatrixWorld(true);
    spotTarget.position.copy(target.clone().applyMatrix4(inv));
    spotTarget.updateMatrixWorld(true);
  }

  // head.lookAt usa coordenadas de mundo: correto porque root não tem rotação
  function bulbWorld(out: THREE.Vector3) {
    return bulb.getWorldPosition(out);
  }
  function aimWorld(out: THREE.Vector3) {
    head.updateMatrixWorld(true);
    return out.set(0, 0, 1).transformDirection(head.matrixWorld);
  }
  function setLevel(level: number, color: THREE.Color) {
    bulbMat.emissiveIntensity = level * 7;
    bulbMat.emissive.copy(color);
    innerMat.emissiveIntensity = level * 0.5;
    spot.intensity = level * 2.6;
    spot.color.copy(color);
    spot.visible = level > 0.002;
    coneMat.uniforms.uIntensity.value = level * 0.07;
    coneMat.uniforms.uColor.value.copy(color);
    cone.visible = level > 0.01;
  }

  return { root, yaw, head, spot, bulbMat, innerMat, cone, coneMat, pose, bulbWorld, aimWorld, setLevel, picks: [shade, base] };
}
