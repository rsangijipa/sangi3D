import * as THREE from 'three'
import type { createMaterials } from './materials.ts'

/**
 * Builds the sunlit neoclassical gallery environment matching the reference mockup:
 * - High ceiling, stone walls with graceful arches and courtyard greenery beyond
 * - Skylight overhead with iron mullions and soft motivated daylight
 * - Trailing lush foliage / ivy cascading from the architraves
 * - Circular beveled stone podium dais in the center
 * - Minimalist gallery props: wooden bench, stone pedestal with modernist abstract sculpture
 */
export function buildGallery(scene: THREE.Scene, materials: ReturnType<typeof createMaterials>) {
  const galleryGroup = new THREE.Group()
  galleryGroup.name = 'gallery-environment'

  const { stoneMat, podiumMat, woodMat, darkBrassMat } = materials

  // 1. Main Stone Floor
  const floorGeo = new THREE.PlaneGeometry(24, 24, 16, 16)
  const floorMesh = new THREE.Mesh(floorGeo, stoneMat)
  floorMesh.rotation.x = -Math.PI / 2
  floorMesh.receiveShadow = true
  galleryGroup.add(floorMesh)

  // 2. Central Circular Stone Podium
  // Radius 1.6m, height 0.14m
  const podiumGeo = new THREE.CylinderGeometry(1.6, 1.64, 0.14, 48)
  const podiumMesh = new THREE.Mesh(podiumGeo, podiumMat)
  podiumMesh.position.set(0, 0.07, 0)
  podiumMesh.receiveShadow = true
  podiumMesh.castShadow = true
  galleryGroup.add(podiumMesh)

  // Top lip / bevel ring on podium
  const lipGeo = new THREE.TorusGeometry(1.59, 0.02, 16, 48)
  const lipMesh = new THREE.Mesh(lipGeo, podiumMat)
  lipMesh.rotation.x = Math.PI / 2
  lipMesh.position.set(0, 0.14, 0)
  galleryGroup.add(lipMesh)

  // 3. Back Wall with Arches
  const wallGroup = new THREE.Group()
  wallGroup.position.set(0, 0, -3.8)

  // Wall pillars and arch headers
  const pillarGeo = new THREE.BoxGeometry(0.5, 4.5, 0.5)
  const p1 = new THREE.Mesh(pillarGeo, stoneMat)
  p1.position.set(-3.5, 2.25, 0)
  p1.castShadow = true
  p1.receiveShadow = true
  wallGroup.add(p1)

  const p2 = new THREE.Mesh(pillarGeo, stoneMat)
  p2.position.set(-0.8, 2.25, 0)
  p2.castShadow = true
  p2.receiveShadow = true
  wallGroup.add(p2)

  const p3 = new THREE.Mesh(pillarGeo, stoneMat)
  p3.position.set(1.9, 2.25, 0)
  p3.castShadow = true
  p3.receiveShadow = true
  wallGroup.add(p3)

  const p4 = new THREE.Mesh(pillarGeo, stoneMat)
  p4.position.set(4.6, 2.25, 0)
  p4.castShadow = true
  p4.receiveShadow = true
  wallGroup.add(p4)

  // Curved Arches connecting pillars
  function createArch(cx: number, width: number) {
    const archShape = new THREE.Shape()
    const r = width / 2
    archShape.absarc(cx, 3.4, r, 0, Math.PI, false)
    archShape.lineTo(cx - r - 0.25, 3.4)
    archShape.lineTo(cx - r - 0.25, 4.5)
    archShape.lineTo(cx + r + 0.25, 4.5)
    archShape.lineTo(cx + r + 0.25, 3.4)
    archShape.closePath()

    const extrudeSettings = { depth: 0.5, bevelEnabled: false }
    const archGeo = new THREE.ExtrudeGeometry(archShape, extrudeSettings)
    const archMesh = new THREE.Mesh(archGeo, stoneMat)
    archMesh.position.z = -0.25
    archMesh.castShadow = true
    archMesh.receiveShadow = true
    return archMesh
  }
  wallGroup.add(createArch(-2.15, 2.2))
  wallGroup.add(createArch(0.55, 2.2))
  wallGroup.add(createArch(3.25, 2.2))

  // Courtyard background visible through arches
  const yardCanvas = document.createElement('canvas')
  yardCanvas.width = 512
  yardCanvas.height = 256
  const yctx = yardCanvas.getContext('2d')!
  const yardGrad = yctx.createLinearGradient(0, 0, 0, 256)
  yardGrad.addColorStop(0, '#B8D0C5')
  yardGrad.addColorStop(0.4, '#CDE0D4')
  yardGrad.addColorStop(1, '#D8E2D9')
  yctx.fillStyle = yardGrad
  yctx.fillRect(0, 0, 512, 256)
  // Subtle garden greenery silhouettes
  yctx.fillStyle = 'rgba(80, 115, 95, 0.45)'
  for (let i = 0; i < 30; i++) {
    yctx.beginPath()
    yctx.arc(Math.random() * 512, 160 + Math.random() * 80, 20 + Math.random() * 35, 0, Math.PI * 2)
    yctx.fill()
  }
  const yardTex = new THREE.CanvasTexture(yardCanvas)
  const yardMat = new THREE.MeshBasicMaterial({ map: yardTex })
  const yardPlane = new THREE.Mesh(new THREE.PlaneGeometry(16, 5), yardMat)
  yardPlane.position.set(0, 2.5, -0.6)
  wallGroup.add(yardPlane)

  galleryGroup.add(wallGroup)

  // 4. Skylight Zenithal Ceiling Glass & Mullions
  const ceilingGroup = new THREE.Group()
  ceilingGroup.position.set(0, 4.6, -1.0)
  ceilingGroup.rotation.x = 0.25 // Angled skylight

  const skylightFrameGeo = new THREE.BoxGeometry(10, 0.08, 4.5)
  const skylightFrame = new THREE.Mesh(skylightFrameGeo, darkBrassMat)
  ceilingGroup.add(skylightFrame)

  // Mullion ribs
  for (let x = -4.5; x <= 4.5; x += 1.5) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 4.4), darkBrassMat)
    rib.position.set(x, 0, 0)
    ceilingGroup.add(rib)
  }
  for (let z = -1.8; z <= 1.8; z += 1.2) {
    const cross = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.08, 0.04), darkBrassMat)
    cross.position.set(0, 0, z)
    ceilingGroup.add(cross)
  }
  // Translucent skylight glass
  const skyGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe6f4f1,
    transmission: 0.85,
    roughness: 0.15,
    transparent: true,
    opacity: 0.65
  })
  const skyGlass = new THREE.Mesh(new THREE.PlaneGeometry(9.8, 4.4), skyGlassMat)
  skyGlass.rotation.x = Math.PI / 2
  ceilingGroup.add(skyGlass)

  galleryGroup.add(ceilingGroup)

  // 5. Hanging Foliage / Ivy Cascading
  const foliageGroup = new THREE.Group()
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x47634f,
    roughness: 0.7,
    side: THREE.DoubleSide
  })
  const vineCount = 20
  for (let i = 0; i < vineCount; i++) {
    const vx = -4 + i * 0.42 + (Math.random() - 0.5) * 0.2
    const len = 0.6 + Math.random() * 0.9
    const vineGeo = new THREE.CylinderGeometry(0.008, 0.005, len, 6)
    const vine = new THREE.Mesh(vineGeo, leafMat)
    vine.position.set(vx, 3.8 - len / 2, -3.5 + Math.random() * 0.2)
    vine.rotation.z = (Math.random() - 0.5) * 0.15
    foliageGroup.add(vine)

    // Clusters of leaves along vine
    for (let l = 0; l < 6; l++) {
      const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.09), leafMat)
      leaf.position.set(vx + (Math.random() - 0.5) * 0.08, 3.8 - len * (l / 6), -3.5)
      leaf.rotation.set(Math.random(), Math.random(), Math.random())
      foliageGroup.add(leaf)
    }
  }
  galleryGroup.add(foliageGroup)

  // 6. Gallery Props: Wooden Bench (left)
  const benchGroup = new THREE.Group()
  benchGroup.position.set(-2.8, 0, -2.5)
  benchGroup.rotation.y = 0.1
  const benchSeat = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.42), woodMat)
  benchSeat.position.set(0, 0.42, 0)
  benchSeat.castShadow = true
  benchSeat.receiveShadow = true
  benchGroup.add(benchSeat)
  const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.38), darkBrassMat)
  leg1.position.set(-0.55, 0.21, 0)
  benchGroup.add(leg1)
  const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.38), darkBrassMat)
  leg2.position.set(0.55, 0.21, 0)
  benchGroup.add(leg2)
  galleryGroup.add(benchGroup)

  // 7. Gallery Props: Minimalist Artwork on Left Wall
  const artCanvas = document.createElement('canvas')
  artCanvas.width = 256
  artCanvas.height = 340
  const actx = artCanvas.getContext('2d')!
  actx.fillStyle = '#E9E4DB'
  actx.fillRect(0, 0, 256, 340)
  // Terracotta arch and sage organic shape
  actx.fillStyle = '#A44D40'
  actx.beginPath()
  actx.arc(128, 140, 75, Math.PI, 0)
  actx.rect(53, 140, 150, 90)
  actx.fill()
  actx.fillStyle = '#596F69'
  actx.beginPath()
  actx.arc(128, 230, 50, 0, Math.PI * 2)
  actx.fill()
  const artTex = new THREE.CanvasTexture(artCanvas)
  const artMat = new THREE.MeshBasicMaterial({ map: artTex })
  const artMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.05), artMat)
  artMesh.position.set(-3.4, 2.2, -3.5)
  galleryGroup.add(artMesh)

  // 8. Gallery Props: Stone Pedestal with Abstract Modernist Sculpture (right)
  const pedGroup = new THREE.Group()
  pedGroup.position.set(2.4, 0, -2.6)

  // Tall cubic pedestal
  const pedMesh = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.6), stoneMat)
  pedMesh.position.set(0, 0.45, 0)
  pedMesh.castShadow = true
  pedMesh.receiveShadow = true
  pedGroup.add(pedMesh)

  // Organic modern sculpture (carved travertine with hole, Hepworth-inspired)
  const torusGeo = new THREE.TorusGeometry(0.28, 0.12, 24, 48)
  const sculpMesh = new THREE.Mesh(torusGeo, stoneMat)
  sculpMesh.position.set(0, 1.35, 0)
  sculpMesh.rotation.y = 0.4
  sculpMesh.rotation.x = 0.2
  sculpMesh.castShadow = true
  sculpMesh.receiveShadow = true
  pedGroup.add(sculpMesh)

  galleryGroup.add(pedGroup)

  scene.add(galleryGroup)
  return galleryGroup
}
