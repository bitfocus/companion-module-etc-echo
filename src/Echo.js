export class EchoInstance {
    constructor() {
        this.zonesInts = Array(16).fill(0)
        this.spaceOff = true
        this.activePreset = 0
        this.activeSequence = 0
        this.ZoneNames = []

        // Initialize class data
        this.generateZoneNames()
    }

    // Create dropdown for zone selection
    generateZoneNames() {
        for (let i = 1; i <= 16; i++) {
            this.ZoneNames[i-1] = { id: i, label: `Zone ${i}` }
        }
    }

    // Generate array of objects for Companion 2.0 API preset creation
    generatePresetArray(typeName, num) {
        let arrayTemp = []
        for (let i = 1; i <= num; i++) {
            arrayTemp[i-1] = { 
                name: typeName + ' ' + i,
                value: i,
            }
        }
        return arrayTemp
    }
}