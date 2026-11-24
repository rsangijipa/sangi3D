import * as THREE from '/shared/vendor/three.module.js';
import { MaterialFactory } from '/shared/engine/materials.js';
import { beam, mesh, profile, roundedBox } from '/shared/engine/scene-details.js';

const coastline = angle => 2.62 + .16 * Math.sin(3 * angle) + .10 * Math.cos(5 * angle);
const sunlight = new THREE.Vector3(.35, .14, -.93).normalize();

const skyGLSL = `
  uniform vec3 sun;
  vec3 sky(vec3 direction) {
    float altitude = max(0.0, direction.y);
    vec3 horizon = vec3(.78,.37,.23);
    vec3 zenith = vec3(.19,.29,.47);
    float nearSun = max(0., dot(direction, sun));
    vec3 color = mix(horizon, zenith, smoothstep(0., .57, altitude));
    float band = sin(direction.x * 31. + sin(direction.x * 13.) * 1.5
      + direction.y * 43.) * sin(direction.x * 18. - direction.y * 59.);
    float cloud = smoothstep(.22, .72, band) * smoothstep(.02, .15, altitude)
      * (1. - smoothstep(.23, .46, altitude));
    color = mix(color, vec3(.55,.30,.29) + pow(nearSun, 18.) * vec3(.30,.12,.01), cloud * .52);
    return color + vec3(.79,.38,.12) * pow(nearSun, 28.)
      + vec3(4.,2.8,1.3) * smoothstep(.99938,.99972,nearSun);
  }
`;

const renderOutput = `
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`;

