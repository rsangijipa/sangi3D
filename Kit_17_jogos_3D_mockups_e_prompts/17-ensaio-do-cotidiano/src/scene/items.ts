import * as THREE from 'three'
import { PRODUCTS } from '../game/content.ts'
import type { createMaterials } from './materials.ts'

export interface ShelfItemInstance {
  id: string
  group: THREE.Group
  pickable: THREE.Mesh
  basePosition: THREE.Vector3
  inCart: boolean
}

/**
 * Creates individual 3D product procedural representations
 */
export function createProductModel(id: string, mats: ReturnType<typeof createMaterials>): THREE.Group {
  const root = new THREE.Group()
  root.name = `product-model-${id}`

  switch (id) {
    case 'apple': {
      // Red Apple: lathed or squashed sphere with dimple top/bottom, brown stem, leaf
      const bodyGeo = new THREE.SphereGeometry(0.065, 16, 14)
      bodyGeo.scale(1, 0.92, 1)
      const appleMat = new THREE.MeshStandardMaterial({
        color: 0xba2419,
        roughness: 0.35,
        metalness: 0.05
      })
      const body = new THREE.Mesh(bodyGeo, appleMat)
      body.castShadow = true
      root.add(body)

      // Stem
      const stemGeo = new THREE.CylinderGeometry(0.003, 0.004, 0.035, 6)
      stemGeo.translate(0, 0.017, 0)
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.8 })
      const stem = new THREE.Mesh(stemGeo, stemMat)
      stem.position.set(0, 0.05, 0)
      stem.rotation.z = 0.25
      root.add(stem)

      // Leaf
      const leafGeo = new THREE.ConeGeometry(0.014, 0.03, 4)
      leafGeo.scale(1, 0.2, 1)
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x4e832d, roughness: 0.5 })
      const leaf = new THREE.Mesh(leafGeo, leafMat)
      leaf.position.set(0.01, 0.065, 0)
      leaf.rotation.set(0.4, 0.2, 0.8)
      root.add(leaf)
      break
    }

    case 'apple_green': {
      // Green Granny Smith Apple
      const bodyGeo = new THREE.SphereGeometry(0.064, 16, 14)
      bodyGeo.scale(1, 0.92, 1)
      const appleMat = new THREE.MeshStandardMaterial({
        color: 0x6bb32a,
        roughness: 0.38,
        metalness: 0.04
      })
      const body = new THREE.Mesh(bodyGeo, appleMat)
      body.castShadow = true
      root.add(body)

      const stemGeo = new THREE.CylinderGeometry(0.003, 0.004, 0.035, 6)
      stemGeo.translate(0, 0.017, 0)
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.8 })
      const stem = new THREE.Mesh(stemGeo, stemMat)
      stem.position.set(0, 0.05, 0)
      stem.rotation.z = -0.2
      root.add(stem)
      break
    }

    case 'banana': {
      // Bunch of Bananas: 3 curved crescent tubes
      const bunch = new THREE.Group()
      const bananaMat = new THREE.MeshStandardMaterial({
        color: 0xe5bf29,
        roughness: 0.45,
        metalness: 0.02
      })
      const tipMat = new THREE.MeshStandardMaterial({ color: 0x4e3e1d, roughness: 0.7 })

      for (let i = 0; i < 3; i++) {
        const angle = (i - 1) * 0.35
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.08, 0.01, 0),
          new THREE.Vector3(-0.03, -0.04, 0.015),
          new THREE.Vector3(0.04, -0.04, 0.015),
          new THREE.Vector3(0.09, 0.03, 0)
        ])
        const bGeo = new THREE.TubeGeometry(curve, 12, 0.018, 6, false)
        const bMesh = new THREE.Mesh(bGeo, bananaMat)
        bMesh.rotation.y = angle
        bMesh.rotation.z = (i - 1) * 0.15
        bMesh.castShadow = true
        bunch.add(bMesh)
      }

      // Stem join
      const joinGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.035, 6)
      const join = new THREE.Mesh(joinGeo, tipMat)
      join.position.set(-0.085, 0.02, 0)
      join.rotation.z = 0.5
      bunch.add(join)

      bunch.scale.set(0.9, 0.9, 0.9)
      root.add(bunch)
      break
    }

    case 'orange': {
      // Wooden crate with 3 oranges
      const crateGeo = new THREE.BoxGeometry(0.22, 0.07, 0.16)
      const crate = new THREE.Mesh(crateGeo, mats.woodMat)
      crate.position.y = 0.035
      crate.castShadow = true
      root.add(crate)

      const orangeMat = new THREE.MeshStandardMaterial({
        color: 0xee7314,
        roughness: 0.6,
        metalness: 0.02
      })
      const oGeo = new THREE.SphereGeometry(0.045, 12, 10)

      const offsets = [
        [-0.05, 0.07, -0.02],
        [0.05, 0.07, -0.02],
        [0, 0.07, 0.035]
      ]
      offsets.forEach(([ox, oy, oz]) => {
        const orange = new THREE.Mesh(oGeo, orangeMat)
        orange.position.set(ox, oy, oz)
        orange.castShadow = true
        root.add(orange)
      })
      break
    }

    case 'rice': {
      // Kraft paper bag of rice with rolled sewn top
      const bagGeo = new THREE.BoxGeometry(0.12, 0.18, 0.09)
      const bagMat = mats.kraftPaperMat
      const bag = new THREE.Mesh(bagGeo, bagMat)
      bag.position.y = 0.09
      bag.castShadow = true
      root.add(bag)

      // Rolled stitched top
      const topGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.13, 8)
      topGeo.rotateZ(Math.PI / 2)
      const topMat = new THREE.MeshStandardMaterial({ color: 0x9e6c38, roughness: 0.8 })
      const top = new THREE.Mesh(topGeo, topMat)
      top.position.set(0, 0.18, 0)
      root.add(top)

      // Front stamp label
      const labelGeo = new THREE.PlaneGeometry(0.08, 0.07)
      const labelMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })
      const label = new THREE.Mesh(labelGeo, labelMat)
      label.position.set(0, 0.09, 0.046)
      root.add(label)
      break
    }

    case 'beans': {
      // Glass mason jar with black beans
      const jarGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.14, 16)
      const jar = new THREE.Mesh(jarGeo, mats.glassMat)
      jar.position.y = 0.07
      jar.castShadow = true
      root.add(jar)

      // Internal beans mass
      const beansGeo = new THREE.CylinderGeometry(0.046, 0.046, 0.11, 14)
      const beansMat = new THREE.MeshStandardMaterial({ color: 0x241d1a, roughness: 0.6 })
      const beans = new THREE.Mesh(beansGeo, beansMat)
      beans.position.y = 0.058
      root.add(beans)

      // Tin / brass lid
      const lidGeo = new THREE.CylinderGeometry(0.052, 0.052, 0.018, 16)
      const lid = new THREE.Mesh(lidGeo, mats.brassMat)
      lid.position.y = 0.145
      root.add(lid)
      break
    }

    case 'bread': {
      // Rustic sourdough bread loaf with scored slits
      const loafGeo = new THREE.SphereGeometry(0.09, 14, 10)
      loafGeo.scale(1.4, 0.7, 0.9)
      const breadMat = new THREE.MeshStandardMaterial({
        color: 0xab6932,
        roughness: 0.75,
        metalness: 0.02
      })
      const loaf = new THREE.Mesh(loafGeo, breadMat)
      loaf.position.y = 0.05
      loaf.castShadow = true
      root.add(loaf)

      // Flour dusted score
      const scoreGeo = new THREE.BoxGeometry(0.18, 0.01, 0.03)
      const scoreMat = new THREE.MeshStandardMaterial({ color: 0xf5eedb, roughness: 0.9 })
      const score = new THREE.Mesh(scoreGeo, scoreMat)
      score.position.set(0, 0.098, 0)
      score.rotation.y = 0.2
      root.add(score)
      break
    }

    case 'milk': {
      // Traditional glass milk bottle with blue cap
      const bottleGeo = new THREE.CylinderGeometry(0.04, 0.045, 0.18, 16)
      const bottle = new THREE.Mesh(bottleGeo, mats.glassMat)
      bottle.position.y = 0.09
      bottle.castShadow = true
      root.add(bottle)

      // White milk core
      const milkGeo = new THREE.CylinderGeometry(0.037, 0.042, 0.15, 14)
      const milkMat = new THREE.MeshStandardMaterial({ color: 0xfaf8f4, roughness: 0.25 })
      const milk = new THREE.Mesh(milkGeo, milkMat)
      milk.position.y = 0.076
      root.add(milk)

      // Blue metal cap
      const capGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.016, 12)
      const capMat = new THREE.MeshStandardMaterial({ color: 0x2255aa, roughness: 0.4 })
      const cap = new THREE.Mesh(capGeo, capMat)
      cap.position.y = 0.188
      root.add(cap)
      break
    }

    case 'soap': {
      // Artisan olive bar soap with paper band wrap
      const barGeo = new THREE.BoxGeometry(0.11, 0.04, 0.07)
      const barMat = new THREE.MeshStandardMaterial({
        color: 0x88986c,
        roughness: 0.55,
        metalness: 0.05
      })
      const bar = new THREE.Mesh(barGeo, barMat)
      bar.position.y = 0.02
      bar.castShadow = true
      root.add(bar)

      // Paper band
      const bandGeo = new THREE.BoxGeometry(0.045, 0.042, 0.072)
      const band = new THREE.Mesh(bandGeo, mats.kraftPaperMat)
      band.position.y = 0.02
      root.add(band)
      break
    }

    case 'soap_liquid': {
      // Amber liquid soap pump bottle
      const bodyGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.13, 14)
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xbfd3b8,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85
      })
      const body = new THREE.Mesh(bodyGeo, bodyMat)
      body.position.y = 0.065
      body.castShadow = true
      root.add(body)

      // Pump nozzle
      const pumpGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.035, 8)
      const pumpMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4 })
      const pump = new THREE.Mesh(pumpGeo, pumpMat)
      pump.position.y = 0.145
      root.add(pump)

      const spoutGeo = new THREE.BoxGeometry(0.04, 0.01, 0.012)
      const spout = new THREE.Mesh(spoutGeo, pumpMat)
      spout.position.set(0.018, 0.158, 0)
      root.add(spout)
      break
    }

    case 'book_history': {
      // Blue hardcover study book
      const bookGeo = new THREE.BoxGeometry(0.14, 0.035, 0.19)
      const coverMat = new THREE.MeshStandardMaterial({
        color: 0x27435f,
        roughness: 0.5,
        metalness: 0.05
      })
      const book = new THREE.Mesh(bookGeo, coverMat)
      book.position.y = 0.018
      book.castShadow = true
      root.add(book)

      // Pages core
      const pagesGeo = new THREE.BoxGeometry(0.13, 0.027, 0.18)
      const pagesMat = new THREE.MeshStandardMaterial({ color: 0xf5f1e4, roughness: 0.85 })
      const pages = new THREE.Mesh(pagesGeo, pagesMat)
      pages.position.set(0.005, 0.018, 0)
      root.add(pages)
      break
    }

    case 'notebook': {
      // Kraft paper spiral notebook
      const nbGeo = new THREE.BoxGeometry(0.13, 0.02, 0.17)
      const nb = new THREE.Mesh(nbGeo, mats.kraftPaperMat)
      nb.position.y = 0.01
      nb.castShadow = true
      root.add(nb)

      // Wire spiral on left
      const wireGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.16, 8)
      wireGeo.rotateX(Math.PI / 2)
      const wire = new THREE.Mesh(wireGeo, mats.greenMetalMat)
      wire.position.set(-0.065, 0.01, 0)
      root.add(wire)
      break
    }

    case 'pencil': {
      // Fabric pencil case with wooden pencils
      const caseGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.18, 10)
      caseGeo.rotateZ(Math.PI / 2)
      const caseMat = new THREE.MeshStandardMaterial({
        color: 0xd89f38,
        roughness: 0.7,
        metalness: 0.02
      })
      const pCase = new THREE.Mesh(caseGeo, caseMat)
      pCase.position.y = 0.032
      pCase.castShadow = true
      root.add(pCase)

      // Zipper metal track
      const zipGeo = new THREE.BoxGeometry(0.17, 0.006, 0.006)
      const zip = new THREE.Mesh(zipGeo, mats.brassMat)
      zip.position.set(0, 0.062, 0)
      root.add(zip)
      break
    }

    case 'water_bottle': {
      // Powder-coated olive metal reusable water bottle
      const flaskGeo = new THREE.CylinderGeometry(0.036, 0.036, 0.19, 16)
      const flaskMat = new THREE.MeshStandardMaterial({
        color: 0x3d6653,
        roughness: 0.4,
        metalness: 0.3
      })
      const flask = new THREE.Mesh(flaskGeo, flaskMat)
      flask.position.y = 0.095
      flask.castShadow = true
      root.add(flask)

      // Bamboo cap with steel loop
      const capGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.025, 12)
      const cap = new THREE.Mesh(capGeo, mats.woodMat)
      cap.position.y = 0.205
      root.add(cap)

      const loopGeo = new THREE.TorusGeometry(0.014, 0.003, 8, 16)
      const loop = new THREE.Mesh(loopGeo, mats.brassMat)
      loop.position.set(0, 0.225, 0)
      loop.rotation.x = Math.PI / 2
      root.add(loop)
      break
    }

    default: {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.1, 0.1),
        new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
      )
      box.position.y = 0.05
      root.add(box)
      break
    }
  }

  return root
}

