import { test, describe, mock, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { parseData } from '../Echo/parse.js'

function createFakeEchoData() {
	return {
		setActivePreset: mock.fn(),
		setSpaceOff: mock.fn(),
		setActiveSequence: mock.fn(),
		setZoneIntensity: mock.fn(),
	}
}

describe('parseData', () => {
	let echoData

    /** Runs before each test: creates fake Echo state based on state data model */
	beforeEach(() => {
		echoData = createFakeEchoData()
	})

	describe('active preset (E>pst act:)', () => {
		test('parses a standard packet', () => {
			parseData('E>pst act: 1, 4\r\n', echoData)

			assert.equal(echoData.setActivePreset.mock.callCount(), 1)
			const [space, value] = echoData.setActivePreset.mock.calls[0].arguments
			assert.equal(space, 1)
			assert.equal(value, '4')
		})

		test('tolerates irregular whitespace around the colon and comma', () => {
			parseData('E>pst act:   2,4\r\n', echoData)

			const [space, value] = echoData.setActivePreset.mock.calls[0].arguments
			assert.equal(space, 2)
			assert.equal(value, '4')
		})

		test('0 means no preset applied, still forwarded to setter as-is', () => {
			parseData('E>pst act: 3, 0\r\n', echoData)

			const [space, value] = echoData.setActivePreset.mock.calls[0].arguments
			assert.equal(space, 3)
			assert.equal(value, '0')
		})

		test('does not also trigger other setters', () => {
			parseData('E>pst act: 1, 4\r\n', echoData)

			assert.equal(echoData.setSpaceOff.mock.callCount(), 0)
			assert.equal(echoData.setActiveSequence.mock.callCount(), 0)
			assert.equal(echoData.setZoneIntensity.mock.callCount(), 0)
		})
	})

	describe('space off (E>space off:)', () => {
		test('"1" is converted to boolean true', () => {
			parseData('E>space off: 5, 1\r\n', echoData)

			const [space, value] = echoData.setSpaceOff.mock.calls[0].arguments
			assert.equal(space, 5)
			assert.equal(value, true)
		})

		test('"0" is converted to boolean false', () => {
			parseData('E>space off: 5, 0\r\n', echoData)

			const [, value] = echoData.setSpaceOff.mock.calls[0].arguments
			assert.equal(value, false)
		})
	})

	describe('active sequence (E>seq act:)', () => {
		test('parses a standard packet', () => {
			parseData('E>seq act: 7, 12\r\n', echoData)

			const [space, value] = echoData.setActiveSequence.mock.calls[0].arguments
			assert.equal(space, 7)
			assert.equal(value, '12')
		})
	})

	describe('sync (E>lok:)', () => {
		test('is recognized but updates no state', () => {
			parseData('E>lok: 1\r\n', echoData)

			assert.equal(echoData.setActivePreset.mock.callCount(), 0)
			assert.equal(echoData.setSpaceOff.mock.callCount(), 0)
			assert.equal(echoData.setActiveSequence.mock.callCount(), 0)
			assert.equal(echoData.setZoneIntensity.mock.callCount(), 0)
		})
	})

	describe('zone intensity (E>zone int:)', () => {
		test('parses a single zone entry', () => {
			parseData('E>zone int: 1, 3, 75\r\n', echoData)

			assert.equal(echoData.setZoneIntensity.mock.callCount(), 1)
			const [space, zone, value] = echoData.setZoneIntensity.mock.calls[0].arguments
			assert.equal(space, 1)
			assert.equal(zone, 3)
			assert.equal(value, '75')
		})

		test('parses multiple zone entries in a single packet', () => {
			parseData('E>zone int: 1, 1, 0E>zone int: 1, 2, 50E>zone int: 1, 3, 100\r\n', echoData)

			assert.equal(echoData.setZoneIntensity.mock.callCount(), 3)

			const calls = echoData.setZoneIntensity.mock.calls.map((c) => c.arguments)
			assert.deepEqual(calls, [
				[1, 1, '0'],
				[1, 2, '50'],
				[1, 3, '100'],
			])
		})

		test('reads the space number from each entry individually, not a shared outer value', () => {
			// two different spaces reporting in the same packet
			parseData('E>zone int: 1, 5, 20E>zone int: 2, 5, 80\r\n', echoData)

			const calls = echoData.setZoneIntensity.mock.calls.map((c) => c.arguments)
			assert.deepEqual(calls, [
				[1, 5, '20'],
				[2, 5, '80'],
			])
		})
	})

	describe('unrecognized data', () => {
		test('does not throw and calls no setters', () => {
			assert.doesNotThrow(() => parseData('garbage nonsense packet', echoData))

			assert.equal(echoData.setActivePreset.mock.callCount(), 0)
			assert.equal(echoData.setSpaceOff.mock.callCount(), 0)
			assert.equal(echoData.setActiveSequence.mock.callCount(), 0)
			assert.equal(echoData.setZoneIntensity.mock.callCount(), 0)
		})

		test('empty string does not throw', () => {
			assert.doesNotThrow(() => parseData('', echoData))
		})
	})
})