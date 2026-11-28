import * as THREE from 'three'
import { WAYPOINTS } from '../game/content.ts'
import type { WaypointId } from '../game/state.ts'
import { createMaterials } from './materials.ts'
import { buildMarketInterior } from './market.ts'
import { populateMarketItems, type ShelfItemInstance } from './items.ts'
import { ShoppingCartView } from './cart.ts'
import { CinemaPipeline } from './cinema.ts'

export interface SceneCallbacks {
  onPickItem: (productId: string) => void
  onRingBell: () => void
  onWaypointReached: (waypoint: WaypointId) => void
}

export class MarketScene {
  private container: HTMLElement
  private canvas: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer | null = null
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private pipeline: CinemaPipeline | null = null
  private mats: ReturnType<typeof createMaterials>
  private cartView: ShoppingCartView
  private shelfItems: Record<string, ShelfItemInstance> = {}
  private pickables: THREE.Mesh[] = []
  private callbacks: SceneCallbacks

  // Lighting
  private sunLight: THREE.DirectionalLight
  private ambientLight: THREE.AmbientLight
  private pendantLights: THREE.PointLight[] = []

  // Animation & Navigation
  private currentWaypoint: WaypointId = 'entrance'
  private targetCamPos: THREE.Vector3 = new THREE.Vector3()
  private targetLookAt: THREE.Vector3 = new THREE.Vector3()
  private currentLookAt: THREE.Vector3 = new THREE.Vector3()
  private isMovingWaypoint: boolean = false
  private waypointTransitionAlpha: number = 1.0

  // Raycasting & Interaction
  private raycaster: THREE.Raycaster
  private mouse: THREE.Vector2
  private bellMesh: THREE.Object3D | null = null

  // Parabolic Flying Item Animations
  private flyingItems: Array<{
    mesh: THREE.Group
    startPos: THREE.Vector3
    endPos: THREE.Vector3
    progress: number
    duration: number
    onComplete?: () => void
  }> = []

  // Animation Loop
  private animationFrameId: number | null = null
  private lastTime: number = 0
  private isDisposed: boolean = false
  public lowStimulation: boolean = false

  constructor(container: HTMLElement, canvas: HTMLCanvasElement, callbacks: SceneCallbacks) {
    this.container = container
    this.canvas = canvas
    this.callbacks = callbacks

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
    this.renderer.toneMappingExposure = 1.05
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xf6f0e4)
    this.scene.fog = new THREE.FogExp2(0xf6f0e4, 0.025)

