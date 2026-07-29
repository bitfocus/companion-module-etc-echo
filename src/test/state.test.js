import { test, describe, mock, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { EchoInstance } from '../Echo/state.js'

describe('EchoInstance', () => {
	let echoData

	beforeEach(() => {
		echoData = new EchoInstance()
	})

	describe('initialization', () => {
		test('creates 16 spaces', () => {
			assert.equal(echoData.spaces.size, 16)
		})

		test('each space defaults to off, preset 0, sequence 0', () => {
			for (let space = 1; space <= 16; space++) {
				const state = echoData.spaces.get(space)
				assert.equal(state.off, true, `space ${space} should default off`)
				assert.equal(state.preset, 0, `space ${space} should default preset 0`)
				assert.equal(state.sequence, 0, `space ${space} should default sequence 0`)
			}
		})

		test('each space has 16 zones, all defaulting to 0', () => {
			for (let space = 1; space <= 16; space++) {
				const zones = echoData.spaces.get(space).zones
				assert.equal(zones.size, 16)
				for (let zone = 1; zone <= 16; zone++) {
					assert.equal(zones.get(zone), 0, `space ${space} zone ${zone} should default to 0`)
				}
			}
		})

		test('each space gets its own independent zones Map (not a shared reference)', () => {
			const zonesForSpace1 = echoData.spaces.get(1).zones
			const zonesForSpace2 = echoData.spaces.get(2).zones

			assert.notEqual(zonesForSpace1, zonesForSpace2)

			zonesForSpace1.set(5, 99)
			assert.equal(zonesForSpace2.get(5), 0, 'mutating space 1 zones should not affect space 2')
		})

		test('builds 16 ZoneNames, SpaceNames, and PresetNames entries with matching id/label', () => {
			for (const list of [
				{ arr: echoData.ZoneNames, label: 'Zone' },
				{ arr: echoData.SpaceNames, label: 'Space' },
				{ arr: echoData.PresetNames, label: 'Preset' },
			]) {
				assert.equal(list.arr.length, 16)
				for (let i = 0; i < 16; i++) {
					assert.deepEqual(list.arr[i], { id: i + 1, label: `${list.label} ${i + 1}` })
				}
			}
		})
	})

	describe('setActivePreset', () => {
		test('updates preset for the given space', () => {
			echoData.setActivePreset(3, 7)
			assert.equal(echoData.spaces.get(3).preset, 7)
		})

		test('does not affect other spaces', () => {
			echoData.setActivePreset(3, 7)
			assert.equal(echoData.spaces.get(4).preset, 0)
		})

		test('emits "changed" with field name and space', () => {
			const listener = mock.fn()
			echoData.on('changed', listener)

			echoData.setActivePreset(3, 7)

			assert.equal(listener.mock.callCount(), 1)
			assert.deepEqual(listener.mock.calls[0].arguments, ['activePreset', 3])
		})
	})

	describe('setSpaceOff', () => {
		test('updates off state for the given space', () => {
			echoData.setSpaceOff(5, false)
			assert.equal(echoData.spaces.get(5).off, false)
		})

		test('emits "changed" with field name and space', () => {
			const listener = mock.fn()
			echoData.on('changed', listener)

			echoData.setSpaceOff(5, false)

			assert.deepEqual(listener.mock.calls[0].arguments, ['spaceOff', 5])
		})
	})

	describe('setActiveSequence', () => {
		test('updates sequence for the given space', () => {
			echoData.setActiveSequence(2, 12)
			assert.equal(echoData.spaces.get(2).sequence, 12)
		})

		test('emits "changed" with field name and space', () => {
			const listener = mock.fn()
			echoData.on('changed', listener)

			echoData.setActiveSequence(2, 12)

			assert.deepEqual(listener.mock.calls[0].arguments, ['activeSequence', 2])
		})
	})

	describe('setZoneIntensity', () => {
		test('updates a single zone within the given space', () => {
			echoData.setZoneIntensity(1, 10, 75)
			assert.equal(echoData.spaces.get(1).zones.get(10), 75)
		})

		test('does not affect other zones in the same space', () => {
			echoData.setZoneIntensity(1, 10, 75)
			assert.equal(echoData.spaces.get(1).zones.get(9), 0)
			assert.equal(echoData.spaces.get(1).zones.get(11), 0)
		})

		test('does not affect the same zone number in a different space', () => {
			echoData.setZoneIntensity(1, 10, 75)
			assert.equal(echoData.spaces.get(2).zones.get(10), 0)
		})

		test('emits "changed" with field name and space', () => {
			const listener = mock.fn()
			echoData.on('changed', listener)

			echoData.setZoneIntensity(1, 10, 75)

			assert.deepEqual(listener.mock.calls[0].arguments, ['zonesInts', 1])
		})
	})

	describe('multiple listeners', () => {
		test('all registered listeners fire on a single change', () => {
			const listenerA = mock.fn()
			const listenerB = mock.fn()
			echoData.on('changed', listenerA)
			echoData.on('changed', listenerB)

			echoData.setActivePreset(1, 5)

			assert.equal(listenerA.mock.callCount(), 1)
			assert.equal(listenerB.mock.callCount(), 1)
		})
	})

	describe('invalid space numbers', () => {
		test('setting a non-existent space does not throw', () => {
			assert.doesNotThrow(() => echoData.setActivePreset(17, 5))
			assert.doesNotThrow(() => echoData.setZoneIntensity(0, 1, 50))
		})

		test('setting a non-existent space does not emit "changed"', () => {
			const listener = mock.fn()
			echoData.on('changed', listener)

			echoData.setActivePreset(17, 5)
			echoData.setSpaceOff(0, false)
			echoData.setActiveSequence(99, 3)
			echoData.setZoneIntensity(17, 1, 50)

			assert.equal(listener.mock.callCount(), 0)
		})

		test('valid spaces are unaffected by a prior invalid call', () => {
			echoData.setActivePreset(17, 5) // invalid, ignored
			echoData.setActivePreset(3, 9) // valid, should still work

			assert.equal(echoData.spaces.get(3).preset, 9)
		})
	})

	describe('invalid zone numbers', () => {
		test('setting a non-existent zone in a valid space does not throw', () => {
			assert.doesNotThrow(() => echoData.setZoneIntensity(1, 99, 50))
		})

		test('setting a non-existent zone does not emit "changed"', () => {
			const listener = mock.fn()
			echoData.on('changed', listener)

			echoData.setZoneIntensity(1, 99, 50)

			assert.equal(listener.mock.callCount(), 0)
		})

		test('does not create a new entry in the zones map', () => {
			echoData.setZoneIntensity(1, 99, 50)
			assert.equal(echoData.spaces.get(1).zones.has(99), false)
		})
	})
})