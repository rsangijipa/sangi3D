import * as THREE from 'three'

/**
 * Creates procedural canvas textures and PBR materials for honey oak wood,
 * moss felt rug, green metal cart, kraft paper, ceramic tiles, and glass.
 */
export function createProceduralTextures() {
  // 1. Honey Oak Wood Texture (prateleiras, balcão, caixotes)
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
        wctx.fillStyle = n > 0.85 ? 'rgba(150, 105, 55, 0.45)' : 'rgba(235, 195, 140, 0.4)'
        wctx.fillRect(x + grain, y, 4, 1)
      }
    }
  }
  const woodTex = new THREE.CanvasTexture(woodCanvas)
  woodTex.wrapS = THREE.RepeatWrapping
  woodTex.wrapT = THREE.RepeatWrapping

  // 2. Parquet Floor Texture (tábuas de piso claras)
  const floorCanvas = document.createElement('canvas')
  floorCanvas.width = 512
  floorCanvas.height = 512
  const fctx = floorCanvas.getContext('2d')!
  fctx.fillStyle = '#DECEB5'
  fctx.fillRect(0, 0, 512, 512)
  // Planks
  fctx.strokeStyle = 'rgba(120, 95, 65, 0.4)'
  fctx.lineWidth = 2
  for (let y = 0; y < 512; y += 64) {
    fctx.beginPath()
    fctx.moveTo(0, y)
    fctx.lineTo(512, y)
    fctx.stroke()
  }
  for (let x = 0; x < 512; x += 128) {
    for (let y = 0; y < 512; y += 64) {
      const offset = (y / 64) % 2 === 0 ? 0 : 64
      fctx.beginPath()
      fctx.moveTo(x + offset, y)
      fctx.lineTo(x + offset, y + 64)
      fctx.stroke()
    }
  }
  const floorTex = new THREE.CanvasTexture(floorCanvas)
  floorTex.wrapS = THREE.RepeatWrapping
  floorTex.wrapT = THREE.RepeatWrapping
  floorTex.repeat.set(4, 8)

  // 3. Moss Green Runner Rug Texture (feltro texturizado com trama)
  const rugCanvas = document.createElement('canvas')
  rugCanvas.width = 256
  rugCanvas.height = 512
  const rctx = rugCanvas.getContext('2d')!
  rctx.fillStyle = '#48634B'
  rctx.fillRect(0, 0, 256, 512)
  // Subtle woven fiber noise
  for (let i = 0; i < 6000; i++) {
    rctx.fillStyle = Math.random() > 0.5 ? 'rgba(95, 130, 95, 0.25)' : 'rgba(45, 65, 45, 0.25)'
    rctx.fillRect(Math.random() * 256, Math.random() * 512, 2, 2)
  }
  // Border stitches
  rctx.strokeStyle = 'rgba(215, 195, 150, 0.7)'
  rctx.lineWidth = 3
  rctx.strokeRect(6, 6, 244, 500)
  const rugTex = new THREE.CanvasTexture(rugCanvas)
  rugTex.wrapS = THREE.RepeatWrapping
  rugTex.wrapT = THREE.RepeatWrapping
  rugTex.repeat.set(1, 4)

  // 4. Kraft Paper / Sacks Texture
  const kraftCanvas = document.createElement('canvas')
  kraftCanvas.width = 256
  kraftCanvas.height = 256
  const kctx = kraftCanvas.getContext('2d')!
  kctx.fillStyle = '#D4B892'
  kctx.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 3000; i++) {
    kctx.fillStyle = Math.random() > 0.5 ? 'rgba(165, 135, 95, 0.2)' : 'rgba(240, 225, 200, 0.2)'
    kctx.fillRect(Math.random() * 256, Math.random() * 256, 1, 1)
  }
  const kraftTex = new THREE.CanvasTexture(kraftCanvas)

  // 5. Blackboard / Info Sign Chalkboard Texture
  const chalkCanvas = document.createElement('canvas')
  chalkCanvas.width = 256
  chalkCanvas.height = 128
  const cctx = chalkCanvas.getContext('2d')!
  cctx.fillStyle = '#263D4C'
  cctx.fillRect(0, 0, 256, 128)
  cctx.fillStyle = '#F2E4CC'
  cctx.font = 'bold 22px serif'
  cctx.textAlign = 'center'
  cctx.fillText('MERCADINHO', 128, 48)
  cctx.font = '14px sans-serif'
  cctx.fillText('Produtos Frescos do Dia', 128, 80)
  const chalkTex = new THREE.CanvasTexture(chalkCanvas)

  return {
    woodTex,
    floorTex,
    rugTex,
    kraftTex,
    chalkTex
  }
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

  // Darker walnut accent wood
  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x825838,
    map: textures.woodTex,
    roughness: 0.68,
    metalness: 0.05
  })

  // Parquet Floor
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xdeceb5,
    map: textures.floorTex,
    roughness: 0.65,
    metalness: 0.05
  })

  // Moss Green Runner Rug
  const rugMat = new THREE.MeshStandardMaterial({
    color: 0x48634b,
    map: textures.rugTex,
    roughness: 0.95,
    metalness: 0.0
  })

  // Warm Cream Wall
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xf3ede2,
    roughness: 0.88,
    metalness: 0.02
  })

  // Emerald Green Metal (Shopping Cart & Lamps)
  const greenMetalMat = new THREE.MeshStandardMaterial({
    color: 0x254533,
    roughness: 0.35,
    metalness: 0.75
  })

  // Wire Mesh Cart Material
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0x6e9680,
    roughness: 0.28,
    metalness: 0.85
  })

  // Polished Vintage Brass (bell, register accents, lamp fittings)
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd8ae66,
    roughness: 0.25,
    metalness: 0.9
  })

  // Kraft Paper / Sacks
  const kraftMat = new THREE.MeshStandardMaterial({
    color: 0xd4b892,
    map: textures.kraftTex,
    roughness: 0.92,
    metalness: 0.0
  })

  // Chalkboard Info Sign
  const chalkMat = new THREE.MeshStandardMaterial({
    map: textures.chalkTex,
    roughness: 0.85,
    metalness: 0.05
  })

  // Translucent Glass
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.88,
    roughness: 0.1,
    transparent: true,
    opacity: 0.75
  })

  // Lamp Bulb Emissive Light Material
  const bulbMat = new THREE.MeshStandardMaterial({
    color: 0xfff0c8,
    emissive: 0xffd27a,
    emissiveIntensity: 2.5,
    roughness: 0.2
  })

  // Cashier Apron Felt Material
  const apronMat = new THREE.MeshStandardMaterial({
    color: 0x2d4d38,
    roughness: 0.85,
    metalness: 0.02
  })

  // Cashier Skin / Clay Figurine
  const figurineMat = new THREE.MeshStandardMaterial({
    color: 0xedd1b6,
    roughness: 0.6,
    metalness: 0.05
  })

  // Highlight Glow / Waypoint Guide Material
  const highlightMat = new THREE.MeshBasicMaterial({
    color: 0x5ce6cf,
    wireframe: true,
    transparent: true,
    opacity: 0.75
  })

  return {
    woodMat,
    darkWoodMat,
    floorMat,
    rugMat,
    wallMat,
    greenMetalMat,
    wireMat,
    brassMat,
    kraftMat,
    kraftPaperMat: kraftMat,
    chalkMat,
    glassMat,
    bulbMat,
    apronMat,
    figurineMat,
    highlightMat
  }
}
