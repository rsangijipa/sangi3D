import * as THREE from 'three';
import { lathe, mesh } from '../core/model';

/**
 * Lupa circular em suporte (magnifier). A lente mostra uma vista real ampliada (1–3×):
 * uma câmera secundária mira o mesmo ponto que o olho vê através da lente, com campo de visão reduzido,
 * e renderiza num alvo HDR que a lente exibe. Sem refração cara: funciona igual no celular.
 */

export const LENS_R = 0.05;

export interface Magnifier {
  stand: THREE.Group;
  lens: THREE.Group;
  lensMesh: THREE.Mesh;
  rt: THREE.WebGLRenderTarget;
  cam: THREE.PerspectiveCamera;
  /** Pose de repouso da lente no suporte (mundo). */
  restPos: THREE.Vector3;
  restQuat: THREE.Quaternion;
  picks: THREE.Object3D[];
  dispose(): void;
}

export function buildMagnifier(o: { steel: THREE.Material; dark: THREE.Material; rtSize: number; samples: number }): Magnifier {
  const stand = new THREE.Group();
  stand.name = 'magnifier';
  stand.add(
    mesh(
      lathe(
        [
          [0, 0],
          [0.058, 0],
          [0.061, 0.004],
          [0.06, 0.011],
          [0.045, 0.016],
          [0.012, 0.019],
          [0, 0.019],
        ],
        48,
      ),
      o.steel,
    ),
  );
  stand.add(mesh(new THREE.CylinderGeometry(0.0055, 0.0065, 0.13, 20), o.steel, 0, 0.083, 0));
  const collar = mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.014, 20), o.dark, 0, 0.15, 0);
  stand.add(collar);
  // garfo
  for (const s of [-1, 1]) {
    stand.add(mesh(new THREE.BoxGeometry(0.004, 0.04, 0.006), o.steel, s * (LENS_R + 0.008), 0.175, 0));
  }
  stand.add(mesh(new THREE.BoxGeometry((LENS_R + 0.008) * 2 + 0.004, 0.005, 0.006), o.steel, 0, 0.157, 0));

  // lente removível: aro, vidro e cabo curto
  const lens = new THREE.Group();
  lens.name = 'magnifier_lens';
  const ring = mesh(new THREE.TorusGeometry(LENS_R + 0.003, 0.0045, 16, 72), o.steel);
  lens.add(ring);
  const bezel = mesh(new THREE.TorusGeometry(LENS_R + 0.0005, 0.0018, 8, 72), o.dark);
  bezel.position.z = -0.0015;
  lens.add(bezel);
  for (const s of [-1, 1]) {
    const pin = mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.01, 12), o.dark, s * (LENS_R + 0.009), 0, 0);
    pin.rotation.z = Math.PI / 2;
    lens.add(pin);
  }

  const rt = new THREE.WebGLRenderTarget(o.rtSize, o.rtSize, { type: THREE.HalfFloatType, samples: o.samples });
  rt.texture.colorSpace = THREE.LinearSRGBColorSpace;
  const lensMat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: { tView: { value: rt.texture }, uOn: { value: 0 }, uTint: { value: new THREE.Color('#2a3a3a') } },
    vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D tView; uniform float uOn; uniform vec3 uTint; varying vec2 vUv;
      void main(){
        vec2 d = vUv - 0.5;
        float r = length(d) * 2.0;
        // leve distorção de barril na borda, como uma lente simples
        vec2 uv = 0.5 + d * (1.0 - 0.08 * r * r);
        vec3 view = texture2D(tView, uv).rgb;
        float rim = smoothstep(0.78, 1.0, r);
        vec3 glass = uTint * 0.06;
        vec3 col = mix(glass, view, uOn) * (1.0 - rim * 0.55);
        gl_FragColor = vec4(col, mix(0.16 + rim * 0.3, 1.0, uOn));
      }`,
  });
  const lensMesh = new THREE.Mesh(new THREE.CircleGeometry(LENS_R, 64), lensMat);
  lensMesh.castShadow = false;
  lensMesh.userData.noAO = true;
  lens.add(lensMesh);
  const glare = new THREE.Mesh(
    new THREE.CircleGeometry(LENS_R, 48),
    new THREE.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: 0.1, roughness: 0.04, metalness: 0, clearcoat: 1, depthWrite: false }),
  );
  glare.position.z = 0.0008;
  glare.userData.noAO = true;
  glare.castShadow = false;
  glare.raycast = () => {};
  lens.add(glare);
  lens.traverse((c) => {
    if ((c as THREE.Mesh).isMesh && c !== lensMesh && c !== glare) c.castShadow = true;
  });

  // pose de repouso: encaixada no garfo, inclinada para a frente
  const restLocal = new THREE.Vector3(0, 0.2, 0);
  const restQuatLocal = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.25, 0, 0));
  const cam = new THREE.PerspectiveCamera(10, 1, 0.01, 6);

  return {
    stand,
    lens,
    lensMesh,
    rt,
    cam,
    restPos: restLocal,
    restQuat: restQuatLocal,
    picks: [ring, lensMesh, collar],
    dispose() {
      rt.dispose();
      lensMat.dispose();
    },
  };
}
