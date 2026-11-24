import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { makeTable } from './table';
export function createScene(container,brand,request,lose){
  const canvas=document.createElement('canvas');
  const gl=canvas.getContext('webgl2',{alpha:false,antialias:true,powerPreference:'high-performance'});
  if(!gl)throw Error('WebGL2 indisponível.');
  const renderer=new T.WebGLRenderer({canvas,context:gl});
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMappingExposure=.97;
  renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.enabled=true;renderer.shadowMap.autoUpdate=false;
  const scene=new T.Scene();scene.background=new T.Color('#1b1210');scene.fog=new T.FogExp2('#1b1210',.047);
  const camera=new T.PerspectiveCamera(41,1,.1,42);
  container.append(canvas);canvas.setAttribute('aria-hidden','true');
  let assembly=makeTable(scene,brand), level='', composer=null, ratio=1, last=null;
  const ctrl=new OrbitControls(camera,canvas);
  ctrl.enableDamping=true;ctrl.dampingFactor=.14;ctrl.enableZoom=false;ctrl.enablePan=false;
  ctrl.mouseButtons.LEFT=null;ctrl.mouseButtons.RIGHT=T.MOUSE.ROTATE;ctrl.touches.ONE=null;
  ctrl.addEventListener('change',request);
  const key=new T.DirectionalLight('#ffe0b5',3.46);
  key.position.set(-2.6,5.7,2.84);key.target.position.set(.1,.42,0);
  key.castShadow=true;
  Object.assign(key.shadow.camera,{left:-4.9,right:4.9,top:4.7,bottom:-4.7,near:.2,far:16});
  key.shadow.camera.updateProjectionMatrix();key.shadow.normalBias=.035;key.shadow.bias=-.00022;
  const bounce=new T.DirectionalLight('#ff9865',.68);bounce.position.set(3,2.3,-1.2);
  const fill=new T.HemisphereLight('#e5cbb6','#6f3b22',.83);
  scene.add(key,key.target,bounce,fill);
  const env=new RoomEnvironment(renderer),pmrem=new T.PMREMGenerator(renderer),cube=pmrem.fromScene(env,.06,.1,28);
  scene.environment=cube.texture;env.dispose();pmrem.dispose();
  function reflect(){
    assembly.table.traverse(o=>{
      for(const m of (Array.isArray(o.material)?o.material:[o.material]).filter(Boolean)){
        if(m.isMeshStandardMaterial&&o.name!=='bola-de-aco')m.envMapIntensity=.53;
      }
    });
  }
  reflect();
  const ext=gl.getExtension('WEBGL_debug_renderer_info');
  const gpu=String(gl.getParameter(ext?ext.UNMASKED_RENDERER_WEBGL:gl.RENDERER));
  const stat={calls:0,triangles:0};
  const detect=()=>/swiftshader|llvmpipe|software/i.test(gpu)?'leve':/intel|adreno|mali/i.test(gpu)||innerWidth<820?'equilibrada':'alta';
  const report=()=>Object.assign(stat,{calls:renderer.info.render.calls,triangles:renderer.info.render.triangles});
  function resize(){
    const w=Math.max(1,container.clientWidth),h=Math.max(1,container.clientHeight),portrait=w<730&&h>w;
    const cap={leve:1,equilibrada:1.3,alta:1.65}[level||detect()];
    const px={leve:.59e6,equilibrada:1.30e6,alta:2.5e6}[level||detect()];
    ratio=Math.max(.56,Math.min(cap,devicePixelRatio,Math.sqrt(px/(w*h))));
    renderer.setPixelRatio(ratio);renderer.setSize(w,h,false);composer?.setPixelRatio(ratio);composer?.setSize(w,h);
    if(portrait){
      camera.fov=47;
      camera.position.set(1.52,5.8,7.18);ctrl.target.set(0,.65,-.17);
      ctrl.minAzimuthAngle=-.12;ctrl.maxAzimuthAngle=.52;ctrl.minPolarAngle=.59;ctrl.maxPolarAngle=1.0;
    }else{
      camera.fov=39;
      camera.position.set(4.42,5.38,6.03);ctrl.target.set(0,.70,-.01);
      ctrl.minAzimuthAngle=.42;ctrl.maxAzimuthAngle=.81;ctrl.minPolarAngle=.77;ctrl.maxPolarAngle=1.05;
    }
    ctrl.update();camera.aspect=w/h;
    camera.setViewOffset(w,h,(portrait?0:-.155)*w,(portrait?.001:.010)*h,w,h);
    camera.updateMatrixWorld(true);request();
  }
  function quality(value){
    const use=value==='auto'?detect():value;
    if(level===use)return;
    level=use;
    if(key.shadow.map){key.shadow.map.dispose();key.shadow.map=null;}
    const size={leve:512,equilibrada:1024,alta:1536}[level];
    key.shadow.mapSize.set(size,size);renderer.shadowMap.needsUpdate=true;
    if(composer){composer.passes.forEach(p=>p.dispose?.());composer.dispose();composer=null;}
    if(level==='alta'){
      composer=new EffectComposer(renderer);
      const pass=new RenderPass(scene,camera), original=pass.render.bind(pass);
      pass.render=(...args)=>{original(...args);report();};
      composer.addPass(pass);
      composer.addPass(new UnrealBloomPass(new T.Vector2(1,1),.24,.42,.94));composer.addPass(new OutputPass());
    }
    resize();
  }
  function draw(state,reduced){
    if(state)last=state;if(!last)return;
    assembly.update(last,reduced);ctrl.update();
    if(composer)composer.render();else{renderer.render(scene,camera);report();}
  }
  const ro=new ResizeObserver(resize);ro.observe(container);
  const loss=event=>{event.preventDefault();lose();};
  canvas.addEventListener('webglcontextlost',loss);
  const ray=new T.Raycaster();
  const dummy=new T.Mesh(new T.BoxGeometry(.32,.37,.82),new T.MeshBasicMaterial());
  dummy.position.set(1.17,.20,2.06);
  assembly.table.add(dummy);dummy.visible=false;
  function point(){
    const n=assembly.table.localToWorld(dummy.position.clone()).project(camera),r=canvas.getBoundingClientRect();
    return [r.left+(n.x+1)*r.width*.5,r.top+(1-n.y)*r.height*.5];
  }
  function plungerAt(x,y){
    const b=canvas.getBoundingClientRect();
    ray.setFromCamera(new T.Vector2(2*(x-b.left)/b.width-1,1-2*(y-b.top)/b.height),camera);
    if(ray.intersectObject(dummy,false).length)return true;
    const p=point();return Math.hypot(x-p[0],y-p[1])<27;
  }
  quality('auto');resize();
  return {canvas,draw,plungerAt,point,quality,detect,manifest:assembly.manifest,glowing:assembly.glowing,
    colors:()=>({verniz:assembly.m.wood.color.getHexString(),metal:assembly.m.brass.color.getHexString(),botao:assembly.m.red.color.getHexString()}),
    stats:()=>({...stat,gpu,level,ratio,width:canvas.width,height:canvas.height}),
    photo:()=>{draw();return canvas.toDataURL('image/webp',.91);},
    measure(n=10){const a=new Uint8Array(4),start=performance.now();for(let i=0;i<n;i++){draw();gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,a);}return (performance.now()-start)/n;},
    dispose(){
      ro.disconnect();ctrl.dispose();canvas.removeEventListener('webglcontextlost',loss);
      const resources=new Set();
      scene.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const m of (Array.isArray(o.material)?o.material:[o.material]).filter(Boolean)){
        resources.add(m);Object.values(m).filter(x=>x?.isTexture).forEach(t=>resources.add(t));
      }});
      resources.forEach(it=>it.dispose());composer?.passes.forEach(p=>p.dispose?.());composer?.dispose();
      cube.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();
    },
  };
}