    // Camera: Guided first person (FOV 50° for cozy warm perspective)
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 35)

    // Materials
    this.mats = createMaterials()

    // 1. Build Room Interior
    const interiorGroup = buildMarketInterior(this.scene, this.mats)
    this.bellMesh = interiorGroup.getObjectByName('service-bell-button') || null

    // 2. Setup Lighting
    this.ambientLight = new THREE.AmbientLight(0xfcf4e8, 0.85)
    this.scene.add(this.ambientLight)

    // Sunlight angling through back window
    this.sunLight = new THREE.DirectionalLight(0xfff3db, 1.8)
    this.sunLight.position.set(-2.5, 4.5, -4.0)
    this.sunLight.target.position.set(0, 0.5, 0.5)
    this.sunLight.castShadow = true
    this.sunLight.shadow.mapSize.width = 1024
    this.sunLight.shadow.mapSize.height = 1024
    this.sunLight.shadow.camera.near = 0.5
    this.sunLight.shadow.camera.far = 15
    this.sunLight.shadow.camera.left = -4
    this.sunLight.shadow.camera.right = 4
    this.sunLight.shadow.camera.top = 4
    this.sunLight.shadow.camera.bottom = -4
    this.sunLight.shadow.bias = -0.0005
    this.scene.add(this.sunLight)
    this.scene.add(this.sunLight.target)

    // Warm pendant lights pools
    const pendantPositions: [number, number, number][] = [
      [0, 2.3, -1.8],
      [0, 2.3, 0.5],
      [0, 2.3, 2.4]
    ]
    pendantPositions.forEach(([px, py, pz], i) => {
      const pl = new THREE.PointLight(0xffdfa8, 1.2, 5.0, 1.6)
      pl.position.set(px, py, pz)
      pl.castShadow = (i === 1) // only middle one casts point shadow for performance
      this.scene.add(pl)
      this.pendantLights.push(pl)
    })

    // 3. Populate Shelf Items
    const { instances, pickables } = populateMarketItems(this.scene, this.mats)
    this.shelfItems = instances
    this.pickables = pickables

    // 4. Player Carrier (Shopping Cart / Basket)
    this.cartView = new ShoppingCartView(this.mats)
    this.scene.add(this.cartView.root)

    // 5. Post Processing Pipeline
    this.pipeline = new CinemaPipeline(this.renderer, this.scene, this.camera, width, height)

    // 6. Raycaster
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2(-1000, -1000)

    // Set initial waypoint
    this.setWaypoint('entrance', true)

    // Bind event listeners
    this.bindEvents()

    // Start render loop
    this.lastTime = performance.now()
    this.animate(this.lastTime)
  }

  private bindEvents() {
    this.onPointerDown = this.onPointerDown.bind(this)
    this.onPointerMove = this.onPointerMove.bind(this)
    this.onResize = this.onResize.bind(this)

    this.canvas.addEventListener('pointerdown', this.onPointerDown)
    this.canvas.addEventListener('pointermove', this.onPointerMove)
    window.addEventListener('resize', this.onResize)
  }

  private onPointerMove(e: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect()
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    if (this.isMovingWaypoint) return

    this.raycaster.setFromCamera(this.mouse, this.camera)
    const targets = [...this.pickables]
    if (this.bellMesh) targets.push(this.bellMesh as THREE.Mesh)

    const hits = this.raycaster.intersectObjects(targets, true)
    if (hits.length > 0) {
      this.canvas.style.cursor = 'pointer'
    } else {
      this.canvas.style.cursor = 'default'
    }
  }

  private onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return // left click only
    if (this.isMovingWaypoint) return

    const rect = this.canvas.getBoundingClientRect()
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    this.raycaster.setFromCamera(this.mouse, this.camera)
    const targets = [...this.pickables]
    if (this.bellMesh) targets.push(this.bellMesh as THREE.Mesh)

    const hits = this.raycaster.intersectObjects(targets, true)
    if (hits.length > 0) {
      const hit = hits[0]
      let obj: THREE.Object3D | null = hit.object

      // Check if service bell clicked
      if (this.bellMesh && (obj === this.bellMesh || this.isDescendantOf(obj, this.bellMesh))) {
        this.callbacks.onRingBell()
        return
      }

      // Check if product clicked
      while (obj && !obj.userData?.productId) {
        obj = obj.parent
      }

      if (obj && obj.userData?.productId) {
        const prodId = obj.userData.productId
        this.callbacks.onPickItem(prodId)
      }
    }
  }

  private isDescendantOf(child: THREE.Object3D, parent: THREE.Object3D): boolean {
    let curr: THREE.Object3D | null = child
    while (curr) {
      if (curr === parent) return true
      curr = curr.parent
    }
    return false
  }

  public setWaypoint(waypointId: WaypointId, immediate = false) {
    const wp = WAYPOINTS[waypointId]
    if (!wp) return

    this.currentWaypoint = waypointId
    this.targetCamPos.set(wp.cameraPos[0], wp.cameraPos[1], wp.cameraPos[2])
    this.targetLookAt.set(wp.cameraLook[0], wp.cameraLook[1], wp.cameraLook[2])

    if (immediate) {
      this.camera.position.copy(this.targetCamPos)
      this.currentLookAt.copy(this.targetLookAt)
      this.camera.lookAt(this.currentLookAt)
      this.updateCartPosition()
      this.callbacks.onWaypointReached(waypointId)
    } else {
      this.isMovingWaypoint = true
      this.waypointTransitionAlpha = 0
    }
  }

  private updateCartPosition() {
    // Keep cart positioned in front-right of current camera view
    const forward = new THREE.Vector3()
    this.camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()

    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize()

    // Place cart slightly in front and to the right
    const cartPos = this.camera.position.clone()
      .addScaledVector(forward, 0.95)
      .addScaledVector(right, 0.38)
    cartPos.y = 0 // on floor

    this.cartView.root.position.copy(cartPos)
    // Rotate cart facing gently forward
    const lookTarget = cartPos.clone().add(forward)
    this.cartView.root.lookAt(lookTarget)
  }

  public playFlyItemAnimation(productId: string, onComplete?: () => void) {
    const shelfItem = this.shelfItems[productId]
    const startPos = shelfItem ? shelfItem.group.position.clone().add(new THREE.Vector3(0, 0.1, 0)) : this.camera.position.clone()
    const endPos = this.cartView.root.position.clone().add(new THREE.Vector3(0, 0.65, 0))

    // Create a temporary clone mesh for the flying flight
    const flyGroup = new THREE.Group()
    const visual = this.mats ? this.shelfItems[productId]?.group.clone() : new THREE.Group()
    flyGroup.add(visual)
    flyGroup.position.copy(startPos)
    this.scene.add(flyGroup)

    this.flyingItems.push({
      mesh: flyGroup,
      startPos,
      endPos,
      progress: 0,
      duration: 0.55,
      onComplete: () => {
        this.scene.remove(flyGroup)
        if (onComplete) onComplete()
      }
    })
  }

  public ringBellAnimation() {
    if (!this.bellMesh) return
    const origY = this.bellMesh.position.y
    this.bellMesh.position.y = origY - 0.008
    setTimeout(() => {
      if (this.bellMesh) this.bellMesh.position.y = origY
    }, 120)
  }

  public updateCartCarrier(carrier: 'cart' | 'basket') {
    this.cartView.setCarrier(carrier)
  }

  public updateCartContents(itemIds: string[]) {
    this.cartView.updateItems(itemIds)
  }

  public setLowStimulation(enabled: boolean) {
    this.lowStimulation = enabled
    if (enabled) {
      this.renderer?.toneMappingExposure ? (this.renderer.toneMappingExposure = 0.9) : null
      this.sunLight.intensity = 1.1
      this.ambientLight.intensity = 0.95
      this.pendantLights.forEach(pl => (pl.intensity = 0.8))
      this.pipeline?.setBloom(0.05)
    } else {
      this.renderer?.toneMappingExposure ? (this.renderer.toneMappingExposure = 1.05) : null
      this.sunLight.intensity = 1.8
      this.ambientLight.intensity = 0.85
      this.pendantLights.forEach(pl => (pl.intensity = 1.2))
      this.pipeline?.setBloom(0.18)
    }
  }

  private onResize() {
    if (!this.renderer || isNaN(this.container.clientWidth)) return
    const width = this.container.clientWidth || window.innerWidth
    const height = this.container.clientHeight || window.innerHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
    this.pipeline?.setSize(width, height)
  }

  private animate(now: number) {
    if (this.isDisposed) return
    this.animationFrameId = requestAnimationFrame(t => this.animate(t))

    const delta = Math.min((now - this.lastTime) / 1000, 0.1)
    this.lastTime = now

    // 1. Camera Waypoint Interpolation
    if (this.isMovingWaypoint) {
      const prevPos = this.camera.position.clone()
      this.waypointTransitionAlpha += delta * 1.8
      const t = Math.min(this.waypointTransitionAlpha, 1.0)
      // Smooth easeInOutQuad
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

      this.camera.position.lerp(this.targetCamPos, ease * 0.18 + 0.05)
      this.currentLookAt.lerp(this.targetLookAt, ease * 0.18 + 0.05)
      this.camera.lookAt(this.currentLookAt)

      const dist = prevPos.distanceTo(this.camera.position)
      this.cartView.spinWheels(dist)
      this.updateCartPosition()

      if (this.camera.position.distanceTo(this.targetCamPos) < 0.04) {
        this.camera.position.copy(this.targetCamPos)
        this.currentLookAt.copy(this.targetLookAt)
        this.camera.lookAt(this.currentLookAt)
        this.updateCartPosition()
        this.isMovingWaypoint = false
        this.callbacks.onWaypointReached(this.currentWaypoint)
      }
    }

    // 2. Parabolic Fly Item Animations
    for (let i = this.flyingItems.length - 1; i >= 0; i--) {
      const item = this.flyingItems[i]
      item.progress += delta / item.duration
      const p = Math.min(item.progress, 1.0)

      // Linear lerp in X & Z, parabolic arc in Y
      const currentX = THREE.MathUtils.lerp(item.startPos.x, item.endPos.x, p)
      const currentZ = THREE.MathUtils.lerp(item.startPos.z, item.endPos.z, p)
      const currentY = THREE.MathUtils.lerp(item.startPos.y, item.endPos.y, p) + Math.sin(p * Math.PI) * 0.45

      item.mesh.position.set(currentX, currentY, currentZ)
      item.mesh.rotation.y += delta * 5.0
      item.mesh.rotation.x += delta * 2.5

      if (p >= 1.0) {
        item.onComplete?.()
        this.flyingItems.splice(i, 1)
      }
    }

    // 3. Subtle floating breathing on shelf items
    const idleTime = now * 0.002
    for (const [id, item] of Object.entries(this.shelfItems)) {
      if (!item.inCart) {
        // subtle bobbing on produce crates
        const bob = Math.sin(idleTime + id.charCodeAt(0)) * 0.002
        item.group.position.y = item.basePosition.y + bob
      }
    }

    // 4. Render
    if (this.pipeline) {
      this.pipeline.render()
    } else if (this.renderer) {
      this.renderer.render(this.scene, this.camera)
    }
  }

  public dispose() {
    this.isDisposed = true
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
    }
    this.canvas.removeEventListener('pointerdown', this.onPointerDown)
    this.canvas.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('resize', this.onResize)

    this.pipeline?.dispose()
    this.renderer?.dispose()
  }
}