export function buildSea(parent) {
  const uniforms = { time: { value: 0 }, sun: { value: sunlight } };
  const sky = new THREE.ShaderMaterial({
    uniforms, side: THREE.BackSide, depthWrite: false,
    vertexShader: `
      varying vec3 direction;
      void main() {
        direction = position;
        vec3 vertex = position + cameraPosition;
        gl_Position = projectionMatrix * viewMatrix * vec4(vertex, 1.);
      }`,
    fragmentShader: `
      varying vec3 direction;
      ${skyGLSL}
      void main() {
        gl_FragColor = vec4(sky(normalize(direction)), 1.);
        ${renderOutput}
      }`,
  });
  const dome = mesh(parent, new THREE.SphereGeometry(85, 24, 16), sky, 0, 0, 0, false);
  dome.frustumCulled = false;
  dome.renderOrder = -1;
  const water = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      uniform float time;
      varying vec3 world;
      void main() {
        vec4 point = modelMatrix * vec4(position, 1.);
        float near = 1. - smoothstep(10., 28., length(point.xz));
        point.y += near * (.048 * sin(dot(point.xz, vec2(2.3,1.1)) - time * .78)
          + .025 * sin(dot(point.xz, vec2(-1.5,3.3)) - time * 1.15));
        world = point.xyz;
        gl_Position = projectionMatrix * viewMatrix * point;
      }`,
    fragmentShader: `
      uniform float time;
      varying vec3 world;
      ${skyGLSL}
      void main() {
        vec2 p = world.xz;
        vec2 a = vec2(2.3,1.1), b = vec2(-1.5,3.3), c = vec2(6.4,5.7), d = vec2(-8.1,9.3);
        vec2 gradient = .047 * a * cos(dot(p,a) - time * .78)
          + .025 * b * cos(dot(p,b) - time * 1.15)
          + .009 * c * cos(dot(p,c) - time * 1.91)
          + .005 * d * cos(dot(p,d) - time * 2.2);
        float distanceToCamera = length(cameraPosition - world);
        gradient *= 1. - .88 * smoothstep(9.,58.,distanceToCamera);
        vec3 normal = normalize(vec3(-gradient.x,1.,-gradient.y));
        vec3 view = normalize(cameraPosition - world);
        vec3 reflection = reflect(-view,normal);
        float fresnel = .023 + .83 * pow(1. - max(0.,dot(view,normal)), 4.5);
        float angle = atan(p.y,p.x);
        float coast = length(p) - (2.62 + .16*sin(3.*angle) + .10*cos(5.*angle));
        float shallow = 1. - smoothstep(0.,2.3,max(0.,coast));
        vec3 color = mix(vec3(.025,.102,.161), vec3(.094,.273,.267), shallow);
        color = mix(color, sky(reflection) * .74, fresnel);
        float glint = pow(max(0.,dot(reflection,sun)), 72.);
        color += vec3(1.62,.72,.23) * glint;
        float breakup = sin(dot(p,vec2(19.4,12.7))) * sin(dot(p,vec2(-11.9,21.3)));
        float ripple = cos(19. * coast - time * 2.2 + 1.6 * sin(angle * 16.) + breakup);
        float foam = smoothstep(.46,.93,ripple) * (1. - smoothstep(.15,.78,abs(coast)))
          * smoothstep(-.73,.42,breakup);
        color = mix(color, vec3(.63,.74,.69), foam * .79);
        color = mix(color, vec3(.48,.36,.35), smoothstep(48.,92.,distanceToCamera)*.78);
        gl_FragColor = vec4(color,1.);
        ${renderOutput}
      }`,
  });
  const plane = mesh(parent, new THREE.PlaneGeometry(178, 178, 118, 118), water, 0, .11, -12, false);
  plane.rotation.x = -Math.PI / 2;
  return time => { uniforms.time.value = time; };
}

export function buildLand(parent) {
  const coast = new THREE.BufferGeometry();
  const parts = [[.01, .665], [.53, .682], [.83, .655], [.94, .506], [1.01, .28], [1.12, -.13]];
  const positions = [0, .66, 0];
  const colors = [];
  const ids = [];
  const color = new THREE.Color(0x687344);
  colors.push(...color);
  const segments = 96;
  for (let ring = 0; ring < parts.length; ring++) {
    const [fraction, height] = parts[ring];
    for (let i = 0; i < segments; i++) {
      const angle = i * Math.PI * 2 / segments;
      const r = coastline(angle) * fraction;
      const irregular = (.017 + ring * .009) * Math.sin(angle * 17 + ring) + .022 * Math.cos(angle * 9);
      positions.push(Math.cos(angle) * r, height + irregular, Math.sin(angle) * r);
      color.setHex(ring < 3 ? 0x687746 : ring < 5 ? 0x777051 : 0x534c43);
      color.multiplyScalar(.80 + .25 * Math.cos(i * 7.87 + ring) ** 2);
      colors.push(...color);
      const next = (i + 1) % segments;
      const outer = 1 + ring * segments;
      if (ring === 0) ids.push(0, outer + next, outer + i);
      else ids.push(outer + i, outer - segments + i, outer + next, outer - segments + i, outer - segments + next, outer + next);
    }
  }
  coast.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  coast.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  coast.setIndex(ids);
  coast.computeVertexNormals();
  mesh(parent, coast, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }), 0, 0, 0, false);
  const rock = new THREE.IcosahedronGeometry(1, 2);
  const rockPoints = rock.getAttribute('position');
  for (let i = 0; i < rockPoints.count; i++) {
    const x = rockPoints.getX(i), y = rockPoints.getY(i), z = rockPoints.getZ(i);
    const jagged = 1 + .16 * Math.sin(x * 10 + z * 7) * Math.cos(y * 9 - z * 8);
    rockPoints.setXYZ(i, x * jagged, y * jagged, z * jagged);
  }
  rock.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .97 });
  const shore = new THREE.InstancedMesh(rock, material, 86);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < shore.count; i++) {
    const angle = i * 2.39996;
    const r = coastline(angle) - .13 + .23 * Math.sin(i * 2.3);
    dummy.position.set(Math.cos(angle) * r, .22 + .17 * Math.sin(i * 2.97) ** 2, Math.sin(angle) * r);
    const size = .135 + .32 * Math.cos(i * 1.89) ** 4;
    dummy.scale.set(size * 1.16, size * .83, size);
    dummy.rotation.set(i * .7, i, i * 2.2);
    dummy.updateMatrix();
    shore.setMatrixAt(i, dummy.matrix);
    shore.setColorAt(i, color.setHSL(.067 + .037 * Math.sin(i) ** 2, .10 + .15 * Math.cos(i) ** 2, .29 + .16 * Math.sin(i * .6) ** 2));
  }
  shore.castShadow = true;
  shore.receiveShadow = true;
  parent.add(shore);
  for (const [x, z, size] of [[3.6,-8,.67], [4.65,-15,.60], [6.7,-15,1.17], [7.5,-16,.89], [-3.5,-12,.38]]) {
    const reef = mesh(parent, rock, MaterialFactory.stone(0x70605a), x, -.04, z, false);
    reef.scale.set(size * 1.4, size, size * .79);
    reef.rotation.y = z;
  }

  const path = new THREE.InstancedMesh(rock, material, 15);
  for (let i = 0; i < 15; i++) {
    const t = i / 14;
    dummy.position.set(-.23 - .86 * t + .35 * Math.sin(t * 4.8), .681, 1.86 - t * 2.03);
    dummy.rotation.set(0, Math.sin(i * 1.49) * .65, 0);
    dummy.scale.set(.23, .045, .122 + .019 * Math.cos(i * 4));
    dummy.updateMatrix();
    path.setMatrixAt(i, dummy.matrix);
    path.setColorAt(i, color.setHSL(.09, .22, .55 + Math.sin(i) * .065));
  }
  path.receiveShadow = true;
  parent.add(path);

  const blade = new THREE.ConeGeometry(.021, .154, 3);
  const tufts = new THREE.InstancedMesh(blade, material, 944);
  const flowers = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.056, 1), material, 116);
  const blooms = [0xd9994c, 0xad779c, 0xe2b762, 0x9685b0].map(tint => new THREE.Color(tint));
  for (let i = 0; i < tufts.count; i++) {
    const angle = i * 2.39996;
    const r = 1.53 + .78 * Math.sin(i * 7.81) ** 2;
    const x = Math.cos(angle) * r, z = Math.sin(angle) * r;
    dummy.position.set(x, .68, z);
    dummy.scale.setScalar(.32 + .63 * Math.sin(i * 3.71) ** 2);
    dummy.rotation.set(.35 * Math.sin(i), i, .28 * Math.cos(i * 2.1));
    dummy.updateMatrix();
    tufts.setMatrixAt(i, dummy.matrix);
    tufts.setColorAt(i, color.setHSL(.18 + .065 * Math.sin(i * 4) ** 2, .32, .20 + .14 * Math.sin(i) ** 2));
    if (i < flowers.count) {
      dummy.position.y = .741 + .058 * Math.sin(i * 2.5) ** 2;
      dummy.scale.setScalar(.52 + .45 * Math.cos(i) ** 2);
      dummy.updateMatrix();
      flowers.setMatrixAt(i, dummy.matrix);
      flowers.setColorAt(i, blooms[i % blooms.length]);
    }
  }
  tufts.receiveShadow = true;
  flowers.receiveShadow = true;
  parent.add(tufts, flowers);
}

export function buildLighthouse(parent) {
  const tower = new THREE.Group();
  tower.position.set(-1.10, .66, -.38);
  parent.add(tower);
  const stone = MaterialFactory.stone(0xd4c9b1);
  const trim = MaterialFactory.stone(0x8d7964);
  const wood = MaterialFactory.wood(0x795231);
  const copper = new THREE.MeshPhysicalMaterial({ color: 0xb95d3d, metalness: .68, roughness: .48, clearcoat: .11 });
  const brass = MaterialFactory.brass(.42);
  mesh(tower, profile([[0,0],[.48,0],[.48,.16],[.45,.22],[.36,1.65],[.37,1.72],[0,1.72]]), stone, 0,0,0);
  const block = roundedBox(.186, .125, .122, .026);
  for (let y = 0; y < 3; y++) for (let i = 0; i < 15; i++) {
    if (i >= 3 && i <= 4) continue;
    const a = (i + y * .33) / 15 * Math.PI * 2;
    const part = mesh(tower, block, trim, .444 * Math.cos(a), .078 + y * .121, .444 * Math.sin(a));
    part.rotation.y = Math.PI / 2 - a;
  }
  mesh(tower, roundedBox(.33,.62,.08,.035), trim, 0,.29,.425);
  mesh(tower, roundedBox(.25,.57,.054,.025), wood, 0,.28,.463);
  mesh(tower, new THREE.SphereGeometry(.027,12,8), brass, .087,.28,.51);
  const lamp = new THREE.MeshStandardMaterial({ color: 0xffe1a1, emissive: 0xffa33c, emissiveIntensity: 1.35, roughness: .31 });
  mesh(tower, roundedBox(.165,.245,.050,.022), trim, .08,1.12,.375);
  mesh(tower, roundedBox(.116,.195,.033,.013), lamp, .08,1.12,.405,false);
  beam(tower,[.08,1.03,.426],[.08,1.21,.426],.014,.012,wood,false);
  beam(tower,[.03,1.12,.426],[.13,1.12,.426],.014,.012,wood,false);
  mesh(tower, profile([[0,1.64],[.37,1.64],[.49,1.72],[.49,1.81],[.46,1.83],[0,1.83]]), trim, 0,0,0);
  mesh(tower, new THREE.CylinderGeometry(.279,.279,.448,36,1,true),
    new THREE.MeshPhysicalMaterial({ color: 0xe2c798, metalness: .18, roughness: .24, transparent: true, opacity: .21, depthWrite: false, side: THREE.DoubleSide }), 0,2.05,0,false);
  mesh(tower, new THREE.SphereGeometry(.139,24,16), lamp, 0,2.03,0,false);
  const railGeometry = new THREE.TorusGeometry(.447,.013,8,48);
  for (const y of [1.88,2.045]) {
    const ring = mesh(tower, railGeometry, brass, 0,y,0,false);
    ring.rotation.x = Math.PI / 2;
  }
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2;
    const x = Math.cos(a), z = Math.sin(a);
    beam(tower,[x*.45,1.80,z*.45],[x*.45,2.045,z*.45],.018,.018,brass,false);
    if (i % 2 === 0) beam(tower,[x*.277,1.81,z*.277],[x*.277,2.29,z*.277],.024,.024,copper);
  }
  mesh(tower, profile([[0,2.28],[.36,2.28],[.37,2.315],[.30,2.34],[.19,2.44],[.062,2.54],[0,2.57]]), copper, 0,0,0);
  mesh(tower,new THREE.SphereGeometry(.047,16,12),brass,0,2.59,0);
  const light = new THREE.PointLight(0xffb265, 2.3, 5.2);
  light.position.set(0,2.06,.01);
  tower.add(light);
  return { light, lamp };
}

export function buildShelter(parent, drawingTexture) {
  const oak = MaterialFactory.wood(0xa17247, .72);
  const trim = MaterialFactory.wood(0x6e4a32, .77);
  const tile = new THREE.MeshStandardMaterial({ color: 0xa85b43, roughness: .85 });
  const cabin = new THREE.Group();
  cabin.position.set(1.05,.66,-.34);
  cabin.rotation.y = -.28;
  parent.add(cabin);
  mesh(cabin,roundedBox(1.19,.065,1.16,.025),trim,0,.032,0);
  for (let i = 0; i < 8; i++) {
    mesh(cabin,new THREE.BoxGeometry(.97,.102,.84),oak,0,.101+i*.102,0);
    beam(cabin,[-.487,.05+i*.102,.424],[.487,.05+i*.102,.424],.013,.013,trim,false);
  }
  for (const sign of [-1,1]) {
    const roof = mesh(cabin,roundedBox(.73,.063,1.16,.025),tile,sign*.292,.966,0);
    roof.rotation.z = sign * -.47;
    for (let i = 0; i < 7; i++) {
      mesh(roof,new THREE.CylinderGeometry(.031,.031,.68,9),tile,0,.028,(i-3)*.164).rotation.z = Math.PI / 2;
    }
    beam(cabin,[0,1.134,.587],[sign*.64,.821,.587],.054,.058,trim);
  }
  beam(cabin,[0,1.125,-.61],[0,1.125,.61],.066,.08,tile);
  mesh(cabin,roundedBox(.315,.582,.052,.021),trim,-.234,.326,.426);
  mesh(cabin,roundedBox(.282,.395,.051,.022),trim,.228,.491,.429);
  const warmGlass = new THREE.MeshStandardMaterial({ color: 0xffd89a, emissive: 0xf0a244, emissiveIntensity: .96 });
  mesh(cabin,roundedBox(.222,.318,.028,.013),warmGlass,.228,.491,.464,false);
  beam(cabin,[.228,.337,.486],[.228,.645,.486],.020,.022,trim);
  beam(cabin,[.122,.49,.486],[.335,.49,.486],.021,.022,trim);
  mesh(cabin,roundedBox(.33,.046,.137,.016),oak,.228,.308,.488);
  const light = new THREE.PointLight(0xffbe78, .75, 2);
  light.position.set(.22,.47,.67);
  cabin.add(light);

  for (let i = 0; i < 8; i++) mesh(parent, new THREE.BoxGeometry(1.17,.042,.127), oak,.98,.699,.76+i*.131);
  mesh(parent, roundedBox(.81,.077,.56,.027), oak,.94,1.032,1.11);
  for (const x of [.62,1.26]) for (const z of [.91,1.32]) {
    beam(parent,[x,.72,z],[x,1.02,z],.055,.055,trim);
  }
  const drawing = mesh(parent, new THREE.PlaneGeometry(.47,.248),
    new THREE.MeshStandardMaterial({ map: drawingTexture, color: 0xfff3d6, roughness: .92 }), .97,1.072,1.12,false);
  drawing.rotation.x = -Math.PI / 2;
  const pencil = mesh(parent,new THREE.CylinderGeometry(.012,.012,.259,6),trim,.638,1.084,1.11);
  pencil.rotation.set(Math.PI / 2,0,.22);
  for (const z of [.86,1.23]) mesh(parent, roundedBox(.081,.267,.08,.019),trim,-.20,.828,z);
  mesh(parent, roundedBox(.69,.080,.26,.025),oak,-.20,.976,1.05);
}
