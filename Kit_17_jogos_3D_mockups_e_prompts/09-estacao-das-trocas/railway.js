import * as THREE from '/shared/vendor/three.module.js';
import { MaterialFactory } from '/shared/engine/materials.js';
import { beam, makePlant, mesh, profile, roundedBox } from '/shared/engine/scene-details.js';
import { makeDial } from '/shared/engine/workshop.js';

const green = new THREE.MeshStandardMaterial({ color: 0x395748, roughness: .49, metalness: .39 });
const brass = new THREE.MeshStandardMaterial({ color: 0xb28a52, roughness: .36, metalness: .83 });
const steel = new THREE.MeshStandardMaterial({ color: 0x4d493f, roughness: .42, metalness: .83 });
const rubber = new THREE.MeshStandardMaterial({ color: 0x3e3a31, roughness: .87 });
const lampGlass = new THREE.MeshStandardMaterial({ color: 0xffdeaa, emissive: 0xffb661, emissiveIntensity: 1.08, roughness: .4 });

function sign(parent, text, width, x, y, z, material) {
  mesh(parent, roundedBox(width, .36, .09, .034), material, x, y, z);
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#e5cfaa';
  ctx.fillRect(0,0,512,100);
  ctx.strokeStyle = '#675135';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(5,5,502,90,14);
  ctx.stroke();
  ctx.font = 'bold 52px Georgia';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#30483a';
  ctx.fillText(text,256,52,456);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  mesh(parent,new THREE.PlaneGeometry(width-.075,.285),
    new THREE.MeshStandardMaterial({ map, roughness: .82 }),x,y,z+.048,false);
}

