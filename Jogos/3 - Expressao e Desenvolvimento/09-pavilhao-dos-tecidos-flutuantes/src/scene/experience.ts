import * as T from 'three';
import type {Env,Experience} from '../core/types';
import {rod,V,pick} from '../core/models';
import {buildPavilion,disposePavilion,softSprite,SUN_DIR} from './pavilion';

// Malha de cada painel (colunas × linhas). O estado salvo usa 3 painéis × N × M × xyz.
const N=17,M=23,W=1.65,H=2.5,TOP=3.35,SLIT0=3,SLIT1=N-4;// a abertura é uma fenda: bordas laterais seguem costuradas
type Kind='seda'|'linho'|'veu';
const KINDS:Kind[]=['seda','linho','veu'];
const NAMES=['Seda rosa','Linho verde-água','Véu violeta'];

const DISCOVERIES:{id:string;title:string;hint:string}[]=[
 {id:'puxar',title:'Puxar e soltar',hint:'Segure uma região de um tecido e solte para ver o retorno.'},
 {id:'vento',title:'Vento forte',hint:'Leve o vento acima de 70% e observe as camadas se afastarem.'},
 {id:'calmaria',title:'Calmaria',hint:'Depois de ventar, volte o vento a zero e acompanhe o repouso.'},
 {id:'respirar',title:'Respirar junto',hint:'Ative o vento que respira (4 s inspira · 6 s expira).'},
 {id:'sobrepor',title:'Camadas de cor',hint:'Sobreponha dois painéis para misturar a luz colorida no piso.'},
 {id:'abertura',title:'Abertura',hint:'Crie uma faixa aberta em um painel.'},
 {id:'veus',title:'Entre os véus',hint:'Use o percurso “Entre os véus” ou aproxime a câmera dos tecidos.'}
];

/** Mapas procedurais de tecido: cor (com barra/bainha), normal de trama e, para o véu, opacidade listrada. */
function clothMaps(kind:Kind){const out:T.Texture[]=[];let seed=kind.length*977;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296};
 const S=512,c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d')!;x.fillStyle='#ffffff';x.fillRect(0,0,S,S);
 if(kind==='seda'){for(let i=0;i<S;i+=2){x.fillStyle=`rgba(120,90,90,${.015+rand()*.03})`;x.fillRect(0,i,S,1)}const g=x.createLinearGradient(0,0,S,0);g.addColorStop(0,'#0000');g.addColorStop(.5,'#ffffff30');g.addColorStop(1,'#0000');x.fillStyle=g;x.fillRect(0,0,S,S)}
 if(kind==='linho'){for(let i=0;i<2600;i++){const y=rand()*S,w=6+rand()*40;x.fillStyle=rand()<.5?`rgba(60,50,40,${.04+rand()*.07})`:`rgba(255,255,255,${.1+rand()*.15})`;x.fillRect(rand()*S,y,w,1+rand()*1.3)}for(let i=0;i<S;i+=3){x.fillStyle='rgba(0,0,0,.03)';x.fillRect(i,0,1,S)}}
 if(kind==='veu'){for(let i=0;i<S;i+=46){x.fillStyle='rgba(70,50,90,.16)';x.fillRect(i,0,9,S);x.fillStyle='rgba(255,255,255,.25)';x.fillRect(i+11,0,2,S)}}
 // Bainha inferior (canvas embaixo = base do painel) e passante superior para o trilho.
 x.fillStyle='rgba(60,40,30,.16)';x.fillRect(0,S-22,S,22);x.fillStyle='rgba(255,255,255,.3)';x.fillRect(0,S-26,S,2);x.fillStyle='rgba(60,40,30,.12)';x.fillRect(0,0,S,16);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(0,16,S,1.5);
 const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;out.push(map);
 // Normal de trama tela (sobe/desce alternado) gerada a partir de um campo de altura.
 const R=128,P=kind==='linho'?8:6,data=new Uint8Array(R*R*4),h=(i:number,j:number)=>{i=(i+R)%R;j=(j+R)%R;const cx=Math.cos(Math.PI*(i%P)/P),cy=Math.cos(Math.PI*(j%P)/P),hx=1-cx*cx,hy=1-cy*cy,par=(Math.floor(i/P)+Math.floor(j/P))%2;return par?hx*.85+hy*.15:hy*.85+hx*.15};
 for(let j=0;j<R;j++)for(let i=0;i<R;i++){const dx=(h(i+1,j)-h(i-1,j))*1.4,dy=(h(i,j+1)-h(i,j-1))*1.4,l=Math.hypot(dx,dy,1),k=(j*R+i)*4;data[k]=(-dx/l*.5+.5)*255;data[k+1]=(-dy/l*.5+.5)*255;data[k+2]=(1/l*.5+.5)*255;data[k+3]=255}
 const normal=new T.DataTexture(data,R,R);normal.wrapS=normal.wrapT=T.RepeatWrapping;normal.repeat.set(kind==='linho'?14:20,kind==='linho'?20:30);normal.generateMipmaps=true;normal.minFilter=T.LinearMipmapLinearFilter;normal.magFilter=T.LinearFilter;normal.needsUpdate=true;out.push(normal);
 let alpha:T.CanvasTexture|undefined;if(kind==='veu'){const a=document.createElement('canvas');a.width=a.height=256;const y=a.getContext('2d')!;y.fillStyle='#b4b4b4';y.fillRect(0,0,256,256);for(let i=0;i<256;i+=23){y.fillStyle='#ffffff';y.fillRect(i,0,5,256)}y.fillStyle='#ffffff';y.fillRect(0,0,256,9);y.fillRect(0,245,256,11);alpha=new T.CanvasTexture(a);out.push(alpha)}
 return {map,normal,alpha,all:out}}

