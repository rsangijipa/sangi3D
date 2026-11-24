import test from 'node:test'
import assert from 'node:assert/strict'
import { initial } from '../src/game/state.ts'
import { dispatch, validateCheckout } from '../src/game/rules.ts'
import { MISSIONS, PRODUCTS } from '../src/game/content.ts'

test('Initial state generates correct defaults', () => {
  const state = initial(false)
  assert.equal(state.version, 1)
  assert.equal(state.phase, 'entry')
  assert.equal(state.currentMissionId, 'market_snack')
  assert.equal(state.currentWaypoint, 'entrance')
  assert.equal(state.carrier, 'cart')
  assert.equal(state.inventory.length, 0)
  assert.equal(state.helpCount, 0)
  assert.equal(state.lowStimulation, false)
})

test('Waypoint navigation updates current position and records history', () => {
  const state = initial(false)
  const msg1 = dispatch(state, { type: 'move-waypoint', waypoint: 'produce' })
  assert.equal(state.currentWaypoint, 'produce')
  assert.match(msg1, /produce/)
  assert.equal(state.history.length, 1)

  const msg2 = dispatch(state, { type: 'move-waypoint', waypoint: 'bakery' })
  assert.equal(state.currentWaypoint, 'bakery')
  assert.match(msg2, /bakery/)
  assert.equal(state.history.length, 2)
})

test('Adding and removing items to cart', () => {
  const state = initial(false)
  dispatch(state, { type: 'add-to-cart', itemId: 'apple' })
  assert.equal(state.inventory.length, 1)
  assert.equal(state.inventory[0], 'apple')

  // Cannot add duplicate
  const dupMsg = dispatch(state, { type: 'add-to-cart', itemId: 'apple' })
  assert.equal(state.inventory.length, 1)
  assert.match(dupMsg, /já está no seu carrinho/)

  // Remove item
  dispatch(state, { type: 'remove-from-cart', itemId: 'apple' })
  assert.equal(state.inventory.length, 0)
})

test('Mission validation compares required items and alternatives', () => {
  const state = initial(false)
  state.currentMissionId = 'market_snack' // requires apple, rice, bread

  const valEmpty = validateCheckout(state)
  assert.equal(valEmpty.isComplete, false)
  assert.equal(valEmpty.missingItems.length, 3)

  // Add 2 required items
  dispatch(state, { type: 'add-to-cart', itemId: 'apple' })
  dispatch(state, { type: 'add-to-cart', itemId: 'rice' })

  const valPartial = validateCheckout(state)
  assert.equal(valPartial.isComplete, false)
  assert.equal(valPartial.foundCount, 2)
  assert.deepEqual(valPartial.missingItems, ['bread'])

  // Add 3rd item
  dispatch(state, { type: 'add-to-cart', itemId: 'bread' })
  const valComplete = validateCheckout(state)
  assert.equal(valComplete.isComplete, true)
  assert.equal(valComplete.missingItems.length, 0)
})

test('Alternative item substitution works correctly', () => {
  const state = initial(false)
  state.currentMissionId = 'market_hygiene' // requires soap, apple, milk, alternatives: soap -> soap_liquid

  dispatch(state, { type: 'add-to-cart', itemId: 'soap_liquid' })
  dispatch(state, { type: 'add-to-cart', itemId: 'milk' })
  dispatch(state, { type: 'add-to-cart', itemId: 'apple' })

  const val = validateCheckout(state)
  assert.equal(val.isComplete, true)
  assert.equal(val.hasValidSubstitutes, true)
})

test('Undo and redo restores inventory and waypoint state', () => {
  const state = initial(false)
  dispatch(state, { type: 'move-waypoint', waypoint: 'produce' })
  dispatch(state, { type: 'add-to-cart', itemId: 'apple' })
  assert.equal(state.inventory.length, 1)
  assert.equal(state.currentWaypoint, 'produce')

  // Undo add-to-cart
  dispatch(state, { type: 'undo' })
  assert.equal(state.inventory.length, 0)

  // Undo move-waypoint
  dispatch(state, { type: 'undo' })
  assert.equal(state.currentWaypoint, 'entrance')

  // Redo move-waypoint
  dispatch(state, { type: 'redo' })
  assert.equal(state.currentWaypoint, 'produce')

  // Redo add-to-cart
  dispatch(state, { type: 'redo' })
  assert.equal(state.inventory.length, 1)
  assert.equal(state.inventory[0], 'apple')
})

test('Observations recording and clinical notes', () => {
  const state = initial(false)
  dispatch(state, {
    type: 'observe',
    opportunity: 1,
    actionName: 'item_selection',
    result: 'Independente'
  })
  assert.equal(state.observations.length, 1)
  assert.equal(state.observations[0].result, 'Independente')

  dispatch(state, {
    type: 'observe',
    opportunity: 2,
    actionName: 'cashier_interaction',
    result: 'Com ajuda'
  })
  assert.equal(state.observations.length, 2)
  assert.equal(state.observations[1].result, 'Com ajuda')
})

test('Carrier switching between cart and basket', () => {
  const state = initial(false)
  assert.equal(state.carrier, 'cart')

  dispatch(state, { type: 'set-carrier', carrier: 'basket' })
  assert.equal(state.carrier, 'basket')

  dispatch(state, { type: 'set-carrier', carrier: 'cart' })
  assert.equal(state.carrier, 'cart')
})
