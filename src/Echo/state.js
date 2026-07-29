import { EventEmitter } from 'node:events'
import { createModuleLogger } from '@companion-module/base'
 
const stateLogger = createModuleLogger('State')

export class EchoInstance extends EventEmitter {
	constructor() {
		super()

		// Map<space, { zones: Map<zone, value>, off: boolean, preset: value, sequence: value }>
		this.spaces = new Map()

		this.ZoneNames = []
		this.SpaceNames = []
		this.PresetNames = []

		// Initialize class data
		this.init()
	}

	// Initialize class
	init() {
		// Create values for dropdowns
		for (let i = 1; i <= 16; i++) {
			this.ZoneNames[i - 1] = { id: i, label: `Zone ${i}` }
			this.SpaceNames[i - 1] = { id: i, label: `Space ${i}` }
			this.PresetNames[i - 1] = { id: i, label: `Preset ${i}` }
		}

		// Init arrays with 0s
		for (let space = 1; space <= 16; space++) {
			const zones = new Map()
			for (let zone = 1; zone <= 16; zone++) {
				zones.set(zone, 0)
			}

			this.spaces.set(space, {
				zones,
				off: true,
				preset: 0,
				sequence: 0,
			})

		}
	}

	#getSpaceOrWarn(space) {
		const state = this.spaces.get(space)
		if (!state) {
			stateLogger.warn(`Ignoring update for unknown space ${space}`)
			return undefined
		}
		return state
	}

	setActivePreset(space, value) {
		const state = this.#getSpaceOrWarn(space)
		if (!state) return

		state.preset = value
		this.emit('changed', 'activePreset', space)
	}

	setSpaceOff(space, value) {
		const state = this.#getSpaceOrWarn(space)
		if (!state) return

		state.off = value
		this.emit('changed', 'spaceOff', space)
	}

	setActiveSequence(space, value) {
		const state = this.#getSpaceOrWarn(space)
		if (!state) return

		state.sequence = value
		this.emit('changed', 'activeSequence', space)
	}

	setZoneIntensity(space, zone, value) {
		const state = this.#getSpaceOrWarn(space)
		if (!state) return

		if (!state.zones.has(zone)) {
			stateLogger.warn(`Ignoring update for unknown zone ${zone} in space ${space}`)
			return
		}

		state.zones.set(zone, value)
		this.emit('changed', 'zonesInts', space)
	}
}
