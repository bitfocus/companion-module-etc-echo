import { networkInterfaces } from 'os'

export function createZoneNames () {
    // Create dropdown for zone selection
	ZoneNames = []
	for (let i = 1; i <= 16; i++) {
		ZoneNames[i - 1] = { id: i, label: `Zone ${i}` }
	}

    return ZoneNames
}

export function getNetworkInterfaces () {
    // Get IP addresses of device Companion is running on
    nets = networkInterfaces()
    interfaces = []

    for (const n of Object.keys(this.nets)) {
        for (const net of this.nets[n]) {
            if (net.family == 'IPv4' && !net.internal) {
                this.interfaces.push({ id: net.address, label: n + ' - ' + net.address })
            }
        }
    }
    return interfaces
}