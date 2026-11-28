import * as THREE from 'three'

/**
 * Creates canvas-based procedural PBR textures for stone, brass, terracotta, and crackled glaze.
 */
export function createProceduralTextures() {
  // 1. Travertine / Limestone texture (subtle pores and veins)
  const stoneCanvas = document.createElement('canvas')
  stoneCanvas.width = 512
  stoneCanvas.height = 512
  const sctx = stoneCanvas.getContext('2d')!
  sctx.fillStyle = '#E3D7C5'
  sctx.fillRect(0, 0, 512, 512)

  // Subtle mineral noise & travertine banding
  for (let y = 0; y < 512; y++) {
    const wave = Math.sin(y * 0.05) * 5 + Math.sin(y * 0.12) * 2
    for (let x = 0; x < 512; x += 4) {
      const n = Math.random()
      if (n > 0.6) {
        sctx.fillStyle = n > 0.85 ? 'rgba(195, 178, 155, 0.4)' : 'rgba(238, 230, 218, 0.5)'
        sctx.fillRect(x + wave, y, 4, 1)
      }
    }
  }
  // Pores
  for (let i = 0; i < 600; i++) {
    const px = Math.random() * 512
    const py = Math.random() * 512
    const pr = Math.random() * 2 + 0.5
    sctx.fillStyle = 'rgba(160, 140, 120, 0.35)'
    sctx.beginPath()
    sctx.arc(px, py, pr, 0, Math.PI * 2)
    sctx.fill()
  }
  const stoneTex = new THREE.CanvasTexture(stoneCanvas)
  stoneTex.wrapS = THREE.RepeatWrapping
  stoneTex.wrapT = THREE.RepeatWrapping

  // 2. Brushed Brass texture
  const brassCanvas = document.createElement('canvas')
  brassCanvas.width = 256
  brassCanvas.height = 256
  const bctx = brassCanvas.getContext('2d')!
  bctx.fillStyle = '#C8A359'
  bctx.fillRect(0, 0, 256, 256)
  for (let y = 0; y < 256; y++) {
    const bright = (Math.random() - 0.5) * 0.15
    bctx.fillStyle = bright > 0 ? `rgba(255, 235, 180, ${bright})` : `rgba(100, 75, 30, ${-bright})`
    bctx.fillRect(0, y, 256, 1)
  }
  const brassTex = new THREE.CanvasTexture(brassCanvas)
  brassTex.wrapS = THREE.RepeatWrapping
  brassTex.wrapT = THREE.RepeatWrapping

  // 3. Terracotta Wave Vase texture
  const terraCanvas = document.createElement('canvas')
  terraCanvas.width = 512
  terraCanvas.height = 512
  const tctx = terraCanvas.getContext('2d')!
  tctx.fillStyle = '#B45746'
  tctx.fillRect(0, 0, 512, 512)
  // Subtle clay stippling
  for (let i = 0; i < 4000; i++) {
    tctx.fillStyle = Math.random() > 0.5 ? 'rgba(140, 55, 40, 0.15)' : 'rgba(210, 110, 90, 0.15)'
    tctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2)
  }
  // Engraved white wavy lines in the middle band
  tctx.strokeStyle = '#EFE9DE'
  tctx.lineWidth = 4
  tctx.lineCap = 'round'
  const waveY = [230, 255, 280]
  waveY.forEach(baseY => {
    tctx.beginPath()
    for (let x = 0; x <= 512; x += 4) {
      const y = baseY + Math.sin((x / 512) * Math.PI * 12) * 8
      if (x === 0) tctx.moveTo(x, y)
      else tctx.lineTo(x, y)
    }
    tctx.stroke()
  })
  const terraTex = new THREE.CanvasTexture(terraCanvas)
  terraTex.wrapS = THREE.RepeatWrapping

  // 4. Cracked Celadon Glaze texture
  const crackleCanvas = document.createElement('canvas')
  crackleCanvas.width = 256
  crackleCanvas.height = 256
  const cctx = crackleCanvas.getContext('2d')!
  cctx.fillStyle = '#7E978D'
  cctx.fillRect(0, 0, 256, 256)
  cctx.strokeStyle = 'rgba(70, 90, 80, 0.4)'
  cctx.lineWidth = 1.2
  for (let i = 0; i < 35; i++) {
    cctx.beginPath()
    let cx = Math.random() * 256
    let cy = Math.random() * 256
    cctx.moveTo(cx, cy)
    for (let step = 0; step < 4; step++) {
      cx += (Math.random() - 0.5) * 60
      cy += (Math.random() - 0.5) * 60
      cctx.lineTo(cx, cy)
    }
    cctx.stroke()
  }
  const crackleTex = new THREE.CanvasTexture(crackleCanvas)

  // 5. Wood Grain texture for sub-beam
  const woodCanvas = document.createElement('canvas')
  woodCanvas.width = 256
  woodCanvas.height = 64
  const wctx = woodCanvas.getContext('2d')!
  wctx.fillStyle = '#BE9B6D'
  wctx.fillRect(0, 0, 256, 64)
  for (let x = 0; x < 256; x++) {
    const grain = Math.sin(x * 0.2) * 0.08 + (Math.random() - 0.5) * 0.05
    wctx.fillStyle = grain > 0 ? `rgba(235, 205, 160, ${grain})` : `rgba(110, 80, 45, ${-grain})`
    wctx.fillRect(x, 0, 1, 64)
  }
  const woodTex = new THREE.CanvasTexture(woodCanvas)
  woodTex.wrapS = THREE.RepeatWrapping

  return {
    stoneTex,
    brassTex,
    terraTex,
    crackleTex,
    woodTex
  }
}

