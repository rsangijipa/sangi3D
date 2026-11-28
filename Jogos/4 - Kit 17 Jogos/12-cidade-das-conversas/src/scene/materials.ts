import * as THREE from 'three'

/**
 * Procedural canvas textures and PBR materials for the warm miniature diorama town
 */
export function createProceduralTextures() {
  // 1. Honey Oak Wood Texture (prateleiras, balcão, placas, vigas)
  const woodCanvas = document.createElement('canvas')
  woodCanvas.width = 512
  woodCanvas.height = 512
  const wctx = woodCanvas.getContext('2d')!
  wctx.fillStyle = '#C89D66'
  wctx.fillRect(0, 0, 512, 512)
  for (let y = 0; y < 512; y++) {
    const grain = Math.sin(y * 0.08) * 12 + Math.sin(y * 0.22) * 4
    for (let x = 0; x < 512; x += 4) {
      const n = Math.random()
      if (n > 0.5) {
        wctx.fillStyle = n > 0.85 ? 'rgba(145, 98, 48, 0.45)' : 'rgba(235, 198, 145, 0.38)'
        wctx.fillRect(x + grain, y, 4, 1)
      }
    }
  }
  const woodTex = new THREE.CanvasTexture(woodCanvas)
  woodTex.wrapS = THREE.RepeatWrapping
  woodTex.wrapT = THREE.RepeatWrapping

  // 2. Cobblestone Pavement (calçada de pedras arredondadas da rua)
  const cobbleCanvas = document.createElement('canvas')
  cobbleCanvas.width = 512
  cobbleCanvas.height = 512
  const cctx = cobbleCanvas.getContext('2d')!
  cctx.fillStyle = '#C4BCAD'
  cctx.fillRect(0, 0, 512, 512)
  cctx.strokeStyle = 'rgba(110, 102, 90, 0.6)'
  cctx.lineWidth = 3
  for (let y = 0; y < 512; y += 48) {
    for (let x = 0; x < 512; x += 64) {
      const offset = (y / 48) % 2 === 0 ? 0 : 32
      const cx = x + offset + (Math.random() * 4 - 2)
      const cy = y + (Math.random() * 4 - 2)
      cctx.fillStyle = (x + y) % 3 === 0 ? '#CDC5B5' : (x + y) % 3 === 1 ? '#BEB5A4' : '#D4CCA3'
      cctx.beginPath()
      cctx.roundRect(cx + 4, cy + 4, 56, 40, 12)
      cctx.fill()
      cctx.stroke()
    }
  }
  const cobbleTex = new THREE.CanvasTexture(cobbleCanvas)
  cobbleTex.wrapS = THREE.RepeatWrapping
  cobbleTex.wrapT = THREE.RepeatWrapping
  cobbleTex.repeat.set(4, 4)

  // 3. Green & Cream Striped Awning Fabric
  const awningCanvas = document.createElement('canvas')
  awningCanvas.width = 256
  awningCanvas.height = 256
  const actx = awningCanvas.getContext('2d')!
  actx.fillStyle = '#F2E8D5'
  actx.fillRect(0, 0, 256, 256)
  actx.fillStyle = '#3A5E44'
  for (let x = 0; x < 256; x += 64) {
    actx.fillRect(x, 0, 32, 256)
  }
  const awningTex = new THREE.CanvasTexture(awningCanvas)
  awningTex.wrapS = THREE.RepeatWrapping
  awningTex.wrapT = THREE.RepeatWrapping

  // 4. Terracotta Roof Tiles
  const tileCanvas = document.createElement('canvas')
  tileCanvas.width = 256
  tileCanvas.height = 256
  const tctx = tileCanvas.getContext('2d')!
  tctx.fillStyle = '#B85E3E'
  tctx.fillRect(0, 0, 256, 256)
  tctx.strokeStyle = 'rgba(120, 50, 30, 0.5)'
  tctx.lineWidth = 3
  for (let y = 0; y < 256; y += 32) {
    tctx.beginPath()
    tctx.moveTo(0, y)
    tctx.lineTo(256, y)
    tctx.stroke()
  }
  for (let x = 0; x < 256; x += 32) {
    for (let y = 0; y < 256; y += 32) {
      const offset = (y / 32) % 2 === 0 ? 0 : 16
      tctx.beginPath()
      tctx.arc(x + offset + 16, y, 14, 0, Math.PI)
      tctx.stroke()
    }
  }
  const tileTex = new THREE.CanvasTexture(tileCanvas)
  tileTex.wrapS = THREE.RepeatWrapping
  tileTex.wrapT = THREE.RepeatWrapping

  // 5. Knit Wool Fabric (suéter terracota)
  const knitCanvas = document.createElement('canvas')
  knitCanvas.width = 128
  knitCanvas.height = 128
  const kctx = knitCanvas.getContext('2d')!
  kctx.fillStyle = '#BD5F3D'
  kctx.fillRect(0, 0, 128, 128)
  kctx.fillStyle = 'rgba(80, 30, 15, 0.25)'
  for (let y = 0; y < 128; y += 4) {
    for (let x = 0; x < 128; x += 4) {
      if ((x + y) % 8 === 0) kctx.fillRect(x, y, 2, 2)
    }
  }
  const knitTex = new THREE.CanvasTexture(knitCanvas)
  knitTex.wrapS = THREE.RepeatWrapping
  knitTex.wrapT = THREE.RepeatWrapping
  knitTex.repeat.set(6, 6)

  return { woodTex, cobbleTex, awningTex, tileTex, knitTex }
}

