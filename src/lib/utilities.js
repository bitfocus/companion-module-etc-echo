import { networkInterfaces } from 'os'

export function createZoneNames () {
    // Create dropdown for zone selection
	let ZoneNames = []
	for (let i = 1; i <= 16; i++) {
		ZoneNames[i - 1] = { id: i, label: `Zone ${i}` }
	}

    return ZoneNames
}

export function getNetworkInterfaces (self) {
    // Get IP addresses of device Companion is running on
    const nets = networkInterfaces()
    let interfaces = []

    for (const n of Object.keys(nets)) {
        for (const net of self.nets[n]) {
            if (net.family == 'IPv4' && !net.internal) {
                interfaces.push({ id: net.address, label: n + ' - ' + net.address })
            }
        }
    }
    return interfaces
}