function clothMaterial(kind:Kind,color:string){const maps=clothMaps(kind),base=new T.Color(color);
 const m=new T.MeshPhysicalMaterial({color:base,map:maps.map,normalMap:maps.normal,normalScale:new T.Vector2(kind==='linho'?.55:.3,kind==='linho'?.55:.3),side:T.DoubleSide,transparent:true,depthWrite:false,
  opacity:kind==='seda'?.8:kind==='linho'?.93:.72,alphaMap:maps.alpha??null,roughness:kind==='seda'?.42:kind==='linho'?.88:.6,sheen:kind==='linho'?.45:1,sheenRoughness:kind==='seda'?.32:.55,sheenColor:base.clone().lerp(new T.Color('#fff3e8'),.65),specularIntensity:kind==='seda'?.7:.35,envMapIntensity:.8});
 return {m,textures:maps.all}}

export async function createExperience(e:Env):Promise<Experience>{const {ui,store,send}=e,audio=e.audio,root=new T.Group();
 const env=buildPavilion(root,e.config.palette);const owned:T.Texture[]=[];
 const metal=new T.MeshStandardMaterial({color:'#b59a68',metalness:.92,roughness:.28});
 for(const z of[-1.2,-.65,-.1]){rod(root,V(-4,3.5,z),V(4,3.5,z),.026,metal);for(const x of[-4,4])rod(root,V(x,3.5,z),V(x,4.58,z),.012,metal)}

 const panels:{mesh:T.Mesh;mat:T.MeshPhysicalMaterial;pos:Float32Array;old:Float32Array;rest:Float32Array;links:[number,number,number][];pool:T.Mesh;rings:T.InstancedMesh}[]=[];
 let dragged=-1,dragPanel=0,dragStart=new T.Vector3(),dragMoved=0;
 const dummy=new T.Object3D(),spot=softSprite();owned.push(spot);
 const restX=(k:number)=>-1.8+k*1.8,restZ=(k:number)=>-1.2+k*.55;
 for(let k=0;k<3;k++){const g=new T.PlaneGeometry(W,H,N-1,M-1);const p=g.attributes.position;for(let i=0;i<p.count;i++)p.setXYZ(i,p.getX(i)+restX(k),p.getY(i)+TOP-H/2,restZ(k));
  const {m,textures}=clothMaterial(KINDS[k],e.config.palette[[1,2,4][k]]);owned.push(...textures);const mesh=new T.Mesh(g,m);mesh.castShadow=KINDS[k]==='linho';mesh.receiveShadow=true;mesh.renderOrder=k+1;mesh.frustumCulled=false;pick(mesh,'cloth'+k);root.add(mesh);
  const pos=p.array as Float32Array,old=pos.slice(),rest=pos.slice(),links:[number,number,number][]=[];
  for(let y=0;y<M;y++)for(let x=0;x<N;x++){const a=y*N+x;for(const [dx,dy]of[[1,0],[0,1],[1,1],[-1,1],[2,0],[0,2]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<N&&yy<M){const b=yy*N+xx;links.push([a,b,Math.hypot(pos[a*3]-pos[b*3],pos[a*3+1]-pos[b*3+1],pos[a*3+2]-pos[b*3+2])])}}}
  // Poça de luz colorida projetada no piso (a luz atravessa o tecido).
  const pool=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:spot,color:new T.Color(e.config.palette[[1,2,4][k]]).multiplyScalar(1.15),transparent:true,opacity:.55,depthWrite:false,blending:T.AdditiveBlending}));pool.rotation.x=-Math.PI/2;pool.renderOrder=5;root.add(pool);
  // Argolas de latão que prendem o tecido ao trilho.
  const rings=new T.InstancedMesh(new T.TorusGeometry(.035,.007,8,20),metal,Math.ceil(N/2));rings.castShadow=false;rings.frustumCulled=false;root.add(rings);
  panels.push({mesh,mat:m,pos,old,rest,links,pool,rings})}

 // Descobertas: conjunto do aparelho, espelhado em strings.found para salvar/abrir sessão.
 const found=new Set<string>();let maxWind=0,gustUntil=-1,gustStart=0,lastFound='';
 const discover=(id:string)=>{if(found.has(id))return;found.add(id);const s=store.state.sceneState;s.strings.found=[...found].join(',');const d=DISCOVERIES.find(x=>x.id===id)!;lastFound=d.title;audio?.chime(found.size,1);ui.toast(`Descoberta ${found.size}/${DISCOVERIES.length}: ${d.title}`);ui.progress(found.size,DISCOVERIES.length);if(found.size===DISCOVERIES.length){setTimeout(()=>{audio?.chime(5,1);audio?.chime(3,.7)},450);e.complete();ui.toast('Todas as descobertas feitas. A instalação continua aberta para você.')}};

 const cutsFor=(k:number)=>(store.state.sceneState.strings.cut??'').split(',').filter(Boolean).map(x=>x.split(':').map(Number)).filter(x=>x[0]===k).map(x=>x[1]);
 function sync(){const s=store.state.sceneState;s.strings.cut??='';for(const id of(s.strings.found??'').split(',').filter(Boolean))found.add(id);
  const has=s.heights.length===3*N*M*3;panels.forEach((p,k)=>{const en=s.entities[k],off=k*N*M*3;for(let i=0;i<N*M;i++){const idx=i*3;p.pos[idx]=has?s.heights[off+idx]:p.rest[idx]+en.x-restX(k);p.pos[idx+1]=has?s.heights[off+idx+1]:p.rest[idx+1];p.pos[idx+2]=has?s.heights[off+idx+2]:p.rest[idx+2]+en.z-restZ(k)}if(has&&s.wet.length===s.heights.length)p.old.set(s.wet.slice(off,off+N*M*3));else p.old.set(p.pos);p.mesh.geometry.attributes.position.needsUpdate=true;
   const cuts=cutsFor(k),indices:number[]=[];for(let y=0;y<M-1;y++)for(let x=0;x<N-1;x++){if(x>=SLIT0&&x<SLIT1&&cuts.some(c=>Math.round(c*(M-1)/18)===y))continue;const a=y*N+x,b=a+1,c=a+N,d=c+1;indices.push(a,c,b,b,c,d)}p.mesh.geometry.setIndex(indices);
   for(let j=0;j<p.rings.count;j++){dummy.position.set(p.pos[j*6],TOP+.12,p.pos[j*6+2]);dummy.updateMatrix();p.rings.setMatrixAt(j,dummy.matrix)}p.rings.instanceMatrix.needsUpdate=true;
   normals(p.mesh.geometry)});
  if(s.strings.cut)discover('abertura');ui.progress(found.size,DISCOVERIES.length)}
 function normals(g:T.BufferGeometry){g.computeVertexNormals();const n=g.attributes.normal.array as Float32Array;for(let i=0;i<n.length;i+=3){if(!(n[i]*n[i]+n[i+1]*n[i+1]+n[i+2]*n[i+2]>1e-8)){n[i]=0;n[i+1]=0;n[i+2]=1}}}

 const breath=(t:number)=>{const c=t%10;return c<4?.5-.5*Math.cos(c/4*Math.PI):.5+.5*Math.cos((c-4)/6*Math.PI)};
 const windNow=(t:number)=>{const v=store.state.sceneState.values;let w=v.wind;if(v.breath)w*=.25+.95*breath(t);if(t<gustUntil)w+=.6*Math.sin(Math.min(1,(t-gustStart)/1.6)*Math.PI);return w};
 const tmp=new T.Vector3();let audioTick=0;
 function step(dt:number,t:number){const s=store.state.sceneState,w=windNow(t);
  maxWind=Math.max(maxWind,s.values.wind);if(s.values.wind>=.7)discover('vento');if(maxWind>.05&&s.values.wind===0)discover('calmaria');if(s.values.breath)discover('respirar');
  const cam=e.stage.camera.position;if(cam.z<.4&&cam.z>-1.6&&Math.abs(cam.x)<3.4&&cam.y<2.6)discover('veus');
  if(++audioTick%6===0)audio?.wind(Math.min(1.2,w));
  if(store.state.settings.reducedMotion)return;env.step(t,dt,w);
  const gust=.65+.35*Math.sin(t*.9)*Math.sin(t*.37+1),wx=.3*Math.sin(t*.23),wz=1;
  panels.forEach((p,k)=>{const cuts=cutsFor(k),fixed=(i:number)=>i<N||(k===dragPanel&&i===dragged),nrm=p.mesh.geometry.attributes.normal.array as Float32Array;let bad=false;
   for(let i=N;i<N*M;i++){if(fixed(i))continue;const a=i*3,nd=nrm[a]*wx+nrm[a+2]*wz,f=nd*w*gust*1.5,flutter=Math.sin(t*2.3+i*.37+k)*w*.28;
    for(let j=0;j<3;j++){const x=p.pos[a+j],vel=(x-p.old[a+j])*.982;p.old[a+j]=x;const acc=(j===1?-3:0)+nrm[a+j]*f+(j===2?w*.45*gust+flutter:j===0?wx*w*.35:0);p.pos[a+j]+=vel+acc*dt*dt;if(!Number.isFinite(p.pos[a+j]))bad=true}}
   if(bad){p.pos.set(p.rest);p.old.set(p.rest)}
   for(let pass=0;pass<6;pass++)for(const [a,b,l]of p.links){const ra=Math.floor(a/N),rb=Math.floor(b/N);if(ra!==rb&&a%N>SLIT0&&a%N<SLIT1&&b%N>SLIT0&&b%N<SLIT1&&cuts.some(c=>{const row=Math.round(c*(M-1)/18);return ra<=row&&rb>row}))continue;const aa=a*3,bb=b*3,dx=p.pos[bb]-p.pos[aa],dy=p.pos[bb+1]-p.pos[aa+1],dz=p.pos[bb+2]-p.pos[aa+2],d=Math.hypot(dx,dy,dz)||1,cor=(d-l)/d*.5,fa=fixed(a),fb=fixed(b);if(fa&&fb)continue;const ka=fb?2:fa?0:1,kb=fa?2:fb?0:1;p.pos[aa]+=dx*cor*ka;p.pos[aa+1]+=dy*cor*ka;p.pos[aa+2]+=dz*cor*ka;p.pos[bb]-=dx*cor*kb;p.pos[bb+1]-=dy*cor*kb;p.pos[bb+2]-=dz*cor*kb}
   let cx=0,cy=0,cz=0,minX=9,maxX=-9;for(let i=N;i<N*M;i++){const a=i*3;if(p.pos[a+1]<.04)p.pos[a+1]=.04;cx+=p.pos[a];cy+=p.pos[a+1];cz+=p.pos[a+2];if(p.pos[a]<minX)minX=p.pos[a];if(p.pos[a]>maxX)maxX=p.pos[a]}const cnt=N*M-N;cx/=cnt;cy/=cnt;cz/=cnt;
   p.mesh.geometry.attributes.position.needsUpdate=true;normals(p.mesh.geometry);
   tmp.set(cx,cy,cz).addScaledVector(SUN_DIR,cy/-SUN_DIR.y);p.pool.position.set(tmp.x,.012+k*.002,tmp.z);p.pool.scale.set(Math.max(.8,maxX-minX)*1.35,2.3,1);
   const sel=Math.round(s.values.selected)===k;p.mat.emissive.copy(p.mat.color).multiplyScalar(sel?.07:0)});
  for(let a=0;a<3;a++)for(let b=a+1;b<3;b++)if(Math.abs(s.entities[a].x-s.entities[b].x)<.7)discover('sobrepor');
  s.heights=panels.flatMap(p=>Array.from(p.pos));s.wet=panels.flatMap(p=>Array.from(p.old))}

 // Sombras só para peças com presença: argolas, hastes finas e detalhes não projetam (menos draw calls no mapa de sombra).
 root.traverse(o=>{const m=o as T.Mesh;if(!m.isMesh||!m.castShadow||KINDS.some((_,k)=>panels[k]?.mesh===m))return;m.geometry.computeBoundingSphere();const r=(m.geometry.boundingSphere?.radius??1)*Math.max(m.scale.x,m.scale.y,m.scale.z);if(r<.3)m.castShadow=false});
 const selected=()=>Math.round(store.state.sceneState.values.selected);
 const move=(dx:number,dz:number)=>{const s=store.state.sceneState,c=s.entities[selected()];s.heights=[];if(send({type:'move',id:c.id,x:Math.max(-3.4,Math.min(3.4,c.x+dx)),z:Math.max(-2.2,Math.min(1.4,c.z+dz))}))audio?.swish(.7)};
 const status=()=>{const v=store.state.sceneState.values;return v.breath?(breath(e.stage.elapsed)>.5?'inspire…':'expire…'):''};
 ui.progress(0,DISCOVERIES.length);

 return {root,camera:[4.6,2.6,6.4],target:[0,1.9,-.7],sync,step,
  dispose:()=>{owned.forEach(t=>t.dispose());disposePavilion()},
  summary:()=>{const w=Math.round(store.state.sceneState.values.wind*100),b=status();return `${NAMES[selected()]} · vento ${w}%${b?' · '+b:''}`},
  tools:[
   {id:'cloth',label:'Tecido',help:'A borda superior fica presa ao trilho; o restante responde ao vento e ao seu gesto. Arraste direto no tecido.',draw:()=>{ui.select('Painel ativo',NAMES,selected(),value=>{send({type:'select',value});audio?.chime(value,.5)});ui.button('Prender de novo ao trilho',()=>{store.state.sceneState.heights=[];store.changed();audio?.swish(.5)})}},
   {id:'move',label:'Mover',help:'Aproxime, afaste ou sobreponha os apoios. Camadas sobrepostas misturam a luz no piso.',draw:()=>{ui.button('Aproximar',()=>move(0,.4));ui.button('Afastar',()=>move(0,-.4));ui.button('Deslizar à esquerda',()=>move(-.45,0));ui.button('Deslizar à direita',()=>move(.45,0));ui.button('Sobrepor painéis',()=>move(-store.state.sceneState.entities[selected()].x,0))}},
   {id:'wind',label:'Vento',help:'Simulação Verlet com restrições de alongamento, cisalhamento e dobra. O vento empurra conforme a face do tecido.',draw:()=>{const v=store.state.sceneState.values;ui.range('Vento suave',0,1,v.wind,value=>send({type:'value',id:'wind',value}));ui.button(v.breath?'Parar o vento que respira':'Respirar com o vento (4 s · 6 s)',()=>{send({type:'value',id:'breath',value:v.breath?0:1});ui.toast(store.state.sceneState.values.breath?'Inspire enquanto o tecido se abre; expire enquanto ele desce.':'Vento constante.');(document.querySelector('[data-tool="wind"]') as HTMLElement|null)?.click()},!v.breath);ui.button('Soprar uma rajada',()=>{gustStart=e.stage.elapsed;gustUntil=gustStart+1.6;audio?.swish(1)});ui.button('Sem vento',()=>send({type:'value',id:'wind',value:0}))}},
   {id:'cut',label:'Aberturas',help:'O corte virtual libera apenas uma faixa do painel selecionado. Use Desfazer para costurar de volta.',draw:()=>{let h=9;ui.range('Altura do corte',2,16,h,value=>{h=value;send({type:'value',id:'cut',value})},1);ui.button('Criar abertura',()=>{if(send({type:'cut',value:store.state.sceneState.values.cut||h})){audio?.swish(.8);e.notify('Faixa liberada no painel selecionado.')}})}},
   {id:'path',label:'Percurso',help:'Mudar a vista é opcional. Você pode manter a câmera parada.',draw:()=>{ui.button('Entre os véus',()=>e.stage.view([.2,1.55,-.5],[0,1.7,-3.2]));ui.button('Sob o pergolado',()=>e.stage.view([-3.6,1.2,3.2],[.2,3.2,-1.6]));ui.button('Vista geral',()=>e.stage.view([4.6,2.6,6.4],[0,1.9,-.7]));ui.button('Revisar instalação',()=>e.complete())}},
   {id:'diary',label:'Achados',help:'Descobertas são convites, não tarefas. Explore no seu ritmo.',draw:()=>{for(const d of DISCOVERIES){const done=found.has(d.id);ui.note(`${done?'✓':'○'} ${d.title} — ${d.hint}`).className=done?'found':'todo'}if(lastFound)ui.note(`Última: ${lastFound}`).className='help'}}
  ],
  pointer:(id,pt,phase)=>{const k=Number(id.replace('cloth',''));if(!Number.isFinite(k))return;const panel=panels[k];
   if(phase==='start'){dragPanel=k;dragMoved=0;dragStart.copy(pt);store.state.sceneState.values.selected=k;let min=Infinity;for(let i=N;i<N*M;i++){const d=Math.hypot(panel.pos[i*3]-pt.x,panel.pos[i*3+1]-pt.y,panel.pos[i*3+2]-pt.z);if(d<min){min=d;dragged=i}}audio?.swish(.6);return new T.Plane(V(0,0,1),-pt.z)}
   if(phase==='move'&&dragged>=0){const y=Math.max(.1,Math.min(3.3,pt.y)),x=Math.max(-4.5,Math.min(4.5,pt.x));panel.pos.set([x,y,pt.z],dragged*3);panel.old.set(panel.pos.subarray(dragged*3,dragged*3+3),dragged*3);dragMoved=Math.max(dragMoved,dragStart.distanceTo(pt))}
   if(phase==='end'){if(dragged>=0&&dragMoved>.15)discover('puxar');dragged=-1}}}}
