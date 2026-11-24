import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

export class CinemaPipeline {
  private composer: EffectComposer | null = null
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private bloomPass: UnrealBloomPass | null = null
  private isEnabled: boolean = true

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    width: number,
    height: number
  ) {
    this.renderer = renderer
    this.scene = scene
    this.camera = camera

    try {
      this.composer = new EffectComposer(renderer)
      const renderPass = new RenderPass(scene, camera)
      this.composer.addPass(renderPass)

      // Subtle atmospheric bloom for sunlight & pendant bulbs
      this.bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        0.18, // subtle strength
        0.4,  // radius
        0.88  // threshold
      )
      this.composer.addPass(this.bloomPass)

      const outputPass = new OutputPass()
      this.composer.addPass(outputPass)
    } catch (e) {
      console.warn('Post-processing unavailable, falling back to direct render:', e)
      this.composer = null
      this.isEnabled = false
    }
  }

  public setSize(width: number, height: number) {
    if (this.composer) {
      this.composer.setSize(width, height)
    }
    if (this.bloomPass) {
      this.bloomPass.resolution.set(width, height)
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled && this.composer !== null
  }

  public setBloom(strength: number) {
    if (this.bloomPass) {
      this.bloomPass.strength = strength
    }
  }

  public render() {
    if (this.isEnabled && this.composer) {
      this.composer.render()
    } else {
      this.renderer.render(this.scene, this.camera)
    }
  }

  public dispose() {
    if (this.composer) {
      this.composer = null
    }
  }
}
