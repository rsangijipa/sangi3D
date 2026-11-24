import * as T from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { presets, Tau } from '../game/content'
import { jointAvailable } from '../game/rules'
import { startingAngle, type Atelier, type Tool } from '../game/state'
import { glaze, seam, shard, surface, whole } from './ceramic'
import { batchWorkshop, bench, meshMaterial, trayPosition, workshop } from './workshop'
import type { cinema } from './cinema'

export interface Display {
  state: Atelier
  tool: Tool
  selected: number
  joint: number
  compare: boolean
  view: 'desk' | 'top' | 'detail'
}
interface Actions {
  select(id:number):void
  fit(id:number,slot:number,distance:number):void
  brush(id:number,section:number):void
  status(message:string):void
  fallback(active:boolean):void
}
const origin = new T.Vector3(0,bench+.054,-.065)
const qualityBudget = {auto:1.15,light:.55,balanced:1.15,cinema:3.6}

function release(root:T.Object3D) {
  const geometries=new Set<T.BufferGeometry>(), materials=new Set<T.Material>(), textures=new Set<T.Texture>()
  root.traverse(node => {
    if (!(node instanceof T.Mesh)) return
    geometries.add(node.geometry)
    for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
      materials.add(material)
      for (const value of Object.values(material)) if (value instanceof T.Texture) textures.add(value)
    }
  })
  geometries.forEach(item=>item.dispose()); materials.forEach(item=>item.dispose()); textures.forEach(item=>item.dispose())
}

