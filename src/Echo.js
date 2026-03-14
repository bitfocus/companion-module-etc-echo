export class EchoInstance {
	constructor(numSpaces) {
		this.numSpaces = numSpaces
		this.zonesInts = []
		this.spaceOff = []
		this.activePreset = []
		this.activeSequence = []

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

		// Fill arrays with 0s per number of spaces
		for (let i = 1; i <= this.numSpaces; i++) {
			this.zonesInts[i - 1] = Array(16).fill(0)
			this.activePreset[i - 1] = Array(1).fill(0)
			this.activeSequence[i - 1] = Array(1).fill(0)
			this.spaceOff[i - 1] = true
		}
	}

	// Generate array of objects for Companion 2.0 API preset creation
	generatePresetArray(typeName, num) {
		let arrayTemp = []
		for (let i = 1; i <= num; i++) {
			arrayTemp[i - 1] = {
				name: typeName + ' ' + i,
				value: i,
			}
		}
		return arrayTemp
	}
}
