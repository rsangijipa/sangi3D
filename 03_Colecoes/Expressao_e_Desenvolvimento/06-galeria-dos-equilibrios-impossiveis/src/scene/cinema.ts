import { HalfFloatType, WebGLRenderTarget, type Camera, type Scene, type WebGLRenderer } from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'

class ContactPass extends GTAOPass {
  setSize(width: number, height: number) {
    super.setSize(Math.max(1, Math.floor(width / 2)), Math.max(1, Math.floor(height / 2)))
  }
}

export function cinema(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
  if (!renderer.extensions.has('EXT_color_buffer_float')) return
  const target = new WebGLRenderTarget(1, 1, {
    type: HalfFloatType,
    samples: Math.min(4, renderer.capabilities.maxSamples)
  })
  const composer = new EffectComposer(renderer, target)
  const draw = new RenderPass(scene, camera)
  const contact = new ContactPass(scene, camera, 256, 256)
  contact.updateGtaoMaterial({ radius: 0.18, thickness: 0.1, samples: 12 })
  contact.blendIntensity = 0.5
  const output = new OutputPass()
  composer.addPass(draw)
  composer.addPass(contact)
  composer.addPass(output)

  return {
    resize(width: number, height: number) {
      composer.setPixelRatio(renderer.getPixelRatio())
      composer.setSize(width, height)
    },
    render() {
      composer.render()
    },
    dispose() {
      draw.dispose()
      contact.dispose()
      output.dispose()
      composer.dispose()
    }
  }
}
