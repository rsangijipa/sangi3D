import * as T from 'three';
import { box, cylinder, rod, V, plant, mesh, pipe } from '../core/models';

/** Direção da luz do sol (do sol para a cena), coerente com Stage.sun em (-4,8,5). */
export const SUN_DIR=new T.Vector3(4,-8,-5).normalize();

const textures:T.Texture[]=[];
function rng(seed:number){return()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296}}
function canvas(size:number){const c=document.createElement('canvas');c.width=c.height=size;return [c,c.getContext('2d')!] as const}
function tex(c:HTMLCanvasElement,srgb:boolean,repeat=1){const t=new T.CanvasTexture(c);if(srgb)t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(repeat,repeat);t.anisotropy=8;textures.push(t);return t}

/** Terrazo mineral com juntas de placa: mapa de cor + rugosidade. */
function terrazzo(){const S=1024,[c,x]=canvas(S),[r,y]=canvas(S),rand=rng(91);x.fillStyle='#d9cfbf';x.fillRect(0,0,S,S);y.fillStyle='#5a5a5a';y.fillRect(0,0,S,S);
 for(let i=0;i<260;i++){const px=rand()*S,py=rand()*S,rr=80+rand()*160,g=x.createRadialGradient(px,py,0,px,py,rr);g.addColorStop(0,rand()<.5?'#e6dccd22':'#c7b9a422');g.addColorStop(1,'#0000');x.fillStyle=g;x.fillRect(px-rr,py-rr,rr*2,rr*2)}
 const chips=['#b8a58c','#efe7da','#9d907c','#c4917e','#7f8a80','#e0c9a6','#5f5850'];for(let i=0;i<5200;i++){const px=rand()*S,py=rand()*S,s=1+rand()*rand()*7,col=chips[Math.floor(rand()*chips.length)];x.fillStyle=col;y.fillStyle=rand()<.5?'#3e3e3e':'#6c6c6c';x.beginPath();y.beginPath();const n=5+Math.floor(rand()*3),a0=rand()*6.28;for(let k=0;k<n;k++){const a=a0+k/n*6.28,rr=s*(.6+rand()*.5);x.lineTo(px+Math.cos(a)*rr,py+Math.sin(a)*rr);y.lineTo(px+Math.cos(a)*rr,py+Math.sin(a)*rr)}x.fill();y.fill()}
 x.strokeStyle='#a99a85';x.lineWidth=3;y.strokeStyle='#d0d0d0';y.lineWidth=5;for(const ctx of[x,y]){ctx.beginPath();ctx.moveTo(0,1.5);ctx.lineTo(S,1.5);ctx.moveTo(1.5,0);ctx.lineTo(1.5,S);ctx.moveTo(0,S/2);ctx.lineTo(S,S/2);ctx.moveTo(S/2,0);ctx.lineTo(S/2,S);ctx.stroke()}
 return {map:tex(c,true,6),rough:tex(r,false,6)}}

/** Reboco de cal com manchas suaves e poros. */
function plaster(base:string,seed=7){const S=512,[c,x]=canvas(S),rand=rng(seed);x.fillStyle=base;x.fillRect(0,0,S,S);for(let i=0;i<420;i++){const px=rand()*S,py=rand()*S,rr=20+rand()*70,g=x.createRadialGradient(px,py,0,px,py,rr);g.addColorStop(0,rand()<.5?'#ffffff14':'#6b5a4410');g.addColorStop(1,'#0000');x.fillStyle=g;x.fillRect(px-rr,py-rr,rr*2,rr*2)}for(let i=0;i<9000;i++){x.fillStyle=rand()<.5?'#00000012':'#ffffff10';x.fillRect(rand()*S,rand()*S,1+rand()*1.5,1+rand()*1.5)}return tex(c,true,2)}

/** Travertino: veios horizontais para colunas e bancos. */
function travertine(){const S=512,[c,x]=canvas(S),rand=rng(33);x.fillStyle='#d8ccb6';x.fillRect(0,0,S,S);for(let i=0;i<140;i++){const yy=rand()*S;x.strokeStyle=rand()<.6?'#b9a88c33':'#f4ecdf40';x.lineWidth=1+rand()*4;x.beginPath();x.moveTo(0,yy);for(let k=1;k<=8;k++)x.lineTo(k*S/8,yy+(rand()-.5)*10);x.stroke()}for(let i=0;i<500;i++){x.fillStyle='#8f7d6230';x.beginPath();x.ellipse(rand()*S,rand()*S,1+rand()*5,.6+rand()*1.2,0,0,6.28);x.fill()}return tex(c,true,1)}

/** Textura de brilho radial suave (feixes, poeira, poças de cor). */
export function softSprite(){const S=128,[c,x]=canvas(S),g=x.createRadialGradient(S/2,S/2,0,S/2,S/2,S/2);g.addColorStop(0,'#ffffffff');g.addColorStop(.35,'#ffffff99');g.addColorStop(1,'#ffffff00');x.fillStyle=g;x.fillRect(0,0,S,S);return tex(c,false,1)}

