import * as THREE from 'three'
import type { createMaterials } from './materials.ts'
import { createProductModel } from './items.ts'

export class ShoppingCartView {
  public root: THREE.Group
  private cartGroup: THREE.Group
  private basketGroup: THREE.Group
  private wheels: THREE.Mesh[] = []
  private itemsContainer: THREE.Group
  private mats: ReturnType<typeof createMaterials>
  private currentCarrier: 'cart' | 'basket' = 'cart'

  constructor(mats: ReturnType<typeof createMaterials>) {
    this.mats = mats
    this.root = new THREE.Group()
    this.root.name = 'player-carrier'

    this.cartGroup = this.buildCartMesh()
    this.basketGroup = this.buildBasketMesh()
    this.itemsContainer = new THREE.Group()
    this.itemsContainer.name = 'carrier-items-container'

    this.root.add(this.cartGroup)
    this.root.add(this.basketGroup)
    this.root.add(this.itemsContainer)

    this.setCarrier('cart')
  }

  private buildCartMesh(): THREE.Group {
    const group = new THREE.Group()
    group.name = 'metal-shopping-cart'

    const { greenMetalMat, brassMat, darkWoodMat } = this.mats

    // 1. Lower tubular chassis frame (X: 0.52m, Z: 0.65m)
    const chassisGeo = new THREE.BoxGeometry(0.5, 0.03, 0.62)
    const chassis = new THREE.Mesh(chassisGeo, greenMetalMat)
    chassis.position.y = 0.18
    chassis.castShadow = true
    group.add(chassis)

    // Lower tray wire rack
    const rackGeo = new THREE.PlaneGeometry(0.44, 0.54)
    const rack = new THREE.Mesh(rackGeo, greenMetalMat)
    rack.rotation.x = -Math.PI / 2
    rack.position.y = 0.2
    group.add(rack)

    // 2. 4 Caster Wheels with rubber tires
    const wheelPositions: [number, number, number][] = [
      [-0.22, 0.08, 0.24],
      [0.22, 0.08, 0.24],
      [-0.22, 0.08, -0.24],
      [0.22, 0.08, -0.24]
    ]

    const tireGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.024, 16)
    tireGeo.rotateZ(Math.PI / 2)
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.85 })

    wheelPositions.forEach(([wx, wy, wz]) => {
      const forkGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.09, 8)
      const fork = new THREE.Mesh(forkGeo, brassMat)
      fork.position.set(wx, wy + 0.04, wz)
      group.add(fork)

      const wheel = new THREE.Mesh(tireGeo, tireMat)
      wheel.position.set(wx, wy, wz)
      wheel.castShadow = true
      group.add(wheel)
      this.wheels.push(wheel)
    })

    // 3. Basket Wireframe Box (slanted front)
    // Wireframe basket rim and bottom
    const basketBottomGeo = new THREE.BoxGeometry(0.48, 0.02, 0.58)
    const basketBottom = new THREE.Mesh(basketBottomGeo, greenMetalMat)
    basketBottom.position.y = 0.52
    group.add(basketBottom)

    // Basket walls (composed of green metal slats and wire look)
    // Left & Right walls
    const sideGeo = new THREE.BoxGeometry(0.015, 0.38, 0.58)
    const leftSide = new THREE.Mesh(sideGeo, greenMetalMat)
    leftSide.position.set(-0.24, 0.7, 0)
    leftSide.castShadow = true
    group.add(leftSide)

    const rightSide = new THREE.Mesh(sideGeo, greenMetalMat)
    rightSide.position.set(0.24, 0.7, 0)
    rightSide.castShadow = true
    group.add(rightSide)

    // Front & Back walls
    const frontGeo = new THREE.BoxGeometry(0.48, 0.34, 0.015)
    const frontWall = new THREE.Mesh(frontGeo, greenMetalMat)
    frontWall.position.set(0, 0.68, -0.29)
    frontWall.castShadow = true
    group.add(frontWall)

    const backGeo = new THREE.BoxGeometry(0.48, 0.42, 0.015)
    const backWall = new THREE.Mesh(backGeo, greenMetalMat)
    backWall.position.set(0, 0.72, 0.29)
    backWall.castShadow = true
    group.add(backWall)

    // Top Rim Tubing
    const rimGeo = new THREE.BoxGeometry(0.51, 0.02, 0.61)
    const rim = new THREE.Mesh(rimGeo, greenMetalMat)
    rim.position.y = 0.89
    group.add(rim)

    // Upright support legs connecting chassis to basket
    const legGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.36, 8)
    const legCoords: [number, number, number][] = [
      [-0.22, 0.35, 0.22],
      [0.22, 0.35, 0.22],
      [-0.22, 0.35, -0.2],
      [0.22, 0.35, -0.2]
    ]
    legCoords.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, greenMetalMat)
      leg.position.set(lx, ly, lz)
      group.add(leg)
    })

    // 4. Handle bar with wood grip
    const handleUprightGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.22, 8)
    handleUprightGeo.rotateX(0.4)
    const handleLeft = new THREE.Mesh(handleUprightGeo, greenMetalMat)
    handleLeft.position.set(-0.24, 0.98, 0.38)
    group.add(handleLeft)

    const handleRight = new THREE.Mesh(handleUprightGeo, greenMetalMat)
    handleRight.position.set(0.24, 0.98, 0.38)
    group.add(handleRight)

    // Wooden Grip Bar
    const gripGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.52, 12)
    gripGeo.rotateZ(Math.PI / 2)
    const grip = new THREE.Mesh(gripGeo, darkWoodMat)
    grip.position.set(0, 1.05, 0.44)
    grip.castShadow = true
    group.add(grip)

    return group
  }

  private buildBasketMesh(): THREE.Group {
    const group = new THREE.Group()
    group.name = 'wicker-shopping-basket'

    const { kraftPaperMat, darkWoodMat, brassMat } = this.mats

    // Wicker basket body (oval / box with chamfered edges)
    const basketGeo = new THREE.BoxGeometry(0.46, 0.26, 0.34)
    const basket = new THREE.Mesh(basketGeo, kraftPaperMat)
    basket.position.y = 0.55
    basket.castShadow = true
    group.add(basket)

    // Inner rim
    const rimGeo = new THREE.BoxGeometry(0.48, 0.03, 0.36)
    const rim = new THREE.Mesh(rimGeo, darkWoodMat)
    rim.position.y = 0.68
    group.add(rim)

    // Curved handle over top
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.22, 0.68, 0),
      new THREE.Vector3(-0.16, 0.92, 0),
      new THREE.Vector3(0, 0.96, 0),
      new THREE.Vector3(0.16, 0.92, 0),
      new THREE.Vector3(0.22, 0.68, 0)
    ])
    const handleGeo = new THREE.TubeGeometry(handleCurve, 16, 0.014, 8, false)
    const handle = new THREE.Mesh(handleGeo, darkWoodMat)
    handle.castShadow = true
    group.add(handle)

    // Brass hinges / rivets
    const rivetGeo = new THREE.SphereGeometry(0.012, 8, 8)
    const rivetL = new THREE.Mesh(rivetGeo, brassMat)
    rivetL.position.set(-0.22, 0.68, 0)
    group.add(rivetL)

    const rivetR = new THREE.Mesh(rivetGeo, brassMat)
    rivetR.position.set(0.22, 0.68, 0)
    group.add(rivetR)

    return group
  }

  public setCarrier(carrier: 'cart' | 'basket') {
    this.currentCarrier = carrier
    if (carrier === 'cart') {
      this.cartGroup.visible = true
      this.basketGroup.visible = false
      this.itemsContainer.position.set(0, 0.56, 0)
    } else {
      this.cartGroup.visible = false
      this.basketGroup.visible = true
      this.itemsContainer.position.set(0, 0.44, 0)
    }
  }

  public spinWheels(deltaDistance: number) {
    if (this.currentCarrier !== 'cart') return
    const angle = deltaDistance * 12
    this.wheels.forEach(w => {
      w.rotation.x += angle
    })
  }

  public updateItems(itemIds: string[]) {
    // Clear existing item meshes
    while (this.itemsContainer.children.length > 0) {
      const child = this.itemsContainer.children[0]
      this.itemsContainer.remove(child)
    }

    // Grid slots inside the basket
    // Up to 6 slots (2 columns x 3 rows)
    const slotOffsets: [number, number, number][] = [
      [-0.12, 0.03, -0.14],
      [0.12, 0.03, -0.14],
      [-0.12, 0.03, 0.0],
      [0.12, 0.03, 0.0],
      [-0.12, 0.03, 0.14],
      [0.12, 0.03, 0.14],
      // Upper tier if > 6
      [-0.08, 0.14, -0.08],
      [0.08, 0.14, 0.08]
    ]

    itemIds.forEach((id, idx) => {
      const slot = slotOffsets[idx % slotOffsets.length]
      const model = createProductModel(id, this.mats)
      model.scale.set(0.85, 0.85, 0.85)
      model.position.set(slot[0], slot[1], slot[2])
      model.rotation.y = (idx * 0.4) % Math.PI
      this.itemsContainer.add(model)
    })
  }
}
