import * as THREE from 'three'
import type { MobileSceneState, WeightType, SubBeamType } from '../game/state.ts'
import { calculatePhysics } from '../game/rules.ts'
import type { createMaterials } from './materials.ts'

export function buildMobile(materials: ReturnType<typeof createMaterials>) {
  const root = new THREE.Group()
  root.name = 'kinetic-mobile-root'

  const {
    stoneMat,
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
  } = materials

  // ----------------------------------------------------
  // 1. Heavy Stone Base Block & Arched Cantilever Crane Arm
  // ----------------------------------------------------
  const baseGroup = new THREE.Group()
  baseGroup.position.set(-1.65, 0, 0)

  // Carved stone pedestal base
  const stoneBase = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.36, 0.48), stoneMat)
  stoneBase.position.set(0, 0.18, 0)
  stoneBase.castShadow = true
  stoneBase.receiveShadow = true
  baseGroup.add(stoneBase)

  // Brass mounting flange with bolts
  const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.05, 16), brassMat)
  flange.position.set(0, 0.38, 0)
  baseGroup.add(flange)

  // Vertical brass mast
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 1.35, 24), brassMat)
  mast.position.set(0, 1.05, 0)
  mast.castShadow = true
  baseGroup.add(mast)

  // Dynamometer housing mounted on vertical mast
  const dynGroup = new THREE.Group()
  dynGroup.name = 'dynamometer-visual'
  dynGroup.position.set(0.11, 0.95, 0)

  // Dynamometer frame tube
  const dynTube = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.48, 16), darkBrassMat)
  dynGroup.add(dynTube)

  // Glass scale window
  const dynGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.042, 0.042, 0.42, 16),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7
    })
  )
  dynGroup.add(dynGlass)

  // Internal red float indicator needle
  const dynNeedle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.038, 0.038, 0.03, 16),
    new THREE.MeshStandardMaterial({ color: 0xcc2810, roughness: 0.3 })
  )
  dynNeedle.position.set(0, 0.15, 0)
  dynGroup.add(dynNeedle)

  // Scale Plate with numbers: 0, 5, 10, 15, 20 N
  const scaleCanvas = document.createElement('canvas')
  scaleCanvas.width = 128
  scaleCanvas.height = 512
  const sctx = scaleCanvas.getContext('2d')!
  sctx.fillStyle = '#E8E2D6'
  sctx.fillRect(0, 0, 128, 512)
  sctx.strokeStyle = '#221E1A'
  sctx.fillStyle = '#221E1A'
  sctx.font = 'bold 36px serif'
  sctx.textAlign = 'center'
  sctx.fillText('N', 64, 45)
  const ticks = [0, 5, 10, 15, 20]
  ticks.forEach((val, i) => {
    const y = 470 - (i / (ticks.length - 1)) * 390
    sctx.lineWidth = 4
    sctx.beginPath()
    sctx.moveTo(10, y)
    sctx.lineTo(45, y)
    sctx.stroke()
    sctx.font = '28px sans-serif'
    sctx.fillText(String(val), 80, y + 10)
  })
  const scaleTex = new THREE.CanvasTexture(scaleCanvas)
  const scaleMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.42), new THREE.MeshBasicMaterial({ map: scaleTex }))
  scaleMesh.position.set(0.045, 0, 0.02)
  scaleMesh.rotation.y = Math.PI / 2
  dynGroup.add(scaleMesh)

  baseGroup.add(dynGroup)

  // Arched Cantilever Crane Arm (curving up and towards center X=0, Y=2.3)
  const craneCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, 1.72, 0),
    new THREE.Vector3(0, 2.32, 0),
    new THREE.Vector3(1.1, 2.34, 0),
    new THREE.Vector3(1.65, 2.28, 0)
  )
  const craneGeo = new THREE.TubeGeometry(craneCurve, 32, 0.045, 16, false)
  const craneArm = new THREE.Mesh(craneGeo, brassMat)
  craneArm.castShadow = true
  baseGroup.add(craneArm)

  // Circular cutouts along the crane arm for authentic steampunk / neoclassical aesthetic
  for (let i = 1; i <= 4; i++) {
    const t = i / 5
    const pt = craneCurve.getPoint(t)
    const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(0.035 + i * 0.008, 0.008, 12, 24), darkBrassMat)
    ringMesh.position.copy(pt)
    ringMesh.rotation.y = Math.PI / 2
    baseGroup.add(ringMesh)
  }

  // End cap & swivel suspension joint at X=1.65 (which is X=0 in world coords)
  const swivelCap = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), brassMat)
  swivelCap.position.set(1.65, 2.28, 0)
  baseGroup.add(swivelCap)

  root.add(baseGroup)

  // ----------------------------------------------------
  // 2. Central Pivot Joint & Suspension Rod
  // ----------------------------------------------------
  // Suspension rod drops from crane tip (Y=2.28) to main beam pivot (Y=1.75)
  const suspRodGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.46, 12)
  const suspRod = new THREE.Mesh(suspRodGeo, brassMat)
  suspRod.position.set(0, 2.02, 0)
  root.add(suspRod)

  const suspRing = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.01, 16, 24), brassMat)
  suspRing.position.set(0, 1.78, 0)
  root.add(suspRing)

  // ----------------------------------------------------
  // 3. Main Balance Beam System
  // ----------------------------------------------------
  // Beam pivot is at (0, 1.75, 0)
  const beamSystem = new THREE.Group()
  beamSystem.position.set(0, 1.75, 0)
  beamSystem.name = 'main-beam-system'

  // The beam pivot rotates around Z axis
  const beamPivot = new THREE.Group()
  beamPivot.name = 'beam-pivot'
  beamSystem.add(beamPivot)

  // Main beam bar: Length 1.25m, Height 0.07m, Depth 0.018m
  const beamMesh = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.07, 0.018), brassMat)
  beamMesh.castShadow = true
  beamPivot.add(beamMesh)

  // Rounded end caps
  const endCapGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.018, 16)
  const leftCap = new THREE.Mesh(endCapGeo, brassMat)
  leftCap.rotation.x = Math.PI / 2
  leftCap.position.set(-0.625, 0, 0)
  beamPivot.add(leftCap)
  const rightCap = new THREE.Mesh(endCapGeo, brassMat)
  rightCap.rotation.x = Math.PI / 2
  rightCap.position.set(0.625, 0, 0)
  beamPivot.add(rightCap)

  // Holes along the beam at cm slots [-40 to +40]
  // 1 cm = 0.01m
  const holeSlots = [-40, -35, -30, -25, -20, -15, -10, -5, 5, 10, 15, 20, 25, 30, 35, 40]
  const holesGroup = new THREE.Group()
  holesGroup.name = 'beam-holes'

  const holeRings: THREE.Mesh[] = []
  holeSlots.forEach(slot => {
    const x = slot * 0.01
    // Visual dark hole insert
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.02, 16), darkBrassMat)
    hole.rotation.x = Math.PI / 2
    hole.position.set(x, 0, 0)
    hole.userData = { type: 'hole', slot }
    holesGroup.add(hole)
    holeRings.push(hole)
  })
  beamPivot.add(holesGroup)

  // Ruler numbers graduation strip on front face of the beam
  const rulerCanvas = document.createElement('canvas')
  rulerCanvas.width = 1024
  rulerCanvas.height = 64
  const rctx = rulerCanvas.getContext('2d')!
  rctx.fillStyle = '#B59550'
  rctx.fillRect(0, 0, 1024, 64)
  rctx.fillStyle = '#22190B'
  rctx.strokeStyle = '#22190B'
  rctx.font = 'bold 22px sans-serif'
  rctx.textAlign = 'center'

  // Graduations: 40, 30, 20, 10 on both sides
  ;[-40, -30, -20, -10, 10, 20, 30, 40].forEach(slot => {
    // x in canvas: center is 512, slot 40 is at x = 0.40m on 1.25m bar => 512 + (slot/50)*450
    const cx = 512 + (slot / 50) * 440
    rctx.fillText(String(Math.abs(slot)), cx, 40)
    rctx.lineWidth = 2
    rctx.beginPath()
    rctx.moveTo(cx, 0)
    rctx.lineTo(cx, 15)
    rctx.stroke()
  })
  const rulerTex = new THREE.CanvasTexture(rulerCanvas)
  const rulerMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.22, 0.065), new THREE.MeshBasicMaterial({ map: rulerTex, transparent: true }))
  rulerMesh.position.set(0, 0, 0.01)
  beamPivot.add(rulerMesh)

  // Fulcrum Carriage Box (slides along the beam)
  const fulcrumGroup = new THREE.Group()
  fulcrumGroup.name = 'fulcrum-carriage'
  const fulcrumBox = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.1, 0.045), brassMat)
  fulcrumBox.castShadow = true
  fulcrumGroup.add(fulcrumBox)

  // Central pivot pin
  const fulcrumPin = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.05, 16), darkBrassMat)
  fulcrumPin.rotation.x = Math.PI / 2
  fulcrumGroup.add(fulcrumPin)

  // Glow selection bracket with cyan arrows < >
  const glowBracket = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.115, 0.052), glowMat)
  glowBracket.name = 'fulcrum-glow'
  glowBracket.visible = true
  fulcrumGroup.add(glowBracket)

  beamPivot.add(fulcrumGroup)

  // Angle indicator HUD in 3D: Dashed line and degree label
  const angleGroup = new THREE.Group()
  angleGroup.name = 'angle-indicator-3d'
  angleGroup.position.set(0.65, 0, 0.04)

  // Horizontal dashed reference line
  const dashCanvas = document.createElement('canvas')
  dashCanvas.width = 128
  dashCanvas.height = 16
  const dctx = dashCanvas.getContext('2d')!
  dctx.strokeStyle = '#FFFFFF'
  dctx.lineWidth = 3
  dctx.setLineDash([8, 6])
  dctx.beginPath()
  dctx.moveTo(0, 8)
  dctx.lineTo(128, 8)
  dctx.stroke()
  const dashTex = new THREE.CanvasTexture(dashCanvas)
  const dashMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.02), new THREE.MeshBasicMaterial({ map: dashTex, transparent: true, opacity: 0.9 }))
  angleGroup.add(dashMesh)

  // Dynamic Angle Text Label
  const angleCanvas = document.createElement('canvas')
  angleCanvas.width = 128
  angleCanvas.height = 64
  const actx = angleCanvas.getContext('2d')!
  const angleTex = new THREE.CanvasTexture(angleCanvas)
  const angleLabel = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.08), new THREE.MeshBasicMaterial({ map: angleTex, transparent: true }))
  angleLabel.position.set(0.14, 0.04, 0)
  angleGroup.add(angleLabel)

  beamSystem.add(angleGroup)
  root.add(beamSystem)

  // Container for dynamic items (weights & sub-beams)
  const dynamicItemsGroup = new THREE.Group()
  dynamicItemsGroup.name = 'dynamic-items'
  beamPivot.add(dynamicItemsGroup)

  // Helper function to update the angle text canvas
  function updateAngleLabel(angle: number) {
    actx.clearRect(0, 0, 128, 64)
    actx.fillStyle = 'rgba(240, 240, 235, 0.95)'
    actx.font = 'bold 36px serif'
    actx.textAlign = 'left'
    actx.fillText(`${angle.toFixed(1).replace('.', ',')}°`, 5, 44)
    angleTex.needsUpdate = true
  }

  // ----------------------------------------------------
  // 4. Weight Mesh Generators
  // ----------------------------------------------------
  function createWeightMesh(type: WeightType): THREE.Group {
    const group = new THREE.Group()

    // Suspension loop / ring on top
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.004, 12, 24), brassMat)
    ring.position.set(0, 0.04, 0)
    group.add(ring)

    switch (type) {
      case 'terracotta': {
        // Handcrafted terracotta vase with wave relief
        // Profile points for LatheGeometry
        const pts: THREE.Vector2[] = [
          new THREE.Vector2(0.02, 0.02),
          new THREE.Vector2(0.04, 0.01),
          new THREE.Vector2(0.08, -0.05),
          new THREE.Vector2(0.12, -0.14),
          new THREE.Vector2(0.13, -0.22),
          new THREE.Vector2(0.11, -0.28),
          new THREE.Vector2(0.06, -0.32),
          new THREE.Vector2(0, -0.33)
        ]
        const vase = new THREE.Mesh(new THREE.LatheGeometry(pts, 32), terracottaMat)
        vase.castShadow = true
        group.add(vase)

        // Brass neck collar
        const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.042, 0.03, 24), brassMat)
        collar.position.set(0, 0.01, 0)
        group.add(collar)
        break
      }
      case 'fluted': {
        // Ribbed green ceramic sphere
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.085, 32, 24), sageMat)
        sphere.position.set(0, -0.09, 0)
        sphere.castShadow = true
        group.add(sphere)

        // 12 vertical rib toruses for caneluras
        for (let i = 0; i < 6; i++) {
          const rib = new THREE.Mesh(new THREE.TorusGeometry(0.086, 0.003, 8, 32), sageMat)
          rib.position.set(0, -0.09, 0)
          rib.rotation.y = (i * Math.PI) / 6
          group.add(rib)
        }
        // Top brass mount
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.02, 16), brassMat)
        cap.position.set(0, 0.005, 0)
        group.add(cap)
        break
      }
      case 'glass': {
        // Translucent liquid/crystal sphere
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.08, 32, 24), glassMat)
        sphere.position.set(0, -0.08, 0)
        sphere.castShadow = true
        group.add(sphere)

        // Internal water meniscus disk
        const liquid = new THREE.Mesh(
          new THREE.CylinderGeometry(0.076, 0.076, 0.06, 24),
          new THREE.MeshStandardMaterial({
            color: 0x9be8e0,
            transparent: true,
            opacity: 0.6,
            roughness: 0.1
          })
        )
        liquid.position.set(0, -0.095, 0)
        group.add(liquid)

        // Top brass ring mount
        const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.025, 0.02, 16), brassMat)
        mount.position.set(0, 0.01, 0)
        group.add(mount)
        break
      }
      case 'ring': {
        // Travertine stone donut ring
        const torus = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.024, 20, 36), ringStoneMat)
        torus.position.set(0, -0.07, 0)
        torus.castShadow = true
        group.add(torus)

        // Brass shackle at top
        const shackle = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.035, 12), brassMat)
        shackle.position.set(0, 0.015, 0)
        group.add(shackle)
        break
      }
      case 'crackle': {
        // Inverted celadon crackle glazed bowl/dome
        const dome = new THREE.Mesh(new THREE.SphereGeometry(0.085, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), crackleMat)
        dome.rotation.x = Math.PI
        dome.position.set(0, -0.02, 0)
        dome.castShadow = true
        group.add(dome)

        // Terracotta base rim
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.084, 0.008, 12, 32), terracottaMat)
        rim.rotation.x = Math.PI / 2
        rim.position.set(0, -0.105, 0)
        group.add(rim)
        break
      }
      case 'cylinder': {
        // Calibrated turned brass cylinder
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.14, 24), brassMat)
        cyl.position.set(0, -0.07, 0)
        cyl.castShadow = true
        group.add(cyl)

        // Bevel rims
        const rim1 = new THREE.Mesh(new THREE.TorusGeometry(0.044, 0.004, 12, 24), darkBrassMat)
        rim1.rotation.x = Math.PI / 2
        rim1.position.set(0, -0.002, 0)
        group.add(rim1)
        const rim2 = new THREE.Mesh(new THREE.TorusGeometry(0.044, 0.004, 12, 24), darkBrassMat)
        rim2.rotation.x = Math.PI / 2
        rim2.position.set(0, -0.138, 0)
        group.add(rim2)
        break
      }
    }
    return group
  }

  // ----------------------------------------------------
  // 5. Sub-Beam Mesh Generator (Nested Levels)
  // ----------------------------------------------------
  function createSubBeamMesh(type: SubBeamType): THREE.Group {
    const group = new THREE.Group()

    if (type === 'brass') {
      // Perforated mini brass beam (length 0.36m, height 0.035m)
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.032, 0.012), brassMat)
      bar.castShadow = true
      group.add(bar)

      // Holes along mini beam
      for (let x = -0.15; x <= 0.15; x += 0.05) {
        const h = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.014, 12), darkBrassMat)
        h.rotation.x = Math.PI / 2
        h.position.set(x, 0, 0)
        group.add(h)
      }
    } else {
      // Carved wooden mini beam (length 0.40m, height 0.038m)
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.036, 0.015), woodMat)
      bar.castShadow = true
      group.add(bar)

      // Brass attachment hooks
      const hook1 = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.025, 8), brassMat)
      hook1.position.set(-0.16, -0.02, 0)
      group.add(hook1)
      const hook2 = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.025, 8), brassMat)
      hook2.position.set(0.16, -0.02, 0)
      group.add(hook2)
    }

    // Top ring for attachment to parent cord
    const topRing = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.004, 12, 20), brassMat)
    topRing.position.set(0, 0.025, 0)
    group.add(topRing)

    return group
  }

  // Cable generator: creates a thin line / cylinder from point A to point B
  function createCable(len: number): THREE.Mesh {
    const geo = new THREE.CylinderGeometry(0.0018, 0.0018, len, 8)
    const cable = new THREE.Mesh(geo, cableMat)
    cable.position.set(0, -len / 2, 0)
    return cable
  }

  // ----------------------------------------------------
  // 6. Synchronization with MobileSceneState
  // ----------------------------------------------------
  function sync(state: MobileSceneState, selectedId: string | null = null) {
    const metrics = calculatePhysics(state)

    // 1. Update Fulcrum position
    // slot is in cm (-30 to +30) => pos = slot * 0.01m
    const fx = state.fulcrumPosition * 0.01
    fulcrumGroup.position.set(fx, 0, 0)

    // 2. Update Main Beam tilt angle (degrees converted to radians)
    beamPivot.rotation.z = (state.mainAngle * Math.PI) / 180

    // 3. Update Angle Readout
    updateAngleLabel(state.mainAngle)
    angleGroup.visible = state.rulerVisible
    rulerMesh.visible = state.rulerVisible

    // 4. Update Dynamometer
    dynGroup.visible = state.dynamometerVisible
    // needle goes from 0 to 20 N: -0.18m to +0.18m
    const needleY = -0.16 + Math.min(1, Math.max(0, metrics.dynamometerTension / 20)) * 0.32
    dynNeedle.position.y = needleY

    // 5. Rebuild Dynamic Items (Weights & Sub-beams)
    while (dynamicItemsGroup.children.length > 0) {
      dynamicItemsGroup.remove(dynamicItemsGroup.children[0])
    }

    // A. Sub-Beams
    const subBeamNodes = new Map<string, THREE.Group>()
    state.subBeams.forEach(sb => {
      const sbNode = new THREE.Group()
      sbNode.name = `subbeam-${sb.id}`
      sbNode.position.set(sb.slot * 0.01, 0, 0)

      // Drop cord from main beam hole to sub-beam (len = 0.22m)
      const cordLen = 0.22
      const cord = createCable(cordLen)
      sbNode.add(cord)

      // Sub-beam pivot
      const sbPivot = new THREE.Group()
      sbPivot.position.set(0, -cordLen, 0)
      sbPivot.rotation.z = (sb.angle * Math.PI) / 180

      const mesh = createSubBeamMesh(sb.type)
      mesh.userData = { type: 'subbeam', id: sb.id }
      sbPivot.add(mesh)

      sbNode.add(sbPivot)
      dynamicItemsGroup.add(sbNode)
      subBeamNodes.set(sb.id, sbPivot)
    })

    // B. Weights
    state.weights.forEach(w => {
      const weightMesh = createWeightMesh(w.type)
      weightMesh.userData = { type: 'weight', id: w.id }

      if (w.subBeamId && subBeamNodes.has(w.subBeamId)) {
        // Attached to a sub-beam
        const sbPivot = subBeamNodes.get(w.subBeamId)!
        const parentSb = state.subBeams.find(sb => sb.id === w.subBeamId)!
        const span = parentSb.type === 'brass' ? 0.15 : 0.16
        const xOffset = w.subSlot === 'left' ? -span : span

        const weightHolder = new THREE.Group()
        weightHolder.position.set(xOffset, 0, 0)

        const cordLen = 0.16
        const cord = createCable(cordLen)
        weightHolder.add(cord)

        weightMesh.position.set(0, -cordLen, 0)
        // Keep weight hanging straight down regardless of sub-beam tilt
        weightMesh.rotation.z = -(parentSb.angle * Math.PI) / 180 - (state.mainAngle * Math.PI) / 180
        weightHolder.add(weightMesh)

        sbPivot.add(weightHolder)
      } else {
        // Direct weight on main beam
        const weightHolder = new THREE.Group()
        weightHolder.position.set(w.slot * 0.01, 0, 0)

        // Vary cord length according to item for aesthetic Calder mobile composition
        const cordLen = w.type === 'terracotta' ? 0.22 : w.type === 'glass' ? 0.18 : 0.24
        const cord = createCable(cordLen)
        weightHolder.add(cord)

        weightMesh.position.set(0, -cordLen, 0)
        // Counteract main beam rotation so weight hangs down vertically!
        weightMesh.rotation.z = -(state.mainAngle * Math.PI) / 180
        weightHolder.add(weightMesh)

        dynamicItemsGroup.add(weightHolder)
      }

      // If selected, add highlight glow
      if (selectedId && w.id === selectedId) {
        const glow = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.36, 0.24), glowMat)
        glow.position.copy(weightMesh.position)
        weightMesh.parent?.add(glow)
      }
    })
  }

  return {
    root,
    sync,
    holeRings
  }
}
