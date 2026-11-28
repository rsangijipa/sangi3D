import * as THREE from 'three'
import type { GameState, Tool, View } from '../game/state.ts'
import { stepPhysics } from '../game/rules.ts'
import { createProceduralTextures, createMaterials } from './materials.ts'
import { buildGallery } from './gallery.ts'
import { buildMobile } from './mobile.ts'
import { cinema } from './cinema.ts'

export interface SceneCallbacks {
  selectWeight: (id: string | null) => void
  selectHole: (slot: number) => void
  moveFulcrum: (pos: number) => void
  status: (msg: string) => void
  fallback: (active: boolean) => void
}

export interface SyncPayload {
  state: GameState
  tool: Tool
  view: View
  selectedWeightId: string | null
}

export function init(container: HTMLElement, callbacks: SceneCallbacks) {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl2', {
    powerPreference: 'high-performance',
    antialias: true
  })
  if (!gl) {
    callbacks.fallback(true)
    throw new Error('WebGL2 not available')
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    context: gl,
    powerPreference: 'high-performance',
    antialias: true,
    preserveDrawingBuffer: true
  })

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(container.clientWidth || 1280, container.clientHeight || 720)
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xe9e8df)

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    42,
    (container.clientWidth || 1280) / (container.clientHeight || 720),
    0.1,
    30
  )

  // Camera viewpoint presets
  const views: Record<View, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
    panoramic: {
      pos: new THREE.Vector3(0.3, 1.82, 2.55),
      target: new THREE.Vector3(0, 1.45, 0)
    },
    fulcrum: {
      pos: new THREE.Vector3(0.08, 1.82, 1.15),
      target: new THREE.Vector3(0, 1.75, 0)
    },
    top: {
      pos: new THREE.Vector3(0, 3.4, 0.45),
      target: new THREE.Vector3(0, 1.4, 0)
    },
    weights: {
      pos: new THREE.Vector3(0.55, 1.45, 1.35),
      target: new THREE.Vector3(0.25, 1.35, 0)
    }
  }

  let currentView: View = 'panoramic'
  const cameraPos = views.panoramic.pos.clone()
  const cameraTarget = views.panoramic.target.clone()
  camera.position.copy(cameraPos)
  camera.lookAt(cameraTarget)

  // Orbit rotation angle around central platform
  let orbitAngle = 0

  // Lighting setup
  const hemiLight = new THREE.HemisphereLight(0xfffaed, 0xd8caa8, 1.2)
  hemiLight.position.set(0, 8, 0)
  scene.add(hemiLight)

  const sunLight = new THREE.DirectionalLight(0xfffaea, 2.2)
  sunLight.position.set(2.4, 6.2, 2.2)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.width = 2048
  sunLight.shadow.mapSize.height = 2048
  sunLight.shadow.camera.near = 0.5
  sunLight.shadow.camera.far = 15
  sunLight.shadow.camera.left = -3
  sunLight.shadow.camera.right = 3
  sunLight.shadow.camera.top = 3
  sunLight.shadow.camera.bottom = -3
  sunLight.shadow.bias = -0.0005
  scene.add(sunLight)

  // Warm floor bounce light
  const floorBounce = new THREE.PointLight(0xdecbb8, 0.65, 6)
  floorBounce.position.set(0, 0.4, 0)
  scene.add(floorBounce)

  // Build Environment and Mobile
  const textures = createProceduralTextures()
  const materials = createMaterials(textures)
  buildGallery(scene, materials)
  const mobile = buildMobile(materials)
  scene.add(mobile.root)

  let cinemaPipeline = cinema(renderer, scene, camera)

  // Raycasting for interactive picking
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  let isPointerDown = false
  let pointerStartX = 0
  let pointerStartY = 0
  let hasDragged = false

  function getPointerPos(e: MouseEvent | TouchEvent): { x: number; y: number } {
    const rect = renderer!.domElement.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    return {
      x: ((clientX - rect.left) / rect.width) * 2 - 1,
      y: -((clientY - rect.top) / rect.height) * 2 + 1
    }
  }

  function onPointerDown(e: MouseEvent | TouchEvent) {
    isPointerDown = true
    hasDragged = false
    const pos = getPointerPos(e)
    pointerStartX = pos.x
    pointerStartY = pos.y
  }

  function onPointerMove(e: MouseEvent | TouchEvent) {
    if (!isPointerDown) return
    const pos = getPointerPos(e)
    const dx = pos.x - pointerStartX
    const dy = pos.y - pointerStartY
    if (Math.hypot(dx, dy) > 0.02) {
      hasDragged = true
      // Orbit around the center
      orbitAngle += dx * 1.5
      pointerStartX = pos.x
      pointerStartY = pos.y
    }
  }

  function onPointerUp(e: MouseEvent | TouchEvent) {
    if (!isPointerDown) return
    isPointerDown = false
    if (!hasDragged) {
      // It was a click/tap: raycast to pick item
      const pos = getPointerPos(e)
      mouse.set(pos.x, pos.y)
      raycaster.setFromCamera(mouse, camera)

      const intersects = raycaster.intersectObjects(scene.children, true)
      for (const hit of intersects) {
        let obj: THREE.Object3D | null = hit.object
        while (obj && obj !== scene) {
          if (obj.userData?.type === 'weight') {
            callbacks.selectWeight(obj.userData.id)
            return
          }
          if (obj.userData?.type === 'hole') {
            callbacks.selectHole(obj.userData.slot)
            return
          }
          if (obj.name === 'fulcrum-carriage') {
            callbacks.moveFulcrum(0)
            return
          }
          obj = obj.parent
        }
      }
      callbacks.selectWeight(null)
    }
  }

  const dom = renderer.domElement
  dom.addEventListener('mousedown', onPointerDown)
  dom.addEventListener('mousemove', onPointerMove)
  window.addEventListener('mouseup', onPointerUp)
  dom.addEventListener('touchstart', onPointerDown, { passive: true })
  dom.addEventListener('touchmove', onPointerMove, { passive: true })
  window.addEventListener('touchend', onPointerUp)

  // Context Loss Recovery
  dom.addEventListener('webglcontextlost', event => {
    event.preventDefault()
    callbacks.fallback(true)
  })
  dom.addEventListener('webglcontextrestored', () => {
    callbacks.fallback(false)
  })

  // Animation & Physics Loop
  let lastTime = performance.now()
  let animId = 0
  let currentState: GameState | null = null
  let selectedWeightId: string | null = null

  function tick(now: number) {
    animId = requestAnimationFrame(tick)
    const dt = Math.min((now - lastTime) / 1000, 0.06)
    lastTime = now

    if (currentState && currentState.phase === 'work') {
      stepPhysics(currentState.sceneState, dt, currentState.settings.reduced)
      mobile.sync(currentState.sceneState, selectedWeightId)
    }

    // Smooth camera transition towards current view preset
    const targetPos = views[currentView].pos.clone()
    const targetLook = views[currentView].target.clone()

    // Apply orbit angle offset to camera
    if (Math.abs(orbitAngle) > 0.001) {
      const radius = targetPos.z
      targetPos.x += Math.sin(orbitAngle) * radius
      targetPos.z = Math.cos(orbitAngle) * radius
    }

    camera.position.lerp(targetPos, 0.08)
    cameraTarget.lerp(targetLook, 0.08)
    camera.lookAt(cameraTarget)

    // Render with Cinema composer or direct renderer
    const startRender = performance.now()
    const useCinema = currentState?.settings.quality === 'cinema' && cinemaPipeline
    if (useCinema) {
      cinemaPipeline!.render()
    } else {
      renderer!.render(scene, camera)
    }
    const renderMs = (performance.now() - startRender).toFixed(2)

    // Update dataset on container for QA and test runners
    container.dataset.calls = String(renderer!.info.render.calls)
    container.dataset.triangles = String(renderer!.info.render.triangles)
    container.dataset.renderMs = renderMs
    container.dataset.pipeline = useCinema ? 'cinema' : 'direct'
  }
  animId = requestAnimationFrame(tick)

  function sync(payload: SyncPayload) {
    currentState = payload.state
    selectedWeightId = payload.selectedWeightId
    if (payload.view !== currentView) {
      currentView = payload.view
      orbitAngle = 0
    }
    mobile.sync(payload.state.sceneState, selectedWeightId)
  }

  function orbit(delta: number) {
    orbitAngle += delta
  }

  function resize(width: number, height: number) {
    if (!renderer) return
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    cinemaPipeline?.resize(width, height)
  }

  function snapshot(): string {
    if (!renderer) return ''
    renderer.render(scene, camera)
    return renderer.domElement.toDataURL('image/png')
  }

  function dispose() {
    cancelAnimationFrame(animId)
    dom.removeEventListener('mousedown', onPointerDown)
    dom.removeEventListener('mousemove', onPointerMove)
    window.removeEventListener('mouseup', onPointerUp)
    dom.removeEventListener('touchstart', onPointerDown)
    dom.removeEventListener('touchmove', onPointerMove)
    window.removeEventListener('touchend', onPointerUp)
    cinemaPipeline?.dispose()
    renderer?.dispose()
    if (dom.parentElement === container) {
      container.removeChild(dom)
    }
  }

  return {
    sync,
    orbit,
    resize,
    snapshot,
    dispose
  }
}
