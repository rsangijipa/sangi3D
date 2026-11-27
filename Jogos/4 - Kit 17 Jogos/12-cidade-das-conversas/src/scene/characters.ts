import * as THREE from 'three'
import type { createMaterials } from './materials.ts'

export interface CharacterRigs {
  playerGroup: THREE.Group
  npcBakerGroup: THREE.Group
  update: (delta: number, isSpeaking: boolean) => void
}

export function buildCharacters(scene: THREE.Scene, mats: ReturnType<typeof createMaterials>): CharacterRigs {
  const {
    sweaterMat,
    hairMat,
    skinMat,
    linenMat,
    apronMat,
    brassMat
  } = mats

  // ==========================================
  // 1. PLAYER FIGURINE (Child with Backpack)
  // Positioned at x: -0.38, y: 0, z: 0.65 facing bakery
  // ==========================================
  const playerGroup = new THREE.Group()
  playerGroup.name = 'character-player'
  playerGroup.position.set(-0.38, 0, 0.65)
  // Rotated facing towards the bakery counter (~35 degrees)
  playerGroup.rotation.y = Math.PI / 4.8

  const playerTorso = new THREE.Group()
  playerTorso.name = 'player-torso'

  // Legs & Trousers (corduroy / dark pants)
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x3d352e, roughness: 0.85 })
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.45, 10), pantsMat)
  legL.position.set(-0.09, 0.22, 0)
  legL.castShadow = true
  playerGroup.add(legL)

  const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.45, 10), pantsMat)
  legR.position.set(0.09, 0.22, 0)
  legR.castShadow = true
  playerGroup.add(legR)

  // Shoes (brown clay leather)
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x4a2c1d, roughness: 0.7 })
  const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.18), shoeMat)
  shoeL.position.set(-0.09, 0.04, 0.03)
  shoeL.castShadow = true
  playerGroup.add(shoeL)

  const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.18), shoeMat)
  shoeR.position.set(0.09, 0.04, 0.03)
  shoeR.castShadow = true
  playerGroup.add(shoeR)

  // Terracotta Knit Sweater Body
  const bodyGeo = new THREE.CylinderGeometry(0.18, 0.19, 0.48, 14)
  const body = new THREE.Mesh(bodyGeo, sweaterMat)
  body.position.y = 0.66
  body.castShadow = true
  playerTorso.add(body)

  // Sweater Collar
  const collarGeo = new THREE.TorusGeometry(0.12, 0.035, 8, 16)
  collarGeo.rotateX(Math.PI / 2)
  const collar = new THREE.Mesh(collarGeo, sweaterMat)
  collar.position.y = 0.91
  playerTorso.add(collar)

  // Arms (knit sleeves)
  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.38, 8), sweaterMat)
  armL.position.set(-0.24, 0.72, 0.05)
  armL.rotation.z = 0.18
  armL.rotation.x = -0.1
  armL.castShadow = true
  playerTorso.add(armL)

  const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.38, 8), sweaterMat)
  armR.position.set(0.24, 0.72, 0.05)
  armR.rotation.z = -0.18
  armR.rotation.x = -0.1
  armR.castShadow = true
  playerTorso.add(armR)

  // Head (Clay stop-motion sphere)
  const headGeo = new THREE.SphereGeometry(0.16, 16, 14)
  const head = new THREE.Mesh(headGeo, skinMat)
  head.position.y = 1.08
  head.castShadow = true
  playerTorso.add(head)

  // Curly Hair (Clustered textured rounded curls)
  const hairGroup = new THREE.Group()
  hairGroup.position.set(0, 1.14, 0)
  const curlGeo = new THREE.SphereGeometry(0.055, 10, 8)
  const curlOffsets: [number, number, number][] = [
    [0, 0.08, -0.06],
    [-0.08, 0.06, -0.06],
    [0.08, 0.06, -0.06],
    [-0.12, 0.02, -0.03],
    [0.12, 0.02, -0.03],
    [-0.13, -0.04, -0.02],
    [0.13, -0.04, -0.02],
    [0, 0.04, -0.12],
    [-0.07, 0.01, -0.11],
    [0.07, 0.01, -0.11],
    [0, -0.05, -0.12],
    [-0.08, 0.08, 0.04],
    [0.08, 0.08, 0.04],
    [0, 0.1, 0.02]
  ]
  curlOffsets.forEach(([cx, cy, cz]) => {
    const curl = new THREE.Mesh(curlGeo, hairMat)
    curl.position.set(cx, cy, cz)
    curl.castShadow = true
    hairGroup.add(curl)
  })
  playerTorso.add(hairGroup)

  // Beige Canvas Backpack on back
  const packGeo = new THREE.BoxGeometry(0.26, 0.32, 0.16)
  const pack = new THREE.Mesh(packGeo, linenMat)
  pack.position.set(0, 0.68, -0.18)
  pack.castShadow = true
  playerTorso.add(pack)

  // Flap & Straps
  const flapGeo = new THREE.BoxGeometry(0.27, 0.12, 0.18)
  const flap = new THREE.Mesh(flapGeo, linenMat)
  flap.position.set(0, 0.81, -0.18)
  playerTorso.add(flap)

  const buckleGeo = new THREE.BoxGeometry(0.04, 0.04, 0.02)
  const buckle = new THREE.Mesh(buckleGeo, brassMat)
  buckle.position.set(0, 0.72, -0.27)
  playerTorso.add(buckle)

  playerGroup.add(playerTorso)
  scene.add(playerGroup)

  // ==========================================
  // 2. BAKER NPC (Helena) behind counter
  // Positioned at x: 0.42, y: 0, z: -0.12
  // ==========================================
  const npcBakerGroup = new THREE.Group()
  npcBakerGroup.name = 'character-npc-baker'
  npcBakerGroup.position.set(0.42, 0, -0.12)
  // Facing forward towards the player
  npcBakerGroup.rotation.y = -Math.PI / 10

  const npcTorso = new THREE.Group()
  npcTorso.name = 'baker-torso'

  // Cream Linen Shirt Body
  const bakerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.21, 0.52, 14), linenMat)
  bakerBody.position.y = 0.72
  bakerBody.castShadow = true
  npcTorso.add(bakerBody)

  // Dark Green Apron over body
  const apronBib = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.46, 0.22), apronMat)
  apronBib.position.set(0, 0.71, 0.03)
  apronBib.castShadow = true
  npcTorso.add(apronBib)

  // Apron Neck Strap
  const strapGeo = new THREE.TorusGeometry(0.12, 0.015, 6, 12)
  strapGeo.rotateX(Math.PI / 2)
  const strap = new THREE.Mesh(strapGeo, apronMat)
  strap.position.set(0, 0.94, 0)
  npcTorso.add(strap)

  // Arms resting warmly on counter
  const bakerArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.36, 8), linenMat)
  bakerArmL.position.set(-0.22, 0.76, 0.14)
  bakerArmL.rotation.x = Math.PI / 3.5
  bakerArmL.rotation.z = 0.2
  npcTorso.add(bakerArmL)

  const bakerArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.36, 8), linenMat)
  bakerArmR.position.set(0.22, 0.76, 0.14)
  bakerArmR.rotation.x = Math.PI / 3.5
  bakerArmR.rotation.z = -0.2
  npcTorso.add(bakerArmR)

  // Baker Head with warm cheerful face
  const bakerHead = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 14), skinMat)
  bakerHead.position.y = 1.12
  bakerHead.castShadow = true
  npcTorso.add(bakerHead)

  // Eyes & Smile (stop-motion dark clay marks)
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x221a15 })
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), eyeMat)
  eyeL.position.set(-0.06, 1.14, 0.15)
  npcTorso.add(eyeL)

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), eyeMat)
  eyeR.position.set(0.06, 1.14, 0.15)
  npcTorso.add(eyeR)

  // Warm gentle smile curve
  const smileCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.04, 1.08, 0.15),
    new THREE.Vector3(0, 1.065, 0.155),
    new THREE.Vector3(0.04, 1.08, 0.15)
  ])
  const smileGeo = new THREE.TubeGeometry(smileCurve, 8, 0.005, 4, false)
  const smile = new THREE.Mesh(smileGeo, eyeMat)
  npcTorso.add(smile)

  // Baker Hair with sculpted Bun
  const bakerHairGeo = new THREE.SphereGeometry(0.168, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.55)
  const bakerHair = new THREE.Mesh(bakerHairGeo, hairMat)
  bakerHair.position.set(0, 1.15, -0.02)
  npcTorso.add(bakerHair)

  // Bun on top/back
  const bunGeo = new THREE.SphereGeometry(0.09, 12, 10)
  const bun = new THREE.Mesh(bunGeo, hairMat)
  bun.position.set(0, 1.28, -0.09)
  bun.castShadow = true
  npcTorso.add(bun)

  npcBakerGroup.add(npcTorso)
  scene.add(npcBakerGroup)

  let time = 0

  return {
    playerGroup,
    npcBakerGroup,
    update(delta: number, isSpeaking: boolean) {
      time += delta
      // Gentle breathing animation on player
      playerTorso.position.y = Math.sin(time * 2.0) * 0.006

      // Baker breathing and head tilt while speaking
      npcTorso.position.y = Math.sin(time * 2.2 + 0.5) * 0.007
      if (isSpeaking) {
        bakerHead.rotation.y = Math.sin(time * 4.5) * 0.04
        bakerHead.rotation.x = Math.sin(time * 3.5) * 0.03
      } else {
        bakerHead.rotation.y = Math.sin(time * 0.8) * 0.02
        bakerHead.rotation.x = 0
      }
    }
  }
}