export function createMaterials(tex: ReturnType<typeof createProceduralTextures>) {
  // Architectural Travertine / Limestone
  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0xdbcdb5,
    map: tex.stoneTex,
    roughness: 0.85,
    metalness: 0.05
  })

  // Circular podium material
  const podiumMat = new THREE.MeshStandardMaterial({
    color: 0xdecbb8,
    map: tex.stoneTex,
    roughness: 0.75,
    metalness: 0.08
  })

  // Antique Patinated Brass
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xb59550,
    map: tex.brassTex,
    roughness: 0.28,
    metalness: 0.88
  })

  // Dark patinated brass (for screws, bolts, joints)
  const darkBrassMat = new THREE.MeshStandardMaterial({
    color: 0x6e5628,
    roughness: 0.45,
    metalness: 0.75
  })

  // Terracotta Vase Material
  const terracottaMat = new THREE.MeshStandardMaterial({
    color: 0xb45746,
    map: tex.terraTex,
    roughness: 0.9,
    metalness: 0.02
  })

  // Sage Green Ceramic Glaze (Fluted sphere)
  const sageMat = new THREE.MeshStandardMaterial({
    color: 0x596f69,
    roughness: 0.35,
    metalness: 0.12
  })

  // Optical Glass Sphere
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    metalness: 0.0,
    transmission: 0.9,
    ior: 1.52,
    transparent: true,
    opacity: 0.85
  })

  // Travertine Stone Ring
  const ringStoneMat = new THREE.MeshStandardMaterial({
    color: 0xdbcdb5,
    map: tex.stoneTex,
    roughness: 0.9,
    metalness: 0.05
  })

  // Celadon Crackled Glaze (Dome/bowl)
  const crackleMat = new THREE.MeshStandardMaterial({
    color: 0x7e978d,
    map: tex.crackleTex,
    roughness: 0.3,
    metalness: 0.1
  })

  // Carved Wood Material
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0xc8a474,
    map: tex.woodTex,
    roughness: 0.65,
    metalness: 0.05
  })

  // Dark suspension cord / steel cable
  const cableMat = new THREE.MeshStandardMaterial({
    color: 0x3d352c,
    roughness: 0.5,
    metalness: 0.7
  })

  // Highlight / Selected Glow Material
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x5ce6cf,
    wireframe: true,
    transparent: true,
    opacity: 0.8
  })

  return {
    stoneMat,
    podiumMat,
    brassMat,
    darkBrassMat,
    terracottaMat,
    sageMat,
    glassMat,
    ringStoneMat,
    crackleMat,
    woodMat,
    cableMat,
    glowMat
  }
}