export function disposePavilion(){textures.splice(0).forEach(t=>t.dispose())}

export function buildPavilion(p:T.Group,palette:string[]){
 const tz=terrazzo(),wallMap=plaster('#e6dac4'),trav=travertine();
 const floorMat=new T.MeshPhysicalMaterial({map:tz.map,roughnessMap:tz.rough,roughness:.95,clearcoat:.35,clearcoatRoughness:.22,envMapIntensity:.7});
 const stoneMat=new T.MeshStandardMaterial({map:trav,roughness:.78,envMapIntensity:.55});
 const wallMat=new T.MeshStandardMaterial({map:wallMap,roughness:.93,envMapIntensity:.5});
 const brass=new T.MeshStandardMaterial({color:'#b39563',metalness:.9,roughness:.3,envMapIntensity:1.1});
 const ground=new T.MeshStandardMaterial({color:'#a5a684',roughness:1});

 // Piso do pavilhão e jardim exterior.
 const floor=mesh(new T.PlaneGeometry(14,12),floorMat,p,0,0,0);floor.rotation.x=-Math.PI/2;floor.castShadow=false;
 box(p,14.3,.16,12.3,stoneMat,0,-.085,0,.05).castShadow=false;
 const lawn=mesh(new T.CircleGeometry(140,64),ground,p,0,-.17,0);lawn.rotation.x=-Math.PI/2;lawn.castShadow=false;
 const bark=new T.MeshStandardMaterial({color:'#6d5a48',roughness:.95}),crown=new T.MeshStandardMaterial({color:'#7d8c63',roughness:.9,flatShading:true}),crown2=new T.MeshStandardMaterial({color:'#93a06f',roughness:.9,flatShading:true});
 for(let j=0;j<9;j++){const a=j/9*Math.PI*2+.3,r=22+(j%3)*5;if(Math.sin(a)<-.2&&Math.abs(Math.cos(a))<.5)continue;const x=Math.cos(a)*r,z=Math.sin(a)*r,h=3+(j%3);const tr=cylinder(p,.18,.28,h,bark,x,h/2-.2,z,8);tr.castShadow=false;const c1=mesh(new T.IcosahedronGeometry(1.8+(j%2)*.6,1),j%2?crown:crown2,p,x,h+.6,z);c1.scale.set(1,.85,1);c1.castShadow=false;const c2=mesh(new T.IcosahedronGeometry(1.2,1),j%2?crown2:crown,p,x+.8,h+1.5,z-.4);c2.castShadow=false}
 const hedge=new T.MeshStandardMaterial({color:'#6c7a5c',roughness:.95});for(const s of[-1,1])box(p,1,1.8,13,hedge,s*8.4,.75,-.4,.4);box(p,17.8,1.8,1,hedge,0,.75,-6.4,.4);

 // Parede de fundo com arcos em relevo.
 box(p,14,5,.3,wallMat,0,2.5,-4.85,.04);
 const rim=new T.MeshStandardMaterial({map:trav,roughness:.7});
 const nicheMat=new T.MeshStandardMaterial({color:'#d3c5ad',roughness:.96});
 for(let j=0;j<3;j++){const curve:T.Vector3[]=[];for(let i=0;i<=40;i++){const a=i/40*Math.PI;curve.push(V(Math.cos(a)*1.45-3.3+j*3.3,2.3+Math.sin(a)*1.45,-4.66))}pipe(p,curve,.08,rim,60);for(const s of[-1,1])rod(p,V(-3.3+j*3.3+s*1.45,0,-4.66),V(-3.3+j*3.3+s*1.45,2.3,-4.66),.08,rim);
  // Nicho recuado mais escuro dentro de cada arco.
  const shape=new T.Shape();shape.moveTo(-1.37,0);shape.lineTo(-1.37,2.3);shape.absarc(0,2.3,1.37,Math.PI,0,true);shape.lineTo(1.37,0);shape.closePath();const niche=mesh(new T.ShapeGeometry(shape,24),nicheMat,p,-3.3+j*3.3,0,-4.69);niche.castShadow=false}
 box(p,14,.22,.42,stoneMat,0,5,-4.75,.05);box(p,14,.14,.36,stoneMat,0,.07,-4.62,.04);

 // Colunas, capitéis e vigas de latão do pergolado.
 for(const x of[-5.2,5.2])for(const z of[-3.6,0,3.4]){cylinder(p,.19,.25,4.3,stoneMat,x,2.15,z,40);box(p,.62,.14,.62,stoneMat,x,4.33,z,.03);box(p,.66,.16,.66,stoneMat,x,.08,z,.03)}
 for(const x of[-5.2,5.2])rod(p,V(x,4.47,-4.1),V(x,4.47,3.9),.09,brass);for(let j=0;j<9;j++)rod(p,V(-5.4,4.6,-3.9+j*.95),V(5.4,4.6,-3.9+j*.95),.035,brass);

 // Toldos de seda suspensos (catenária), animados por step().
 const awnings:{geo:T.BufferGeometry;base:Float32Array}[]=[];const awnCols=[palette[0],'#efe4d0',palette[3],'#efe4d0'];
 for(let j=0;j<4;j++){const g=new T.PlaneGeometry(1.15,7.6,6,30);g.rotateX(-Math.PI/2);const pos=g.attributes.position;for(let i=0;i<pos.count;i++){const z=pos.getZ(i);pos.setY(i,-(1-(z/3.8)**2)*.55)}g.computeVertexNormals();const m=new T.MeshPhysicalMaterial({color:awnCols[j],roughness:.8,sheen:.8,sheenRoughness:.6,sheenColor:new T.Color('#fff4e2'),side:T.DoubleSide,transparent:true,opacity:.82});const o=mesh(g,m,p,-3.3+j*2.2,4.55,-.1);o.receiveShadow=false;awnings.push({geo:g,base:(pos.array as Float32Array).slice()})}

 // Bancos de pedra para escala humana.
 for(const s of[-1,1]){box(p,2,.12,.55,stoneMat,s*3.7,.45,2.3,.04);for(const dx of[-.75,.75])box(p,.16,.42,.46,stoneMat,s*3.7+dx,.21,2.3,.03)}
 plant(p,-4.4,-3.9,1.7);plant(p,4.4,-3.9,1.9);plant(p,-4.5,1.2,1.3);

 // Feixes de luz através do pergolado (aditivos, sem escrita de profundidade).
 const shaftMat=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{uTime:{value:0},uColor:{value:new T.Color('#ffe2b8')},uStrength:{value:.07}},vertexShader:'varying vec2 vUv;varying vec3 vN;varying vec3 vV;void main(){vUv=uv;vec4 mv=modelViewMatrix*vec4(position,1.0);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',fragmentShader:'uniform float uTime;uniform vec3 uColor;uniform float uStrength;varying vec2 vUv;varying vec3 vN;varying vec3 vV;void main(){float edge=clamp(abs(dot(normalize(vN),normalize(vV))),0.0,1.0);edge=edge*edge;float fade=smoothstep(0.0,0.25,vUv.y)*smoothstep(1.0,0.7,vUv.y);float flick=0.85+0.15*sin(uTime*0.7+vUv.y*6.0);gl_FragColor=vec4(uColor*uStrength*edge*fade*flick,1.0);}'});
 const up=V(0,1,0),q=new T.Quaternion().setFromUnitVectors(up,SUN_DIR.clone().negate());const shafts:T.Mesh[]=[];
 for(const [fx,fz,r]of[[-2.6,.9,.55],[.6,1.6,.7],[3.2,.4,.5],[-.8,-2.4,.45]]as const){const L=9,g=new T.CylinderGeometry(r*.8,r*1.25,L,24,1,true);const m=new T.Mesh(g,shaftMat);m.quaternion.copy(q);m.position.set(fx,0,fz).addScaledVector(SUN_DIR,-L/2);m.renderOrder=20;m.frustumCulled=false;p.add(m);shafts.push(m)}

 // Partículas de poeira dourada flutuando na luz.
 const DUST=420,dpos=new Float32Array(DUST*3),dseed=new Float32Array(DUST),rand=rng(5);for(let i=0;i<DUST;i++){dpos[i*3]=(rand()-.5)*9;dpos[i*3+1]=.2+rand()*4;dpos[i*3+2]=(rand()-.5)*7;dseed[i]=rand()*100}
 const dgeo=new T.BufferGeometry();dgeo.setAttribute('position',new T.BufferAttribute(dpos,3));const dust=new T.Points(dgeo,new T.PointsMaterial({size:.035,map:softSprite(),color:'#fff0d2',transparent:true,opacity:.55,depthWrite:false,blending:T.AdditiveBlending,sizeAttenuation:true}));dust.frustumCulled=false;p.add(dust);

 return {step(t:number,dt:number,wind:number){shaftMat.uniforms.uTime.value=t;
  for(const [k,a]of awnings.entries()){const pos=a.geo.attributes.position;for(let i=0;i<pos.count;i++){const z=a.base[i*3+2],sag=1-(z/3.8)**2;pos.setY(i,a.base[i*3+1]+Math.sin(t*(.9+k*.13)+z*.8+k)*.05*sag*(.4+wind))}pos.needsUpdate=true;if((Math.floor(t*60)+k)%6===0)a.geo.computeVertexNormals()}
  for(let i=0;i<DUST;i++){const s=dseed[i];dpos[i*3]+=(Math.sin(t*.3+s)*.04+wind*.12)*dt;dpos[i*3+1]+=Math.sin(t*.5+s*1.7)*.03*dt;dpos[i*3+2]+=Math.cos(t*.27+s)*.04*dt;if(dpos[i*3]>4.5)dpos[i*3]-=9}dgeo.attributes.position.needsUpdate=true}}
}
