import * as THREE from 'three'
import type { createMaterials } from './materials.ts'

export function buildVillageDiorama(mats: ReturnType<typeof createMaterials>): THREE.Group {
  const root = new THREE.Group()
  root.name = 'village-diorama'

  const {
    woodMat,
    darkWoodMat,
    cobbleMat,
    awningMat,
    roofTileMat,
    breadCrustMat,
    foliageMat,
    grassMat,
    glassMat,
    brassMat,
    bulbMat,
    busBlueMat
  } = mats

  // 1. Cobblestone Ground & Rolling Hills
  // Cobblestone street plane
  const streetGeo = new THREE.PlaneGeometry(16, 16)
  const street = new THREE.Mesh(streetGeo, cobbleMat)
  street.rotation.x = -Math.PI / 2
  street.position.set(0, 0, 0)
  street.receiveShadow = true
  root.add(street)

  // Background rolling hills (smooth curved mounds)
  const hill1Geo = new THREE.SphereGeometry(6, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.45)
  const hill1 = new THREE.Mesh(hill1Geo, grassMat)
  hill1.position.set(-5, -3.2, -7.5)
  hill1.scale.set(1.4, 0.8, 1.2)
  root.add(hill1)

  const hill2Geo = new THREE.SphereGeometry(7, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.45)
  const hill2 = new THREE.Mesh(hill2Geo, grassMat)
  hill2.position.set(4.5, -3.6, -8.5)
  hill2.scale.set(1.5, 0.9, 1.3)
  root.add(hill2)

  // 2. Main Bakery Stall (Padaria)
  const bakery = new THREE.Group()
  bakery.name = 'bakery-stall'
  bakery.position.set(0.45, 0, -0.4)

  // Timber post frame (4 oak uprights)
  const postGeo = new THREE.BoxGeometry(0.12, 2.4, 0.12)
  const postCoords: [number, number, number][] = [
    [-1.0, 1.2, 0.8],
    [1.0, 1.2, 0.8],
    [-1.0, 1.2, -0.8],
    [1.0, 1.2, -0.8]
  ]
  postCoords.forEach(([px, py, pz]) => {
    const post = new THREE.Mesh(postGeo, woodMat)
    post.position.set(px, py, pz)
    post.castShadow = true
    post.receiveShadow = true
    bakery.add(post)
  })

  // Horizontal roof support beams
  const beamFront = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.12, 0.12), woodMat)
  beamFront.position.set(0, 2.34, 0.8)
  bakery.add(beamFront)

  const beamBack = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.12, 0.12), woodMat)
  beamBack.position.set(0, 2.34, -0.8)
  bakery.add(beamBack)

  // Rear back wall with wooden siding
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.3, 0.08), woodMat)
  backWall.position.set(0, 1.15, -0.84)
  backWall.castShadow = true
  backWall.receiveShadow = true
  bakery.add(backWall)

  // Bakery Front Counter (oak body + dark walnut service top)
  const counterBody = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.86, 0.5), woodMat)
  counterBody.position.set(0, 0.43, 0.55)
  counterBody.castShadow = true
  counterBody.receiveShadow = true
  bakery.add(counterBody)

  const counterTop = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.06, 0.62), darkWoodMat)
  counterTop.position.set(0, 0.89, 0.55)
  counterTop.castShadow = true
  counterTop.receiveShadow = true
  bakery.add(counterTop)

  // Striped green & cream canopy awning over the counter
  // Angled roof plane with curved scalloped valance
  const awningGeo = new THREE.PlaneGeometry(2.35, 1.25)
  const awning = new THREE.Mesh(awningGeo, awningMat)
  awning.position.set(0, 2.18, 0.85)
  awning.rotation.x = Math.PI / 4.5
  awning.castShadow = true
  bakery.add(awning)

  // Front Scalloped valance frill
  const valanceGeo = new THREE.BoxGeometry(2.35, 0.14, 0.03)
  const valance = new THREE.Mesh(valanceGeo, awningMat)
  valance.position.set(0, 1.76, 1.34)
  valance.castShadow = true
  bakery.add(valance)

  // Carved wooden board "Padaria" above the awning
  const signBoardGeo = new THREE.BoxGeometry(1.3, 0.32, 0.06)
  const signBoard = new THREE.Mesh(signBoardGeo, woodMat)
  signBoard.position.set(0, 2.45, 1.05)
  signBoard.rotation.x = -0.05
  signBoard.castShadow = true
  bakery.add(signBoard)

  // Loaf icon badge on sign
  const loafIconGeo = new THREE.SphereGeometry(0.06, 12, 8)
  loafIconGeo.scale(1.5, 0.7, 0.6)
  const loafIcon = new THREE.Mesh(loafIconGeo, darkWoodMat)
  loafIcon.position.set(-0.4, 2.45, 1.09)
  bakery.add(loafIcon)

  // Pastry Showcase on the counter (glass dome/box with pastries inside)
  const caseBase = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.36), woodMat)
  caseBase.position.set(0.45, 0.94, 0.55)
  bakery.add(caseBase)

  const caseGlass = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.22, 0.34), glassMat)
  caseGlass.position.set(0.45, 1.06, 0.55)
  caseGlass.castShadow = true
  bakery.add(caseGlass)

  // Croissants & buns inside display case
  const croissantOffsets = [-0.22, 0, 0.22]
  croissantOffsets.forEach((ox) => {
    const crossCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.05, 0, -0.02),
      new THREE.Vector3(0, 0.02, 0.03),
      new THREE.Vector3(0.05, 0, -0.02)
    ])
    const cGeo = new THREE.TubeGeometry(crossCurve, 10, 0.022, 6, false)
    const cMesh = new THREE.Mesh(cGeo, breadCrustMat)
    cMesh.position.set(0.45 + ox, 0.98, 0.55)
    cMesh.castShadow = true
    bakery.add(cMesh)
  })

  // Glass Cookie Jar on the counter
  const jarGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.22, 16)
  const jar = new THREE.Mesh(jarGeo, glassMat)
  jar.position.set(-0.18, 1.03, 0.58)
  jar.castShadow = true
  bakery.add(jar)

  // Cookies inside jar
  const cookieMat = new THREE.MeshStandardMaterial({ color: 0xb58045, roughness: 0.85 })
  for (let i = 0; i < 4; i++) {
    const cMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 10), cookieMat)
    cMesh.position.set(-0.18 + (i % 2 === 0 ? 0.015 : -0.015), 0.95 + i * 0.035, 0.58)
    cMesh.rotation.z = (i - 1.5) * 0.2
    bakery.add(cMesh)
  }

  // Cake Stand with glass cloche
  const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.08, 14), darkWoodMat)
  standBase.position.set(0.68, 0.96, 0.35)
  bakery.add(standBase)

  const cakeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 14), breadCrustMat)
  cakeMesh.position.set(0.68, 1.04, 0.35)
  bakery.add(cakeMesh)

  const clocheGeo = new THREE.SphereGeometry(0.12, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5)
  const cloche = new THREE.Mesh(clocheGeo, glassMat)
  cloche.position.set(0.68, 1.06, 0.35)
  bakery.add(cloche)

  // Woven Wicker Basket with Baguettes on the left counter
  const basketGeo = new THREE.CylinderGeometry(0.14, 0.11, 0.32, 14)
  const basket = new THREE.Mesh(basketGeo, woodMat)
  basket.position.set(-0.65, 1.05, 0.55)
  basket.castShadow = true
  bakery.add(basket)

  // 3 Baguettes standing in basket
  for (let b = 0; b < 3; b++) {
    const bagGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.55, 8)
    const baguette = new THREE.Mesh(bagGeo, breadCrustMat)
    baguette.position.set(-0.65 + (b - 1) * 0.04, 1.25, 0.55 + (b % 2 === 0 ? 0.02 : -0.02))
    baguette.rotation.z = (b - 1) * 0.18
    baguette.castShadow = true
    bakery.add(baguette)
  }

  // Rear Shelves with bread loaves
  const shelfYCoords = [0.85, 1.25, 1.65]
  shelfYCoords.forEach((sy) => {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.04, 0.32), woodMat)
    shelf.position.set(0, sy, -0.66)
    shelf.castShadow = true
    bakery.add(shelf)

    // Loaves on shelf
    for (let lx = -0.65; lx <= 0.65; lx += 0.32) {
      const loafGeo = new THREE.SphereGeometry(0.08, 12, 8)
      loafGeo.scale(1.4, 0.7, 0.8)
      const loaf = new THREE.Mesh(loafGeo, breadCrustMat)
      loaf.position.set(lx, sy + 0.06, -0.66)
      loaf.castShadow = true
      bakery.add(loaf)
    }
  })

  // Hanging Brass Bell Pendant Lamp inside bakery
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.55, 6), brassMat)
  cord.position.set(0.15, 2.05, 0.35)
  bakery.add(cord)

  const bellShade = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.16, 16, 1, true), brassMat)
  bellShade.position.set(0.15, 1.76, 0.35)
  bellShade.castShadow = true
  bakery.add(bellShade)

  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), bulbMat)
  bulb.position.set(0.15, 1.73, 0.35)
  bakery.add(bulb)

  // Warm Point Light radiating from the lamp
  const lampLight = new THREE.PointLight(0xffdf88, 2.0, 3.8, 1.6)
  lampLight.position.set(0.15, 1.68, 0.35)
  lampLight.castShadow = true
  bakery.add(lampLight)

  root.add(bakery)

  // 3. Bus Stop (Ponto de Ônibus) on the left
  const busStop = new THREE.Group()
  busStop.name = 'bus-stop'
  busStop.position.set(-2.8, 0, 0.4)

  // Curved concrete shelter canopy
  const shelterRoofGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.5, 14, 1, false, 0, Math.PI)
  shelterRoofGeo.rotateZ(Math.PI / 2)
  const shelterMat = new THREE.MeshStandardMaterial({ color: 0x98a09e, roughness: 0.85 })
  const shelterRoof = new THREE.Mesh(shelterRoofGeo, shelterMat)
  shelterRoof.position.set(0, 1.85, 0)
  shelterRoof.castShadow = true
  busStop.add(shelterRoof)

  // Back panel of bus stop
  const busBack = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.8, 0.08), shelterMat)
  busBack.position.set(0, 0.9, -0.4)
  busBack.castShadow = true
  busStop.add(busBack)

  // Wooden bench inside shelter
  const benchSlat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.32), darkWoodMat)
  benchSlat.position.set(0, 0.45, -0.15)
  benchSlat.castShadow = true
  busStop.add(benchSlat)

  // Blue bus pictogram post
  const signPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.1, 8), shelterMat)
  signPole.position.set(0.85, 1.05, 0.2)
  signPole.castShadow = true
  busStop.add(signPole)

  const busSignPlate = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.04), busBlueMat)
  busSignPlate.position.set(0.85, 2.0, 0.2)
  busStop.add(busSignPlate)

  root.add(busStop)

  // 4. Playground & Park (Praça) in mid-left
  const park = new THREE.Group()
  park.name = 'park-playground'
  park.position.set(-2.5, 0, -2.6)

  // A-frame timber swing set
  const swingA1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 8), woodMat)
  swingA1.position.set(-0.8, 1.1, -0.25)
  swingA1.rotation.z = -0.15
  swingA1.rotation.x = 0.2
  park.add(swingA1)

  const swingA2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 8), woodMat)
  swingA2.position.set(-0.8, 1.1, 0.25)
  swingA2.rotation.z = -0.15
  swingA2.rotation.x = -0.2
  park.add(swingA2)

  const swingB1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 8), woodMat)
  swingB1.position.set(0.8, 1.1, -0.25)
  swingB1.rotation.z = 0.15
  swingB1.rotation.x = 0.2
  park.add(swingB1)

  const swingB2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 8), woodMat)
  swingB2.position.set(0.8, 1.1, 0.25)
  swingB2.rotation.z = 0.15
  swingB2.rotation.x = -0.2
  park.add(swingB2)

  const topBar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 8), woodMat)
  topBar.rotateZ(Math.PI / 2)
  topBar.position.set(0, 2.1, 0)
  park.add(topBar)

  // Suspended swing seat
  const seatGeo = new THREE.BoxGeometry(0.28, 0.03, 0.14)
  const seat = new THREE.Mesh(seatGeo, darkWoodMat)
  seat.position.set(-0.25, 0.45, 0)
  park.add(seat)

  // Park Bench
  const parkBench = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.4, 0.3), woodMat)
  parkBench.position.set(1.2, 0.2, 0.6)
  park.add(parkBench)

  // Vintage decorative park lamppost
  const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 2.6, 8), shelterMat)
  lampPole.position.set(0.4, 1.3, 1.2)
  park.add(lampPole)

  const lampHead = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.25, 6), shelterMat)
  lampHead.position.set(0.4, 2.65, 1.2)
  park.add(lampHead)

  root.add(park)

  // 5. Schoolhouse (Escola do Bairro) in background
  const school = new THREE.Group()
  school.name = 'schoolhouse'
  school.position.set(-2.0, 0, -4.8)

  const schoolMat = new THREE.MeshStandardMaterial({ color: 0xf4eee2, roughness: 0.85 })
  const mainBuilding = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 1.6), schoolMat)
  mainBuilding.position.set(0, 1.1, 0)
  mainBuilding.castShadow = true
  school.add(mainBuilding)

  // Gable terracotta roof
  const roofGeo = new THREE.ConeGeometry(1.9, 1.1, 4)
  roofGeo.rotateY(Math.PI / 4)
  const roof = new THREE.Mesh(roofGeo, roofTileMat)
  roof.position.set(0, 2.75, 0)
  roof.scale.set(1.1, 0.9, 1.0)
  roof.castShadow = true
  school.add(roof)

  // Bell Tower
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.9, 0.65), schoolMat)
  tower.position.set(0, 3.45, 0)
  school.add(tower)

  const towerRoof = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.65, 4), roofTileMat)
  towerRoof.rotateY(Math.PI / 4)
  towerRoof.position.set(0, 4.15, 0)
  school.add(towerRoof)

  // Golden Bell in tower
  const schoolBell = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), brassMat)
  schoolBell.position.set(0, 3.45, 0)
  school.add(schoolBell)

  // "Escola" Wooden Sign above arched door
  const escolaSign = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.22, 0.04), woodMat)
  escolaSign.position.set(0, 1.75, 0.82)
  school.add(escolaSign)

  root.add(school)

  // 6. Fluffy Stylized Trees and Cottages
  const treeCoords: [number, number, number, number][] = [
    [-3.8, 1.8, -3.2, 0.9],
    [-4.5, 2.2, -5.5, 1.2],
    [3.2, 1.9, -4.5, 1.0],
    [4.2, 2.4, -6.5, 1.3],
    [1.8, 2.8, -7.5, 1.1]
  ]

  treeCoords.forEach(([tx, ty, tz, scale]) => {
    const tree = new THREE.Group()
    tree.position.set(tx, 0, tz)

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * scale, 0.16 * scale, ty, 8), darkWoodMat)
    trunk.position.y = ty / 2
    trunk.castShadow = true
    tree.add(trunk)

    // Clustered rounded fluffy foliage
    const foliage = new THREE.Group()
    foliage.position.y = ty
    const offsets = [
      [0, 0.2, 0, 0.85],
      [-0.25, 0, 0.1, 0.65],
      [0.25, 0, -0.1, 0.68],
      [0, 0.15, 0.25, 0.62]
    ]
    offsets.forEach(([ox, oy, oz, s]) => {
      const clump = new THREE.Mesh(new THREE.SphereGeometry(s * scale, 14, 10), foliageMat)
      clump.position.set(ox * scale, oy * scale, oz * scale)
      clump.castShadow = true
      foliage.add(clump)
    })
    tree.add(foliage)
    root.add(tree)
  })

  return root
}