export function init(host:HTMLElement, actions:Actions) {
  const scene=new T.Scene()
  scene.background=new T.Color('#655743')
  scene.fog=new T.FogExp2('#978272',.052)
  const camera=new T.PerspectiveCamera(40,1,.025,18)
  const drawing=document.createElement('canvas')
  const context=drawing.getContext('webgl2',{antialias:true,powerPreference:'high-performance'})
  if(!context) throw new Error('WebGL2 indisponível')
  const renderer=new T.WebGLRenderer({canvas:drawing,context,antialias:true,powerPreference:'high-performance'})
  renderer.shadowMap.enabled=true
  renderer.shadowMap.type=T.PCFShadowMap
  renderer.shadowMap.autoUpdate=false
  renderer.toneMapping=T.ACESFilmicToneMapping
  renderer.toneMappingExposure=1.05
  renderer.domElement.setAttribute('aria-label','Bancada tridimensional do ateliê')
  host.append(renderer.domElement)
  const canvas=renderer.domElement
  function makeEnvironment() {
    const room=new RoomEnvironment(), pmrem=new T.PMREMGenerator(renderer)
    const target=pmrem.fromScene(room,.035)
    scene.environment=target.texture;scene.environmentIntensity=.52
    room.dispose();pmrem.dispose()
    return target
  }
  let environment=makeEnvironment()
  let post:ReturnType<typeof cinema>
  const scenery=new T.Group()
  workshop(scenery);batchWorkshop(scenery);scene.add(scenery)
  const sun=new T.DirectionalLight('#ffd9bc',2.55)
  sun.position.set(-1.6,3.25,-1.27); sun.target.position.copy(origin)
  sun.castShadow=true; sun.shadow.mapSize.set(1024,1024)
  Object.assign(sun.shadow.camera,{left:-1.65,right:1.65,top:1.26,bottom:-1.26,near:.2,far:6})
  sun.shadow.camera.updateProjectionMatrix(); sun.shadow.normalBias=.006
  scene.add(sun,sun.target,new T.HemisphereLight('#fff3da','#45353d',.97))
  const fill=new T.DirectionalLight('#c3d8ec',.86)
  fill.position.set(.48,2,2.6); scene.add(fill)
  const controls=new OrbitControls(camera,canvas)
  controls.enablePan=false; controls.enableDamping=false
  controls.minAzimuthAngle=-.8; controls.maxAzimuthAngle=.8
  controls.minPolarAngle=.19; controls.maxPolarAngle=1.20
  controls.minDistance=.64; controls.maxDistance=3.8
  const stage=new T.Group(); stage.position.copy(origin); scene.add(stage)
  const ray=new T.Raycaster(), pointer=new T.Vector2(), dragPlane=new T.Plane(), dragPoint=new T.Vector3()
  let display:Display, parts:T.Group[] = [], ghosts:T.Group[] = [], seams:T.Mesh[][] = [], innerSeams:T.Mesh[][] = []
  let jointHits:T.Mesh[][] = [], partHits:T.Mesh[] = []
  let variants:number[] = []
  let stageKey='', viewKey='', qualityKey=''
  let frame=0, dirty=true, contextLost=false, inView=true, paused=false, disposed=false
  let adaptive=1, samples:number[]=[]
  let activeDrag:{id:number; pointer:number; x:number; y:number; offset:T.Vector3; moved:boolean}|undefined
  let painting=false, activePointer:number|undefined
  const targets:T.Vector3[]=[]
  const restRotation = new T.Quaternion()
  const turn = new T.Quaternion()
  const mark = () => { dirty=true; request() }
  const moved = () => { renderer.shadowMap.needsUpdate=true; mark() }
  function request() {
    if (!frame && !disposed && !contextLost && inView && !document.hidden) frame=requestAnimationFrame(draw)
  }
  controls.addEventListener('change',mark)

  function rebuild() {
    release(stage); stage.clear()
    parts=[]; ghosts=[]; seams=[]; innerSeams=[]; jointHits=[]; partHits=[]; variants=[]
    const {vessel,count}=display.state.sceneState
    const coat=glaze(vessel), clay=meshMaterial('#ad8868',.9)
    clay.side=T.DoubleSide
    const base=whole(vessel,coat,.21,60)
    stage.add(base)
    const ghostMaterial=new T.MeshBasicMaterial({color:'#e8bd7b',transparent:true,opacity:.23,depthWrite:false,side:T.DoubleSide})
    const lacquer=meshMaterial('#461d25',.26)
    const gold=new T.MeshStandardMaterial({color:'#efbe58',roughness:.32,metalness:.74,emissive:'#9e5e16',emissiveIntensity:.23})
    const guide=new T.MeshBasicMaterial({color:'#f6bb71',transparent:true,opacity:.49})
    const invisible=new T.MeshBasicMaterial({visible:false})
    for (let id=0;id<count;id++) {
      const shape=shard(vessel,count,id,coat,clay)
      shape.userData.coat=coat; shape.userData.clay=clay; shape.userData.tint=coat.clone()
      shape.userData.tint.color.set(id%2 ? '#b6d3cc' : '#ebc39b')
      const centroid=surface(vessel,.69,(id+.5)*Tau/count+.14)
      const pivot=new T.Group()
      pivot.userData.centroid=centroid; pivot.userData.id=id; pivot.add(shape); stage.add(pivot); parts.push(pivot)
      const hit=new T.Mesh(new T.SphereGeometry(count>5 ? .052 : .066,9,6),invisible)
      hit.userData.id=id; hit.position.copy(centroid); pivot.add(hit); partHits.push(hit)
      const ghost=shard(vessel,count,id,ghostMaterial,ghostMaterial)
      ghost.traverse(node=> { if (node instanceof T.Mesh) {node.castShadow=false; node.receiveShadow=false} })
      stage.add(ghost); ghosts.push(ghost)
      const makeSegments = (offset:number,radius:number,visible=true) => Array.from({length:8},(_,section)=>{
        const points=Array.from({length:6},(_,step)=>seam(vessel,count,id,(section+step/5)/8,offset))
        const tube=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),6,radius,5,false),visible ? guide : invisible)
        tube.userData={id,section}; stage.add(tube); return tube
      })
      seams.push(makeSegments(.0016,.0025))
      innerSeams.push(makeSegments(-.010,.0027))
      jointHits.push(makeSegments(-.002,.020,false))
    }
    stage.userData={gold,lacquer,guide}
    renderer.shadowMap.needsUpdate=true
  }

  function sync() {
    const {state,tool,selected,joint,compare}=display
    const data=state.sceneState
    const geometryKey=data.vessel+data.count
    if (stageKey!==geometryKey) { stageKey=geometryKey; rebuild() }
    const wheel=state.mode==='alternate'
    const slots=new Set(data.fragments.map((part,id)=>compare ? id<2 ? id : null : part.slot))
    parts.forEach((part,id)=>{
      const fragment=data.fragments[id]
      const slot=compare ? id<2 ? id : null : fragment.slot
      const angle=compare ? startingAngle(id,wheel) : fragment.angle
      const shape=part.children[0] as T.Group
      const targetSlot=slot ?? id
      if (variants[id]!==targetSlot) {
        const previous=part.children[0] as T.Group
        if (variants[id]!==undefined || targetSlot!==id) {
          const {coat,clay,tint}=previous.userData
          const fresh=shard(data.vessel,data.count,targetSlot,targetSlot===id ? coat : tint,clay)
          fresh.userData={coat,clay,tint}
          previous.traverse(node=>{if(node instanceof T.Mesh) node.geometry.dispose()})
          part.remove(previous); part.children.unshift(fresh); fresh.parent=part
        }
        variants[id]=targetSlot
      }
      const center=surface(data.vessel,.69,(targetSlot+.5)*Tau/data.count+.14)
      const currentShape=part.children[0]
      partHits[id].position.copy(center)
      const matches=slot!==null
      targets[id]=matches ? new T.Vector3() : trayPosition(id).sub(origin)
      const tilt=-(id+.5)*Tau/data.count+.28
      if (!matches) {
        const azimuth=(id+.5)*Tau/data.count+.14
        const normal=new T.Vector3(Math.cos(azimuth),-.72,Math.sin(azimuth)).normalize()
        restRotation.setFromUnitVectors(normal,new T.Vector3(0,-1,0))
        restRotation.premultiply(turn.setFromAxisAngle(T.Object3D.DEFAULT_UP,tilt+T.MathUtils.degToRad(angle)))
        part.userData.targetRotation=restRotation.clone()
        targets[id].sub(center.clone().applyQuaternion(restRotation))
        targets[id].y+=.036
      } else part.userData.targetRotation=new T.Quaternion()
      if (currentShape !== shape || !part.userData.placed || state.settings.reduced || compare) {
        part.position.copy(targets[id]); part.quaternion.copy(part.userData.targetRotation); part.userData.placed=true
      }
      partHits[id].scale.setScalar(id===selected ? 1.15 : 1)
    })
    ghosts.forEach((ghost,slot)=> {
      ghost.visible=!compare && state.phase==='work' && (tool==='fit') && selected>=0 && !slots.has(slot) && (slot===selected || wheel) && (state.mode!=='facilitated' || state.settings.instruction!=='verbal')
    })
    seams.forEach((segments,id)=>{
      const existing=!compare && jointAvailable(data,id)
      const masks=data.joints[id]
      segments.forEach((segment,index)=>{
        const layer=masks.gold & (1<<index) ? 'gold' : masks.lacquer & (1<<index) ? 'lacquer' : 'guide'
        const show=existing && (layer!=='guide' || ((tool==='lacquer'||tool==='finish') && id===joint))
        for (const mesh of [segment,innerSeams[id][index]]) {
          mesh.visible=show
          mesh.material=stage.userData[layer]
        }
      })
    })
    const gold=stage.userData.gold as T.MeshStandardMaterial
    gold.color.set(state.settings.discrete?'#be9258':'#efbe58')
    gold.emissiveIntensity=state.settings.discrete?.08:.23
    controls.enabled=state.phase==='work' && tool==='orbit'
    paused=state.phase==='paused' || state.phase==='exit'
    const nextView=cameraKey()
    if(nextView!==viewKey) {viewKey=nextView; frameCamera()}
    if(qualityKey!==state.settings.quality) {
      qualityKey=state.settings.quality; adaptive=1; samples=[]
      if(qualityKey==='cinema'&&!post) void import('./cinema').then(({cinema})=>{
        if(disposed||contextLost||qualityKey!=='cinema'||post) return
        post=cinema(renderer,scene,camera);resize()
      }).catch(()=>actions.status('O modo Cinema usa a renderização direta neste navegador.'))
      resize()
    }
    moved()
  }

  function frameCamera() {
    const mobile=host.clientWidth<630
    const entry=display.state.phase==='entry'||display.state.phase==='exit'
    camera.fov=mobile&&!entry&&display.view==='desk'?50:40
    camera.updateProjectionMatrix()
    if(entry) {
      controls.target.set(mobile ? 0 : -.31,mobile ? 1.16 : 1.14,.00)
      camera.position.set(.30,mobile ? 1.66 : 1.61,mobile ? 2.27 : 2.11)
    } else if(display.view==='top') {
      controls.target.set(0,.88,.13); camera.position.set(.02, mobile ? 2.85 : 2.45,.66)
    } else if(display.view==='detail') {
      controls.target.set(0,1.02,-.08); camera.position.set(.39,1.36,mobile ? 1.14 : .87)
    } else {
      controls.target.set(0,mobile ? .69 : 1.01,mobile ? .21 : .055)
      camera.position.set(mobile ? .09 : .45,mobile ? 2.05 : 1.53,mobile ? 2.55 : 1.67)
    }
    controls.update()
  }

  function cameraKey() {
    const entry=display.state.phase==='entry'||display.state.phase==='exit'
    return (entry?'entry':display.view)+(host.clientWidth<630?'mobile':'desktop')
  }

  function resize() {
    const width=host.clientWidth,height=host.clientHeight
    if(!width||!height) return
    const budget=qualityBudget[display?.state.settings.quality ?? 'auto']*1e6
    const limit=display?.state.settings.quality==='light' ? 1 : Math.min(window.devicePixelRatio,2)
    renderer.setPixelRatio(Math.min(limit,Math.sqrt(budget/(width*height)))*adaptive)
    renderer.setSize(width,height,false)
    if(qualityKey==='cinema') post?.resize(width,height)
    camera.aspect=width/height; camera.updateProjectionMatrix()
    if(display) {
      const key=cameraKey()
      if(viewKey!==key) {viewKey=key; frameCamera()}
    }
    mark()
  }

  function draw() {
    frame=0
    if (!display || disposed || contextLost || !inView || document.hidden) return
    let moving=false
    if (!paused) parts.forEach((part,id)=>{
      if(activeDrag?.id===id && activeDrag.moved) return
      const q=part.userData.targetRotation as T.Quaternion
      if(part.position.distanceToSquared(targets[id])<.000001 && part.quaternion.angleTo(q)<.009) return
      part.position.lerp(targets[id],.25); part.quaternion.slerp(q,.25); moving=true
    })
    if(!dirty&&!moving) return
    if(moving) renderer.shadowMap.needsUpdate=true
    const started=performance.now()
    renderFrame()
    const elapsed=performance.now()-started
    if(moving && display.state.settings.quality==='auto') {
      samples.push(elapsed)
      if(samples.length>=24) {
        const avg=samples.reduce((a,b)=>a+b,0)/samples.length
        const next=avg>24 ? Math.max(.64,adaptive-.10) : avg<17 ? Math.min(1,adaptive+.025) : adaptive
        samples=[]
        if(next!==adaptive) {adaptive=next;resize()}
      }
    }
    host.dataset.calls=String(renderer.info.render.calls)
    host.dataset.triangles=String(renderer.info.render.triangles)
    host.dataset.renderMs=elapsed.toFixed(2)
    host.dataset.pipeline=post&&qualityKey==='cinema'?'cinema':'direct'
    dirty=false
    if(moving) request()
  }

  function renderFrame() {
    renderer.info.autoReset=false;renderer.info.reset()
    if(post&&qualityKey==='cinema') post.render()
    else renderer.render(scene,camera)
  }

  function aim(event:PointerEvent) {
    const rect=canvas.getBoundingClientRect()
    pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1)
    scene.updateMatrixWorld()
    ray.setFromCamera(pointer,camera)
  }
  function brush() {
    const hits=jointHits.flatMap((segments,id)=>jointAvailable(display.state.sceneState,id) ? segments : [])
    const hit=ray.intersectObjects(hits,false)[0]
    if(hit) actions.brush(hit.object.userData.id,hit.object.userData.section)
  }
  function down(event:PointerEvent) {
    if(display.state.phase!=='work'||display.compare||display.tool==='orbit'||activePointer!==undefined||event.button!==0) return
    activePointer=event.pointerId; canvas.setPointerCapture(event.pointerId); aim(event)
    if(display.tool==='lacquer'||display.tool==='finish') {
      painting=true; brush(); return
    }
    const id=ray.intersectObjects(partHits,false).find(hit=>display.state.sceneState.fragments[hit.object.userData.id].slot===null)?.object.userData.id as number|undefined
    if(id===undefined) return
    actions.select(id)
    const part=parts[id], world=part.getWorldPosition(new T.Vector3())
    dragPlane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new T.Vector3()),world)
    if(ray.ray.intersectPlane(dragPlane,dragPoint)) {
      activeDrag={id,pointer:event.pointerId,x:event.clientX,y:event.clientY,offset:world.sub(dragPoint),moved:false}
    }
  }
  function move(event:PointerEvent) {
    if(event.pointerId!==activePointer) return
    aim(event)
    if(painting) {brush(); return}
    if(!activeDrag) return
    activeDrag.moved ||= Math.hypot(event.clientX-activeDrag.x,event.clientY-activeDrag.y)>5
    if(activeDrag.moved && ray.ray.intersectPlane(dragPlane,dragPoint)) {
      parts[activeDrag.id].position.copy(stage.worldToLocal(dragPoint.add(activeDrag.offset))); moved()
    }
  }
  function up(event:PointerEvent) {
    if(event.pointerId!==activePointer) return
    const drag=activeDrag
    activeDrag=undefined; painting=false; activePointer=undefined
    if(canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
    if(!drag?.moved || event.type!=='pointerup') {moved();return}
    aim(event)
    const {fragments,count,vessel}=display.state.sceneState
    const alternatives=display.state.mode==='alternate'
    const eligible=Array.from({length:count},(_,id)=>id).filter(id=>(alternatives||id===drag.id)&&!fragments.some(part=>part.slot===id))
    const distances=eligible.map(slot=>{
      const center=surface(vessel,.70,(slot+.5)*Tau/count+.14)
      return {slot,distance:ray.ray.distanceToPoint(stage.localToWorld(center))}
    }).sort((a,b)=>a.distance-b.distance)
    if(distances[0]) actions.fit(drag.id,distances[0].slot,distances[0].distance)
    moved()
  }
  const lost=(event:Event)=>{event.preventDefault();contextLost=true;actions.fallback(true);actions.status('Visualização suspensa. Os controles da bancada continuam disponíveis.')}
  const restored=()=>{
    contextLost=false
    environment.dispose();environment=makeEnvironment()
    actions.fallback(false);moved()
  }
  canvas.addEventListener('webglcontextlost',lost); canvas.addEventListener('webglcontextrestored',restored)
  canvas.addEventListener('pointerdown',down); canvas.addEventListener('pointermove',move)
  canvas.addEventListener('pointerup',up); canvas.addEventListener('pointercancel',up); canvas.addEventListener('lostpointercapture',up)
  const observer=new ResizeObserver(resize); observer.observe(host)
  const intersection=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;if(inView)mark()}); intersection.observe(host)
  document.addEventListener('visibilitychange',mark)
  return {
    sync(next:Display) {display=next;sync()},
    orbit(step:number) {
      const relative=camera.position.clone().sub(controls.target)
      relative.applyAxisAngle(T.Object3D.DEFAULT_UP,step)
      camera.position.copy(controls.target).add(relative); controls.update(); mark()
    },
    resize,
    snapshot() {renderFrame();return canvas.toDataURL('image/png')},
    dispose() {
      disposed=true; cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect()
      document.removeEventListener('visibilitychange',mark)
      controls.dispose(); release(scene); environment.dispose(); post?.dispose(); sun.shadow.dispose(); renderer.dispose(); canvas.remove()
    },
  }
}
