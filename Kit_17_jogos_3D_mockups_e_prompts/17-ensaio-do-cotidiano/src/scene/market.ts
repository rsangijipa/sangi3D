import * as THREE from 'three'
import type { createMaterials } from './materials.ts'

/**
 * Builds the market interior:
 * - Parquet floor with central moss green rug runner
 * - Wooden modular shelves on both sides with shelves and dividers
 * - Checkout counter with vintage brass cash register, service bell, and chalkboard sign
 * - Back window and door letting in natural sunbeams
 * - Overhead ceiling beams and 3 green enamel pendant lamps
 * - Friendly cashier NPC figure
 */
export function buildMarketInterior(scene: THREE.Scene, materials: ReturnType<typeof createMaterials>) {
  const root = new THREE.Group()
  root.name = 'market-interior'

  const {
    woodMat,
    darkWoodMat,
    floorMat,
    rugMat,
    wallMat,
    greenMetalMat,
    brassMat,
    chalkMat,
    glassMat,
    bulbMat,
    apronMat,
    figurineMat
  } = materials

  // 1. Floor & Walls
  // Floor (8m wide, 10m deep)
  const floorGeo = new THREE.PlaneGeometry(7.5, 9.5)
  const floor = new THREE.Mesh(floorGeo, floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  root.add(floor)

  // Moss Green Runner Rug along central aisle (width 1.25m, length 7.5m)
  const rugGeo = new THREE.PlaneGeometry(1.25, 7.5)
  const rug = new THREE.Mesh(rugGeo, rugMat)
  rug.rotation.x = -Math.PI / 2
  rug.position.set(0, 0.005, 0.6)
  rug.receiveShadow = true
  root.add(rug)

  // Back Wall (at z = -3.8)
  const backWallGeo = new THREE.PlaneGeometry(7.5, 4.2)
  const backWall = new THREE.Mesh(backWallGeo, wallMat)
  backWall.position.set(0, 2.1, -3.8)
  backWall.receiveShadow = true
  root.add(backWall)

  // Side Walls
  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(9.5, 4.2), wallMat)
  leftWall.position.set(-3.75, 2.1, 0)
  leftWall.rotation.y = Math.PI / 2
  leftWall.receiveShadow = true
  root.add(leftWall)

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(9.5, 4.2), wallMat)
  rightWall.position.set(3.75, 2.1, 0)
  rightWall.rotation.y = -Math.PI / 2
  rightWall.receiveShadow = true
  root.add(rightWall)

  // 2. Back Window & Door
  // Large multi-pane shop window (width 2.6m, height 2.0m)
  const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.0, 0.08), darkWoodMat)
  windowFrame.position.set(1.4, 2.2, -3.76)
  root.add(windowFrame)

  // Window Glass Panes with mullions
  const winGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.8), glassMat)
  winGlass.position.set(1.4, 2.2, -3.74)
  root.add(winGlass)

  // Back Door (width 1.0m, height 2.3m)
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.05, 2.3, 0.08), darkWoodMat)
  door.position.set(-1.6, 1.15, -3.76)
  root.add(door)
  // Brass doorknob
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), brassMat)
  knob.position.set(-1.25, 1.15, -3.7)
  root.add(knob)

  // 3. Overhead Beams & Green Pendant Lamps
  const beamGeo = new THREE.BoxGeometry(7.5, 0.16, 0.22)
  ;[-2.0, 0.5, 3.0].forEach(z => {
    const beam = new THREE.Mesh(beamGeo, darkWoodMat)
    beam.position.set(0, 3.8, z)
    beam.castShadow = true
    root.add(beam)
  })

  // 3 Pendant Lamps hanging from ceiling down the central aisle
  const lampPositions: [number, number, number][] = [
    [0, 2.65, 2.2],
    [0, 2.65, 0.4],
    [0, 2.65, -1.4]
  ]

  lampPositions.forEach(([x, y, z]) => {
    const lampGroup = new THREE.Group()
    lampGroup.position.set(x, y, z)

    // Suspension Cord
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 1.1, 8), darkWoodMat)
    cord.position.set(0, 0.55, 0)
    lampGroup.add(cord)

    // Green Enamel Dome Shade
    const shade = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      greenMetalMat
    )
    shade.rotation.x = Math.PI
    shade.castShadow = true
    lampGroup.add(shade)

    // Brass top fitting
    const fitting = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.08, 16), brassMat)
    fitting.position.set(0, 0.04, 0)
    lampGroup.add(fitting)

    // Warm Light Bulb
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), bulbMat)
    bulb.position.set(0, -0.06, 0)
    lampGroup.add(bulb)

    // Local Point Light pool
    const lampLight = new THREE.PointLight(0xffdf99, 1.4, 4.5, 1.8)
    lampLight.position.set(0, -0.15, 0)
    lampLight.castShadow = false
    lampGroup.add(lampLight)

    root.add(lampGroup)
  })

  // 4. Modular Wooden Shelves
  // Left Shelf (Banca de Frutas & Alimentos): from z = 2.4 to z = -0.5
  function buildShelfUnit(x: number, zCenter: number, length: number): THREE.Group {
    const shelfGroup = new THREE.Group()
    shelfGroup.position.set(x, 0, zCenter)

    // Uprights (posts)
    const postGeo = new THREE.BoxGeometry(0.08, 1.85, 0.48)
    const p1 = new THREE.Mesh(postGeo, woodMat)
    p1.position.set(0, 0.925, -length / 2 + 0.04)
    p1.castShadow = true
    shelfGroup.add(p1)

    const p2 = new THREE.Mesh(postGeo, woodMat)
    p2.position.set(0, 0.925, length / 2 - 0.04)
    p2.castShadow = true
    shelfGroup.add(p2)

    // Center post
    const p3 = new THREE.Mesh(postGeo, woodMat)
    p3.position.set(0, 0.925, 0)
    p3.castShadow = true
    shelfGroup.add(p3)

    // Shelf planks at 3 heights: 0.35m, 0.85m, 1.35m
    const plankGeo = new THREE.BoxGeometry(0.44, 0.04, length)
    ;[0.35, 0.85, 1.35].forEach(h => {
      const plank = new THREE.Mesh(plankGeo, woodMat)
      plank.position.set(0, h, 0)
      plank.castShadow = true
      plank.receiveShadow = true
      shelfGroup.add(plank)
    })

    // Back slatted panel
    const backGeo = new THREE.BoxGeometry(0.02, 1.75, length)
    const back = new THREE.Mesh(backGeo, darkWoodMat)
    back.position.set(x > 0 ? 0.22 : -0.22, 0.925, 0)
    shelfGroup.add(back)

    return shelfGroup
  }

  // Left side shelving (produce & pantry)
  const leftShelf = buildShelfUnit(-1.38, 0.9, 3.4)
  root.add(leftShelf)

  // Right side shelving (grains, bakery, library books)
  const rightShelf1 = buildShelfUnit(1.38, 0.7, 2.6)
  root.add(rightShelf1)

  const rightShelf2 = buildShelfUnit(1.38, -1.0, 2.2)
  root.add(rightShelf2)

  // 5. Checkout Counter & Cash Register
  const checkoutGroup = new THREE.Group()
  checkoutGroup.name = 'checkout-counter'
  checkoutGroup.position.set(-1.25, 0, -1.6)

  // Main Counter Base (width 1.6m, depth 0.65m, height 0.95m)
  const counterBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.92, 0.65), darkWoodMat)
  counterBase.position.set(0, 0.46, 0)
  counterBase.castShadow = true
  counterBase.receiveShadow = true
  checkoutGroup.add(counterBase)

  // Marble/ceramic counter top with bevel
  const counterTop = new THREE.Mesh(
    new THREE.BoxGeometry(1.68, 0.05, 0.72),
    new THREE.MeshStandardMaterial({ color: 0xf2ede4, roughness: 0.3, metalness: 0.05 })
  )
  counterTop.position.set(0, 0.945, 0)
  counterTop.castShadow = true
  counterTop.receiveShadow = true
  checkoutGroup.add(counterTop)

  // Vintage Brass Mechanical Cash Register
  const regBase = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 0.32), darkWoodMat)
  regBase.position.set(-0.35, 1.04, 0.02)
  checkoutGroup.add(regBase)

  const regBody = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.26), brassMat)
  regBody.position.set(-0.35, 1.21, 0)
  regBody.castShadow = true
  checkoutGroup.add(regBody)

  // Curved top decorative marquee
  const regTop = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.3, 16, 1, false, 0, Math.PI), brassMat)
  regTop.rotation.z = Math.PI / 2
  regTop.position.set(-0.35, 1.33, 0)
  checkoutGroup.add(regTop)

  // Service Bell on Counter ("Campainha")
  const bellGroup = new THREE.Group()
  bellGroup.name = 'service-bell'
  bellGroup.position.set(0.18, 0.97, 0.12)
  bellGroup.userData = { interactive: true, action: 'ring-bell' }

  const bellBase = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.02, 16), darkWoodMat)
  bellGroup.add(bellBase)

  const bellDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    brassMat
  )
  bellDome.position.set(0, 0.02, 0)
  bellDome.castShadow = true
  bellGroup.add(bellDome)

  const bellButton = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.035, 12), brassMat)
  bellButton.position.set(0, 0.075, 0)
  bellGroup.add(bellButton)

  checkoutGroup.add(bellGroup)

  // Blackboard Info Sign on Counter ("Placa de informação")
  const signGroup = new THREE.Group()
  signGroup.position.set(0.55, 1.15, 0.05)
  signGroup.rotation.y = -0.2

  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.28, 0.02), chalkMat)
  signBoard.castShadow = true
  signGroup.add(signBoard)

  const signFrame = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.31, 0.025), darkWoodMat)
  signFrame.position.set(0, 0, -0.005)
  signGroup.add(signFrame)

  checkoutGroup.add(signGroup)

  // Friendly Cashier NPC Figurine behind counter
  const npcGroup = new THREE.Group()
  npcGroup.name = 'cashier-npc'
  npcGroup.position.set(-0.15, 0.9, -0.45)

  // Apron Torso
  const npcTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.55, 16), apronMat)
  npcTorso.position.set(0, 0.275, 0)
  npcTorso.castShadow = true
  npcGroup.add(npcTorso)

  // Head
  const npcHead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), figurineMat)
  npcHead.position.set(0, 0.65, 0)
  npcHead.castShadow = true
  npcGroup.add(npcHead)

  // Friendly smiling eyes / face dots
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x332211 })
  const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), eyeMat)
  eye1.position.set(-0.04, 0.66, 0.11)
  npcGroup.add(eye1)
  const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), eyeMat)
  eye2.position.set(0.04, 0.66, 0.11)
  npcGroup.add(eye2)

  // Cloth Cap
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.14, 0.06, 16), apronMat)
  cap.position.set(0, 0.74, 0)
  npcGroup.add(cap)

  checkoutGroup.add(npcGroup)
  root.add(checkoutGroup)

  scene.add(root)
  return root
}
