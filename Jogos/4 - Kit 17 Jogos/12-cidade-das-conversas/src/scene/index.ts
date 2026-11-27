import * as THREE from 'three'
import { createMaterials } from './materials.ts'
import { buildVillageDiorama } from './environment.ts'
import { buildCharacters, type CharacterRigs } from './characters.ts'

export interface SceneCallbacks {
  onPointerAction?: () => void
}

export class CityScene {
  private container: HTMLElement
  private canvas: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private mats: ReturnType<typeof createMaterials>
  private characters: CharacterRigs
  private sunLight: THREE.DirectionalLight
  private ambientLight: THREE.AmbientLight
  private isDisposed = false
  private animFrameId: number | null = null
  private lastTime = 0
  public isSpeaking = true

  // Anchor point in 3D for the speech bubble
  private speechAnchor3D = new THREE.Vector3(0.42, 1.42, 0.05)

  constructor(container: HTMLElement, canvas: HTMLCanvasElement, _callbacks?: SceneCallbacks) {
    this.container = container
    this.canvas = canvas

    // Test WebGL2 support safely before instantiating renderer
    const gl = canvas.getContext('webgl2', {
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false
    })

    if (!gl) {
      throw new Error('WebGL2 is not supported on this device/environment')
    }

    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      context: gl,
      antialias: true,
      powerPreference: 'high-performance'
    })
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.08
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xf6f0e4)
    this.scene.fog = new THREE.FogExp2(0xf6f0e4, 0.028)

    // Camera: Focal length ~42° for cozy diorama perspective
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 40)
    this.updateCameraLayout()

    // Materials
    this.mats = createMaterials()

    // 1. Build Diorama Environment
    const diorama = buildVillageDiorama(this.mats)
    this.scene.add(diorama)

    // 2. Build Characters (Player & Baker)
    this.characters = buildCharacters(this.scene, this.mats)

    // 3. Lighting setup
    this.ambientLight = new THREE.AmbientLight(0xfef5e6, 0.9)
    this.scene.add(this.ambientLight)

    // Main warm sunlight motivada por aberturas
    this.sunLight = new THREE.DirectionalLight(0xfff2dc, 1.9)
    this.sunLight.position.set(-3.5, 5.5, 4.0)
    this.sunLight.target.position.set(0, 0.8, 0)
    this.sunLight.castShadow = true
    this.sunLight.shadow.mapSize.width = 1024
    this.sunLight.shadow.mapSize.height = 1024
    this.sunLight.shadow.camera.near = 0.5
    this.sunLight.shadow.camera.far = 18
    this.sunLight.shadow.camera.left = -4.5
    this.sunLight.shadow.camera.right = 4.5
    this.sunLight.shadow.camera.top = 4.5
    this.sunLight.shadow.camera.bottom = -4.5
    this.sunLight.shadow.bias = -0.0004
    this.scene.add(this.sunLight)
    this.scene.add(this.sunLight.target)

    // Sky fill light
    const skyFill = new THREE.HemisphereLight(0xfbf6ea, 0x8fae5c, 0.4)
    this.scene.add(skyFill)

    // Bind event listeners
    this.onResize = this.onResize.bind(this)
    window.addEventListener('resize', this.onResize)

    // Start render loop
    this.lastTime = performance.now()
    this.animate(this.lastTime)
  }

  public updateCameraLayout() {
    const width = this.container.clientWidth || window.innerWidth
    const isMobile = width < 768

    if (isMobile) {
      // In mobile, upper portion shows the dialogue interaction
      this.camera.position.set(-0.15, 1.42, 2.75)
      this.camera.lookAt(new THREE.Vector3(0.04, 1.08, 0.15))
    } else {
      // Desktop composition matching the production mockup
      this.camera.position.set(-0.35, 1.45, 2.38)
      this.camera.lookAt(new THREE.Vector3(0.08, 1.12, 0.15))
    }
  }

  public getSpeechScreenCoords(): { x: number; y: number; visible: boolean } {
    const pos = this.speechAnchor3D.clone()
    pos.project(this.camera)

    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight

    const x = ((pos.x + 1) * width) / 2
    const y = ((-pos.y + 1) * height) / 2
    const visible = pos.z < 1.0

    return { x, y, visible }
  }

  public setLowStimulation(enabled: boolean) {
    if (enabled) {
      this.renderer.toneMappingExposure = 0.92
      this.sunLight.intensity = 1.2
      this.ambientLight.intensity = 0.95
    } else {
      this.renderer.toneMappingExposure = 1.08
      this.sunLight.intensity = 1.9
      this.ambientLight.intensity = 0.9
    }
  }

  private onResize() {
    if (isNaN(this.container.clientWidth) || this.container.clientWidth === 0) return
    const width = this.container.clientWidth || window.innerWidth
    const height = this.container.clientHeight || window.innerHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.updateCameraLayout()
    this.renderer.setSize(width, height)
  }

  private animate(now: number) {
    if (this.isDisposed) return
    this.animFrameId = requestAnimationFrame(t => this.animate(t))

    const delta = Math.min((now - this.lastTime) / 1000, 0.1)
    this.lastTime = now

    // Update characters idle & speaking rigs
    this.characters.update(delta, this.isSpeaking)

    // Render scene
    this.renderer.render(this.scene, this.camera)
  }

  public dispose() {
    this.isDisposed = true
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId)
    }
    window.removeEventListener('resize', this.onResize)
    this.renderer.dispose()
  }
}