/**
 * Spawns all shelf items in the market and sets up raycasting target hitboxes
 */
export function populateMarketItems(
  scene: THREE.Scene,
  mats: ReturnType<typeof createMaterials>
): {
  instances: Record<string, ShelfItemInstance>
  pickables: THREE.Mesh[]
} {
  const instances: Record<string, ShelfItemInstance> = {}
  const pickables: THREE.Mesh[] = []

  const group = new THREE.Group()
  group.name = 'shelf-items-group'
  scene.add(group)

  for (const [id, item] of Object.entries(PRODUCTS)) {
    const itemGroup = new THREE.Group()
    itemGroup.name = `item-shelf-${id}`
    itemGroup.position.set(item.position[0], item.position[1], item.position[2])

    // Visual model
    const model = createProductModel(id, mats)
    itemGroup.add(model)

    // Invisible / subtle raycast pickable hitbox
    const hitGeo = new THREE.BoxGeometry(0.24, 0.26, 0.24)
    const hitMat = new THREE.MeshBasicMaterial({
      color: 0x55aa66,
      transparent: true,
      opacity: 0,
      depthWrite: false
    })
    const hitMesh = new THREE.Mesh(hitGeo, hitMat)
    hitMesh.position.y = 0.08
    hitMesh.name = `pickable-${id}`
    hitMesh.userData = {
      productId: id,
      name: item.name,
      category: item.category,
      waypoint: item.waypoint
    }
    itemGroup.add(hitMesh)
    pickables.push(hitMesh)

    // Little wooden tag pedestal / price tag
    const tagGeo = new THREE.BoxGeometry(0.08, 0.02, 0.04)
    const tag = new THREE.Mesh(tagGeo, mats.kraftPaperMat)
    tag.position.set(0, -0.01, 0.12)
    tag.rotation.x = -0.3
    itemGroup.add(tag)

    group.add(itemGroup)

    instances[id] = {
      id,
      group: itemGroup,
      pickable: hitMesh,
      basePosition: itemGroup.position.clone(),
      inCart: false
    }
  }

  return { instances, pickables }
}