export function buildStation(station) {
  const walnut = MaterialFactory.wood(0x7e5439,.66);
  const oak = MaterialFactory.wood(0xa5784a,.57);
  const plaster = new THREE.MeshStandardMaterial({ color: 0x9e8a73, roughness: .91 });
  const stone = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .96 });
  const floor = new THREE.InstancedMesh(new THREE.BoxGeometry(.53,.09,.409),stone,240);
  const dummy = new THREE.Object3D();
  const tint = new THREE.Color();
  for (let i = 0; i < floor.count; i++) {
    const x = i%24, z = Math.floor(i/24);
    dummy.position.set((x-11.5)*.538+(z%2)*.264, .355, -.39+z*.418);
    dummy.updateMatrix();
    floor.setMatrixAt(i,dummy.matrix);
    floor.setColorAt(i,tint.setHSL(.079+.027*Math.sin(i)**2,.17+.09*Math.cos(i)**2,.53+.20*Math.sin(i*1.74)**2));
  }
  floor.receiveShadow = true;
  station.add(floor);
  mesh(station,new THREE.BoxGeometry(13,.34,4.2),plaster,0,.14,1.5,false);
  mesh(station,new THREE.BoxGeometry(13,.013,.064),
    new THREE.MeshStandardMaterial({ color: 0xc2a16a, roughness: .89 }),0,.401,-.38,false);
  mesh(station,new THREE.BoxGeometry(23,.09,9),new THREE.MeshStandardMaterial({ color: 0x5c554b, roughness: .95 }),0,-.045,-2.5,false);
  const sleepers = new THREE.InstancedMesh(new THREE.BoxGeometry(.092,.040,1.21),walnut,69);
  for (let i = 0; i < sleepers.count; i++) sleepers.setMatrixAt(i,dummy.matrix.makeTranslation((i-34)*.25,.024,-1.16));
  sleepers.receiveShadow = true;
  station.add(sleepers);
  for (const z of [-.813,-1.51]) {
    mesh(station,new THREE.BoxGeometry(20,.08,.063),steel,0,.076,z,false);
    mesh(station,new THREE.BoxGeometry(20,.022,.083),steel,0,.118,z,false);
  }

  const arc = t => [-4.9 + 9.8*t, 2.53 + 2.21*Math.sin(Math.PI*t)**.83];
  const woodMasonry = new THREE.MeshStandardMaterial({ color: 0xae8569, roughness: .92 });
  const blueGlass = new THREE.MeshStandardMaterial({ color: 0x748c8a, roughness: .3, metalness: .33 });
  for (let i=0; i<9; i++) {
    const x=(i-4)*1.83, h=2.95+.54*Math.cos(i*2.56);
    mesh(station,new THREE.BoxGeometry(1.76,h,.45),i%2 ? plaster : woodMasonry,x,h/2,-5.6,false);
    mesh(station,new THREE.BoxGeometry(1.81,.098,.63),walnut,x,h,-5.61,false);
    for (let row=0;row<2;row++) for (const dx of [-.49,0,.49]) {
      mesh(station,new THREE.BoxGeometry(.26,.55,.035),walnut,x+dx,.78+row*1.09,-5.36,false);
      mesh(station,new THREE.BoxGeometry(.19,.465,.042),blueGlass,x+dx,.78+row*1.09,-5.337,false);
    }
  }
  const glazing = new THREE.MeshPhysicalMaterial({
    color: 0xc8c5a5, roughness: .29, metalness: .14, transparent: true, opacity: .145,
    side: THREE.DoubleSide, depthWrite: false
  });
  for (const z of [-3.48,-1.56,.38,2.30,4.24]) {
    const points = Array.from({ length: 25 }, (_,i) => {
      const [x,y]=arc(i/24);
      return new THREE.Vector3(x,y,z);
    });
    mesh(station,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),42,.077,10,false),green,0,0,0);
    for (const x of [-4.90,4.90]) {
      mesh(station,profile([[0,.39],[.15,.39],[.15,.48],[.102,.51],[.075,.62],
        [.075,2.37],[.106,2.41],[.123,2.51],[.08,2.61],[0,2.61]],22),green,x,0,z);
      mesh(station,new THREE.TorusGeometry(.109,.022,7,18),green,x,2.28,z).rotation.x=Math.PI/2;
    }
  }
  for (let i=0;i<16;i++) {
    const [ax,ay]=arc(i/16), [bx,by]=arc((i+1)/16);
    const strip = new THREE.PlaneGeometry(Math.hypot(bx-ax,by-ay),7.72);
    const pane = mesh(station,strip,glazing,(ax+bx)/2,(ay+by)/2+.04,.38,false);
    pane.rotation.set(-Math.PI/2,0,Math.atan2(by-ay,bx-ax),'ZYX');
    beam(station,[ax,ay,-3.48],[ax,ay,4.24],.055,.064,green);
  }
  for (const [x,z] of [[-3.25,-.25],[.85,-1.6],[2.92,.46]]) {
    beam(station,[x,3.10,z],[x,4.8,z],.027,.027,brass,false);
    mesh(station,profile([[.20,0],[.22,.025],[.21,.067],[.14,.16],[.052,.21],[0,.219]],30),brass,x,2.93,z);
    mesh(station,new THREE.SphereGeometry(.09,16,12),lampGlass,x,2.932,z,false);
    const light = new THREE.PointLight(0xffc480,5.1,3.7);
    light.position.set(x,2.90,z);
    station.add(light);
  }
  sign(station,'Estação das Trocas',2.98,-.42,3.07,-.21,walnut);
  for (const x of [-1.69,.85]) beam(station,[x,3.22,-.22],[x,4.45,-.22],.024,.024,brass,false);
  const clock = new THREE.Group();
  clock.position.set(-3.54,2.02,-.12);
  station.add(clock);
  makeDial(clock,.34,walnut,brass);
  for(const [angle,length] of [[.58,.17],[-.76,.11]]) {
    const hand=mesh(clock,new THREE.BoxGeometry(.018,length,.016),steel,0,0,.126,false);
    hand.rotation.z=angle;
    hand.translateY(length/2);
  }
  const clay = new THREE.MeshStandardMaterial({ color: 0xb89070, roughness: .9 });
  makePlant(station,-3.72,.88,1.03,12,clay,.40);
  makePlant(station,3.58,.26,1.03,3,clay,.40);
  mesh(station,roundedBox(1.17,.085,.34,.029),walnut,-2.96,.73,1.76);
  for(const x of [-3.36,-2.55]) mesh(station,roundedBox(.095,.34,.27,.033),green,x,.55,1.76);
  return { oak, walnut };
}

