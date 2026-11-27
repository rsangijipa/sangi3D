import * as THREE from '../vendor/three.module.js';

/**
 * shared/engine/lighting.js
 * Configuração de iluminação cinemática e presets de atmosfera
 */

export class LightingRig {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.options = Object.assign({
      preset: 'warm_studio',
      ambientIntensity: 0.45,
      mainIntensity: 1.4,
      castShadows: true
    }, options);

    this.ambientLight = new THREE.HemisphereLight(0xfff7ed, 0x4a3b32, this.options.ambientIntensity);
    this.scene.add(this.ambientLight);

    this.mainLight = new THREE.DirectionalLight(0xfff3db, this.options.mainIntensity);
    this.mainLight.position.set(6, 10, 8);
    if (this.options.castShadows) {
      this.mainLight.castShadow = true;
      this.mainLight.shadow.mapSize.width = 1024;
      this.mainLight.shadow.mapSize.height = 1024;
      this.mainLight.shadow.camera.near = 0.5;
      this.mainLight.shadow.camera.far = 30;
      this.mainLight.shadow.camera.left = -6;
      this.mainLight.shadow.camera.right = 6;
      this.mainLight.shadow.camera.top = 6;
      this.mainLight.shadow.camera.bottom = -6;
      this.mainLight.shadow.bias = -0.0005;
      this.mainLight.shadow.radius = 2.5;
    }
    this.scene.add(this.mainLight);

    // Rim / Back light suave
    this.rimLight = new THREE.DirectionalLight(0xbad2e8, 0.45);
    this.rimLight.position.set(-6, 6, -8);
    this.scene.add(this.rimLight);
  }

  setPreset(preset) {
    switch (preset) {
      case 'sunset':
        this.ambientLight.color.setHex(0xffcb99);
        this.ambientLight.groundColor.setHex(0x542918);
        this.mainLight.color.setHex(0xff7733);
        this.mainLight.position.set(8, 4, 6);
        this.rimLight.color.setHex(0x5d4777);
        break;
      case 'night':
        this.ambientLight.color.setHex(0x233142);
        this.ambientLight.groundColor.setHex(0x0a0f18);
        this.mainLight.color.setHex(0x738fa7);
        this.mainLight.position.set(4, 8, 4);
        this.rimLight.color.setHex(0x192231);
        break;
      case 'dawn':
        this.ambientLight.color.setHex(0xffe6d5);
        this.ambientLight.groundColor.setHex(0x403126);
        this.mainLight.color.setHex(0xffbe85);
        this.mainLight.position.set(-8, 5, 6);
        this.rimLight.color.setHex(0x7ea0b7);
        break;
      case 'warm_studio':
      default:
        this.ambientLight.color.setHex(0xfff7ed);
        this.ambientLight.groundColor.setHex(0x4a3b32);
        this.mainLight.color.setHex(0xfff3db);
        this.mainLight.position.set(6, 10, 8);
        this.rimLight.color.setHex(0xbad2e8);
        break;
    }
  }

  dispose() {
    for (const light of [this.ambientLight, this.mainLight, this.rimLight]) {
      if (!light) continue;
      this.scene.remove(light);
      if (light.shadow?.map && typeof light.shadow.map.dispose === 'function') {
        try { light.shadow.map.dispose(); } catch {}
      }
      if (typeof light.dispose === 'function') {
        try { light.dispose(); } catch {}
      }
    }
  }
}
