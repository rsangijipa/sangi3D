import * as T from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { buildRoom } from './room';

export function createScene(container,brand,get,handlers) {
  const canvas=document.createElement('canvas');
  const context=canvas.getContext('webgl2',{alpha:false,antialias:true,powerPreference:'high-performance'});
  if(!context)throw Error('WebGL2 indisponível');
  const renderer=new T.WebGLRenderer({canvas,context,antialias:true});
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=.98;
  renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.autoUpdate=false;
  container.append(canvas);

  const scene=new T.Scene();
  scene.background=new T.Color('#322922');
  scene.fog=new T.FogExp2('#3e342f',.016);
  const camera=new T.PerspectiveCamera(38,1,.12,45);
  const controls=new OrbitControls(camera,canvas);
  controls.enableDamping=true;controls.dampingFactor=.14;
  controls.enableZoom=false;controls.enablePan=false;controls.rotateSpeed=.32;
  controls.minAzimuthAngle=-.13;controls.maxAzimuthAngle=.13;
  controls.minPolarAngle=1.47;controls.maxPolarAngle=1.635;

  const key=new T.DirectionalLight('#f4d3ae',1.96);
  key.position.set(-2.7,4.25,3.65);key.target.position.set(.7,.48,-1.3);
  key.castShadow=true;
  Object.assign(key.shadow.camera,{left:-5.6,right:5.6,bottom:-3.9,top:4.2,near:.4,far:14});
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.normalBias=.026;key.shadow.bias=-.00023;
  const blue=new T.DirectionalLight('#9ab7df',.89);
  blue.position.set(3.4,3.8,-1.87);blue.target.position.set(.53,.45,.77);
  const rim=new T.DirectionalLight('#d4b89b',.32);rim.position.set(4.9,2.2,3.7);
  const fill=new T.HemisphereLight('#cfdbed','#754223',.71);
  scene.add(key,key.target,blue,blue.target,fill,rim);
  const env=new RoomEnvironment(renderer);
  const pmrem=new T.PMREMGenerator(renderer);
  const envTarget=pmrem.fromScene(env,.06,.1,45);
  scene.environment=envTarget.texture;
  env.dispose();pmrem.dispose();

  const room=buildRoom(scene,brand);
  scene.traverse(node=>{
    const materials=Array.isArray(node.material)?node.material:[node.material];
    for(const material of materials) if(material?.isMeshStandardMaterial)material.envMapIntensity=.43;
  });
  const proxies=[];
  const raycaster=new T.Raycaster(), mouse=new T.Vector2();
  const pickMaterial=new T.MeshBasicMaterial();
  const rings={};
  for(const [id,spec] of Object.entries(room.specs)){
    if(!spec.p)continue;
    const obj=new T.Mesh(new T.BoxGeometry(...spec.s),pickMaterial);
    obj.position.set(...spec.p);obj.userData.id=id;obj.updateMatrixWorld(true);
    proxies.push(obj);
    if(!Object.hasOwn(get().mix,id))continue;
    const ring=new T.Mesh(new T.RingGeometry(.93,1,60),new T.MeshBasicMaterial({color:brand.cores.destaque,
      transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide}));
    const floor={chuva:[2.2,.136,-2.18,1.39,.12],lareira:[-3.47,.151,-1.21,.95,.39],vitrola:[-.80,1.343,-1.64,.65,.31],
      relogio:[-.39,3.55,-2.342,.326,.326],plantas:[3.32,.079,.32,.54,.43]}[id];
    ring.position.set(floor[0],floor[1],floor[2]);
    if(id!=='relogio'){ring.rotation.x=-Math.PI/2;ring.scale.set(floor[3],floor[4],1);}
    else ring.scale.set(floor[3],floor[4],1);
    ring.visible=false;
    rings[id]=ring;scene.add(ring);
  }

  const debugGl=renderer.getContext().getExtension('WEBGL_debug_renderer_info');
  const gpu=String(context.getParameter(debugGl?debugGl.UNMASKED_RENDERER_WEBGL:context.RENDERER));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const controller=new AbortController(), signal=controller.signal;
  let frameId=0,start=performance.now(),last=start, dirty=true, active=true, onScreen=true;
  let level='', composer=null, bloom=null, ratio=1, slowdown=0, frameMs=0;
  const renderStats={calls:0,triangles:0};
  const markRender=()=>{
    renderStats.calls=renderer.info.render.calls;
    renderStats.triangles=renderer.info.render.triangles;
  };
  const width=()=>Math.max(1,container.clientWidth);
  const height=()=>Math.max(1,container.clientHeight);
  const detect=()=>{
    if(/swiftshader|llvmpipe|software|basic render/i.test(gpu))return 'leve';
    if(/intel|mali|adreno|powervr/i.test(gpu)||innerWidth<=840)return 'equilibrada';
    return 'alta';
  };
  function resizeTargets(pixelRatio){
    ratio=pixelRatio;
    renderer.setPixelRatio(pixelRatio);renderer.setSize(width(),height(),false);
    if(composer){composer.setPixelRatio(pixelRatio);composer.setSize(width(),height());}
  }
  function resize() {
    const w=width(),h=height(),mobile=w<740&&h>w;
    const mode=level||detect();
    const budget={leve:.56e6,equilibrada:1.28e6,alta:2.47e6}[mode];
    const cap={leve:1,equilibrada:1.35,alta:1.65}[mode];
    resizeTargets(T.MathUtils.clamp(Math.min(cap,devicePixelRatio,Math.sqrt(budget/(w*h)))*(1-slowdown),.55,cap));
    camera.aspect=w/h;
    camera.fov=mobile?53:38;
    camera.position.set(mobile?2.03:.18,mobile?2.08:2.15,mobile?5.85:6.27);
    controls.target.set(mobile?2.14:.15,mobile?1.94:1.92,mobile?-.62:-.72);
    controls.update();
    camera.setViewOffset(w,h,mobile?w*.011:0,mobile?h*.076:0,w,h);
    camera.updateMatrixWorld(true);
    request();
  }
  function setQuality() {
    const name=get().quality==='auto'?detect():get().quality;
    if(level===name)return;
    level=name;slowdown=0;
    const size={leve:512,equilibrada:1024,alta:1536}[level];
    if(key.shadow.map){key.shadow.map.dispose();key.shadow.map=null;}
    key.shadow.mapSize.set(size,size);
    renderer.shadowMap.needsUpdate=true;
    if(composer){
      composer.passes.forEach(pass=>pass.dispose?.());
      composer.dispose();composer=null;bloom=null;
    }
    if(level==='alta'){
      composer=new EffectComposer(renderer);
      const render=new RenderPass(scene,camera);const pass=render.render.bind(render);
      render.render=(...args)=>{pass(...args);markRender();};
      bloom=new UnrealBloomPass(new T.Vector2(width(),height()),.22,.43,.86);
      composer.addPass(render);composer.addPass(bloom);composer.addPass(new OutputPass());
    }
    resize();
  }
  function draw() {
    if(composer)composer.render();
    else {renderer.render(scene,camera);markRender();}
  }
  const current={fire:.78,record:0,rain:.40,curtain:.36,breath:0,pauseBlend:0};
  let targetBreath=0, settled=false;
  function update(time,dt,fixed){
    const state=get();
    const has=id=>state.mix[id].active?state.mix[id].volume:0;
    const after=(a,b)=>reduced.matches||fixed?b:T.MathUtils.lerp(a,b,1-Math.exp(-7.2*dt));
    targetBreath=state.breath ? reduced.matches?.29:.5-.5*Math.cos(2*Math.PI*state.breath.elapsed/10) : 0;
    current.breath=after(current.breath,targetBreath);
    current.pauseBlend=after(current.pauseBlend,state.breath?1:0);
    const fireTarget=.75+has('lareira')*.42, rainTarget=.36+has('chuva')*.65+state.curtain*.21;
    current.fire=after(current.fire,fireTarget);
    current.rain=after(current.rain,rainTarget);
    current.curtain=after(current.curtain,state.curtain);
    current.record=after(current.record,state.mix.vitrola.active?1:0);
    room.curtain.fabric.scale.x=1.18-current.curtain*.52;
    room.curtain.fabric.position.x=current.curtain*.48-.034;
    room.curtain.fabric.rotation.z=reduced.matches?0:Math.sin(time*1.1)*has('plantas')*.013;
    room.window.material.uniforms.uRain.value=current.rain;
    room.window.material.uniforms.uOpen.value=current.curtain;
    room.window.material.uniforms.uTime.value=state.mix.chuva.active&&!reduced.matches?time:0;
    const fireT=state.mix.lareira.active&&!reduced.matches?time:4.3;
    for(const {material} of room.hearth.flames){
      material.uniforms.uTime.value=fireT;
      material.uniforms.uPower.value=current.fire;
    }
    room.hearth.light.intensity=7.3+current.fire*5.5+Math.sin(fireT*4.3)*.50+Math.sin(fireT*9.7)*.21;
    const { emberPos,emberSeed,embers }=room.hearth;
    for(let i=0;i<emberSeed.length;i++){
      const [x,y,z]=emberSeed[i], age=(y+fireT*(.075+z*.063))%1;
      emberPos[i*3]=(x-.5)*1.49+(age-.4)*.22*x;
      emberPos[i*3+1]=.23+age*1.08;
      emberPos[i*3+2]=.32+z*.18;
    }
    embers.geometry.getAttribute('position').needsUpdate=true;
    embers.material.opacity=.27+current.fire*.43;
    room.record.pivot.rotation.y=T.MathUtils.lerp(-.54,.68,current.record);
    room.record.pivot.rotation.x=T.MathUtils.lerp(-.16,.048,current.record);
    if(!reduced.matches)room.record.platter.rotation.y+=current.record*dt*2.8;
    room.watch.second.rotation.z=.39-(state.mix.relogio.active&&!reduced.matches?Math.floor(time)*Math.PI/30:0);
    room.greens.foliage.rotation.z=reduced.matches?0:Math.sin(time*1.36)*has('plantas')*.031;
    room.standing.light.intensity=T.MathUtils.lerp(8.6,5.2+current.breath*7.1,current.pauseBlend);
    room.m.linen.emissiveIntensity=T.MathUtils.lerp(.47,.27+current.breath*.57,current.pauseBlend);
    room.standing.inside.material.color.set(brand.cores.luz).multiplyScalar(T.MathUtils.lerp(1.05,.61+current.breath*.44,current.pauseBlend));
    renderer.toneMappingExposure=T.MathUtils.lerp(.985,.83+current.breath*.12,current.pauseBlend);
    for(const [id,ring] of Object.entries(rings)){
      ring.visible=state.mix[id].active;ring.material.opacity=.19+has(id)*.22;
    }
    settled=Math.abs(current.curtain-state.curtain)+Math.abs(current.record-(state.mix.vitrola.active?1:0))
      +Math.abs(current.pauseBlend-(state.breath?1:0))+Math.abs(current.fire-fireTarget)+Math.abs(current.rain-rainTarget)<.006;
  }
  function renderFrame(now) {
    frameId=0;
    if(!active||document.hidden||!onScreen)return;
    const dt=Math.min(.2,(now-last)/1000);
    const state=get(), animated=!reduced.matches&&(state.breath||Object.values(state.mix).some(item=>item.active));
    const limit=level==='leve'?29:level==='equilibrada'?17:14;
    if(!dirty&&now-last<limit){if(animated||!settled)frameId=requestAnimationFrame(renderFrame);return;}
    dirty=false;last=now;
    const cameraMoving=controls.update();
    const tick=performance.now();
    update((now-start)/1000,dt,false);draw();
    frameMs=frameMs*.94+(performance.now()-tick)*.06;
    if(frameMs>29&&slowdown<.32&&!reduced.matches){
      slowdown+=.065;
      resizeTargets(Math.max(.55,ratio*.935));
      frameMs=12;
    }
    if(animated||!settled||cameraMoving)frameId=requestAnimationFrame(renderFrame);
  }
  function request(){dirty=true;if(!frameId&&active&&!document.hidden&&onScreen)frameId=requestAnimationFrame(renderFrame);}
  controls.addEventListener('change',request);
  const ro=new ResizeObserver(resize);ro.observe(container);
  const io=new IntersectionObserver(e=>{onScreen=e[0].isIntersecting;if(onScreen)request();});io.observe(container);
  document.addEventListener('visibilitychange',()=>{last=performance.now();request();},{signal});
  reduced.addEventListener('change',request,{signal});

  function hit(x,y) {
    const r=canvas.getBoundingClientRect();
    mouse.set((x-r.left)*2/r.width-1,1-(y-r.top)*2/r.height);
    raycaster.setFromCamera(mouse,camera);
    const hits=raycaster.intersectObjects(proxies,false);
    return hits[0]?.object.userData.id??'';
  }
  let grab=null, hovered='';
  canvas.addEventListener('pointerdown',event=>{
    if(!event.isPrimary||event.button!==0)return;
    const id=hit(event.clientX,event.clientY);
    if(!id)return;
    controls.enabled=false;
    canvas.setPointerCapture(event.pointerId);
    const state=get();
    grab={id,pointer:event.pointerId,x:event.clientX,y:event.clientY,moved:false,
      initial:id==='cortina'?state.curtain:state.mix[id]?.volume??0};
  },{capture:true,signal});
  canvas.addEventListener('pointermove',event=>{
    if(grab?.pointer===event.pointerId){
      const dx=event.clientX-grab.x,dy=event.clientY-grab.y;
      if(Math.hypot(dx,dy)>7)grab.moved=true;
      if(grab.moved){
        if(grab.id==='cortina')handlers.curtain(grab.initial+(dx-dy*.56)/145);
        else if(grab.id!=='luminaria')handlers.volume(grab.id,grab.initial-dy/148,true);
      }
    }else if(event.pointerType!=='touch'){
      const id=hit(event.clientX,event.clientY);
      if(id!==hovered){hovered=id;handlers.hover(id);}
      canvas.style.cursor=id?'pointer':'grab';
    }
  },{signal});
  const release=(event,apply)=>{
    if(!grab||grab.pointer!==event.pointerId)return;
    const item=grab;grab=null;controls.enabled=true;
    if(!apply)return;
    if(!item.moved)handlers.toggle(item.id);
    else handlers.commit(item.id);
    request();
  };
  canvas.addEventListener('pointerup',e=>release(e,true),{signal});
  canvas.addEventListener('pointercancel',e=>release(e,false),{signal});
  canvas.addEventListener('pointerleave',()=>{if(!grab){hovered='';handlers.hover('');}},{signal});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();handlers.loss();},{signal});
  canvas.setAttribute('aria-hidden','true');

  setQuality();resize();update(4.3,0,true);draw();request();
  return {
    request,setQuality,renderer,canvas,detect,
    setBrand(next){brand=next;room.setBrand(next);for(const ring of Object.values(rings))ring.material.color.set(next.cores.destaque);request();},
    manifest:Object.fromEntries(Object.entries(room.specs).map(([id,item])=>[id,{id,pos:item.node.position.toArray(),rot:item.node.rotation.toArray().slice(0,3),
      scale:item.node.scale.toArray(),material:item.material,funcao:item.funcao}])),
    stats:()=>({...renderStats,gpu,level,ratio,width:canvas.width,height:canvas.height}),
    colors:()=>({tecido:room.m.upholstery.color.getHexString(),verniz:room.m.walnut.color.getHexString(),luz:room.standing.light.color.getHexString()}),
    pick:hit,
    point:(id)=>{
      const target=room.specs[id]?.p;
      if(!target)return null;
      const n=new T.Vector3(...target).project(camera),rect=canvas.getBoundingClientRect();
      return [rect.left+(n.x+1)*rect.width*.5,rect.top+(1-n.y)*rect.height*.5];
    },
    photo:()=>{draw();return canvas.toDataURL('image/webp',.91);},
    syncMeasure:(n=10)=>{
      const px=new Uint8Array(4),mark=performance.now();
      for(let i=0;i<n;i++){draw();context.readPixels(0,0,1,1,context.RGBA,context.UNSIGNED_BYTE,px);}
      return (performance.now()-mark)/n;
    },
    dispose(){
      active=false;cancelAnimationFrame(frameId);controller.abort();ro.disconnect();io.disconnect();controls.dispose();
      const resources=new Set();
      scene.traverse(node=>{
        if(node.geometry)resources.add(node.geometry);
        for(const mat of (Array.isArray(node.material)?node.material:[node.material]).filter(Boolean)){
          resources.add(mat);Object.values(mat).filter(x=>x?.isTexture).forEach(x=>resources.add(x));
          if(mat.uniforms)Object.values(mat.uniforms).map(u=>u.value).filter(x=>x?.isTexture).forEach(x=>resources.add(x));
        }
      });
      resources.forEach(x=>x.dispose());
      proxies.forEach(p=>p.geometry.dispose());pickMaterial.dispose();
      composer?.passes.forEach(p=>p.dispose?.());composer?.dispose();envTarget.dispose();renderer.dispose();canvas.remove();
    },
  };
}