export function createCar(parent, position, color, destination, oak, walnut) {
  const car = new THREE.Group();
  car.position.x = position;
  parent.add(car);
  const cloth = new THREE.MeshPhysicalMaterial({ color, roughness: .91, sheen: .8, sheenColor: 0x615946 });
  const roof = new THREE.MeshPhysicalMaterial({ color: 0xc8b497, roughness: .87, sheen: .54 });
  mesh(car,roundedBox(1.57,.11,.84,.036),steel,0,-.218,0);
  mesh(car,roundedBox(1.67,.21,.90,.091),roof,0,.83,0);
  for (const x of [-.753,.753]) mesh(car,roundedBox(.115,.86,.82,.049),cloth,x,.323,0);
  mesh(car,roundedBox(1.55,.88,.065,.027),cloth,0,.327,-.385);
  mesh(car,roundedBox(1.57,.19,.105,.037),cloth,0,.653,.388);
  for (const x of [-.53,.52]) {
    mesh(car,roundedBox(.515,.73,.076,.034),cloth,x,.235,.378);
    mesh(car,roundedBox(.344,.331,.053,.020),oak,x,.316,.429);
    mesh(car,roundedBox(.267,.258,.031,.013),lampGlass,x,.316,.460,false);
    mesh(car,new THREE.BoxGeometry(.024,.27,.024),walnut,x,.316,.482);
    mesh(car,new THREE.BoxGeometry(.28,.023,.025),walnut,x,.317,.482);
  }
  const interior = new THREE.MeshStandardMaterial({color:0x886140,roughness:.87});
  mesh(car,roundedBox(.51,.05,.70,.018),oak,0,-.137,-.01);
  mesh(car,roundedBox(.62,.115,.25,.028),interior,0,.056,-.208);
  mesh(car,roundedBox(.62,.22,.072,.028),interior,0,.174,-.30);
  mesh(car,roundedBox(.47,.065,.19,.019),oak,0,-.20,.437);
  sign(car,destination,.89,0,.650,.419,walnut);
  const door = new THREE.Group();
  door.position.set(-.256,-.104,.446);
  car.add(door);
  const doorWood = roundedBox(.48,.662,.06,.026);
  mesh(door,doorWood,oak,.241,.317,0);
  mesh(door,roundedBox(.25,.309,.021,.009),walnut,.242,.385,.036);
  mesh(door,roundedBox(.199,.256,.024,.009),lampGlass,.242,.385,.05,false);
  mesh(door,new THREE.SphereGeometry(.028,14,10),brass,.439,.28,.057);
  const wheels=[];
  for(const x of [-.48,.48]) for(const z of [-.349,.349]) {
    const wheel = mesh(car,new THREE.CylinderGeometry(.137,.137,.10,24),rubber,x,-.357,z);
    wheel.rotation.x = Math.PI/2;
    mesh(wheel,new THREE.CylinderGeometry(.099,.099,.109,20),steel,0,0,0);
    mesh(wheel,new THREE.CylinderGeometry(.035,.035,.128,16),brass,0,0,0);
    wheels.push(wheel);
  }
  for(const x of [-.866,.866]) {
    const coupling = mesh(car,new THREE.CylinderGeometry(.035,.035,.18,12),steel,x,-.16,0);
    coupling.rotation.z = Math.PI/2;
  }
  return { group: car, door, wheels };
}

export function makePassenger(station, colors, face) {
  const figure = new THREE.Group();
  station.add(figure);
  const knit = new THREE.MeshPhysicalMaterial({color:colors[0],roughness:.91,sheen:.85,sheenColor:0xa49165});
  const cloth=new THREE.MeshStandardMaterial({color:colors[1],roughness:.88});
  const wood=MaterialFactory.wood(0xd6a477,.62);
  const hair=MaterialFactory.wood(0x74452e,.79);
  mesh(figure,roundedBox(.235,.274,.167,.072),knit,0,.307,0);
  mesh(figure,new THREE.SphereGeometry(.122,30,18),wood,0,.544,0);
  mesh(figure,new THREE.SphereGeometry(.128,28,16,0,Math.PI*2,0,Math.PI*.66),hair,0,.563,.020);
  mesh(figure,roundedBox(.163,.196,.085,.041),cloth,0,.302,.105);
  if(face) mesh(figure,roundedBox(.161,.107,.026,.01),MaterialFactory.paper(0xf4ddab),.155,.330,-.108,false);
  const legs = [];
  for(const x of [-.068,.068]) {
    const leg = new THREE.Group();
    leg.position.set(x,.205,0);
    figure.add(leg);
    mesh(leg,roundedBox(.081,.145,.078,.028),cloth,0,-.065,0);
    mesh(leg,roundedBox(.091,.049,.109,.018),rubber,0,-.174,-.021);
    legs.push(leg);
    const arm = mesh(figure,roundedBox(.071,.221,.091,.028),knit,x*2,.277,0);
    arm.rotation.z=x*.95;
    mesh(figure,new THREE.SphereGeometry(.043,16,10),wood,x*2,.149,-.009);
  }
  return { figure, legs };
}