export function createMaterials(tex?: ReturnType<typeof createProceduralTextures>) {
  const textures = tex || createProceduralTextures()

  // Honey oak wood
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0xc89d66,
    map: textures.woodTex,
    roughness: 0.72,
    metalness: 0.04
  })

  // Darker walnut / counter top wood
  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x825434,
    map: textures.woodTex,
    roughness: 0.65,
    metalness: 0.05
  })

  // Cobblestone street
  const cobbleMat = new THREE.MeshStandardMaterial({
    color: 0xcdc4b5,
    map: textures.cobbleTex,
    roughness: 0.85,
    metalness: 0.02
  })

  // Striped awning
  const awningMat = new THREE.MeshStandardMaterial({
    map: textures.awningTex,
    roughness: 0.78,
    metalness: 0.02
  })

  // Terracotta roof tiles
  const roofTileMat = new THREE.MeshStandardMaterial({
    color: 0xba5f3e,
    map: textures.tileTex,
    roughness: 0.8,
    metalness: 0.02
  })

  // Terracotta sweater knit
  const sweaterMat = new THREE.MeshStandardMaterial({
    color: 0xb85e3b,
    map: textures.knitTex,
    roughness: 0.9,
    metalness: 0.0
  })

  // Clay / stop-motion hair (player curls and baker bun)
  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x583420,
    roughness: 0.68,
    metalness: 0.05
  })

  // Clay / stop-motion skin
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xedd1b6,
    roughness: 0.65,
    metalness: 0.04
  })

  // Linen / canvas backpack & baker shirt
  const linenMat = new THREE.MeshStandardMaterial({
    color: 0xe6dcce,
    roughness: 0.88,
    metalness: 0.02
  })

  // Baker dark green apron
  const apronMat = new THREE.MeshStandardMaterial({
    color: 0x3d5c45,
    roughness: 0.82,
    metalness: 0.03
  })

  // Golden crust bread & pastries
  const breadCrustMat = new THREE.MeshStandardMaterial({
    color: 0xc47b3b,
    roughness: 0.75,
    metalness: 0.02
  })

  // Fluffy green foliage for rolling hills and trees
  const foliageMat = new THREE.MeshStandardMaterial({
    color: 0x6e9647,
    roughness: 0.85,
    metalness: 0.0
  })

  // Rolling hills ground
  const grassMat = new THREE.MeshStandardMaterial({
    color: 0x8fae5c,
    roughness: 0.9,
    metalness: 0.0
  })

  // Translucent display glass
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.88,
    roughness: 0.08,
    transparent: true,
    opacity: 0.75
  })

  // Polished vintage brass lamp fittings
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd8ae66,
    roughness: 0.28,
    metalness: 0.85
  })

  // Warm glowing lamp bulb
  const bulbMat = new THREE.MeshStandardMaterial({
    color: 0xfff0c8,
    emissive: 0xffdf88,
    emissiveIntensity: 2.5,
    roughness: 0.2
  })

  // Bus stop blue sign
  const busBlueMat = new THREE.MeshStandardMaterial({
    color: 0x2766aa,
    roughness: 0.45,
    metalness: 0.2
  })

  return {
    woodMat,
    darkWoodMat,
    cobbleMat,
    awningMat,
    roofTileMat,
    sweaterMat,
    hairMat,
    skinMat,
    linenMat,
    apronMat,
    breadCrustMat,
    foliageMat,
    grassMat,
    glassMat,
    brassMat,
    bulbMat,
    busBlueMat
  }
}
