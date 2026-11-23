// export interface EchoState {
// 	zones: Uint8Array;
// 	sequences: Uint8Array;
// 	presets: Uint8Array;
// 	isOff: Uint8Array;
// }

export function createEchoState() {
	return {
		zones: new Uint8Array(16 * 16),
		sequences: new Uint8Array(16 * 4),
		presets: new Uint8Array(16),
		isOff: new Uint8Array(16).fill(1),
	}
}

// TODO finish with better logging
function alertBadParams() {
	// log error
	console.log('Invalid parameters sent to function...')
	// alert user
}

export function setZone(state, space, zone, int) {
	if (space < 0 || space > 15 || zone < 0 || zone > 15 || int < 0 || int > 255 || !Number.isInteger(int)) {
		alertBadParams()
		return
	}

	state.zones[(space << 4) + zone] = int
}

export function getZone(state, space, zone) {
	if (space < 0 || space > 15 || zone < 0 || zone > 15) {
		alertBadParams()
		return
	}

	return state.zones[(space << 4) + zone]
}

export function setSequence(state, space, seq, active) {
	if (space < 0 || space > 15 || seq < 0 || seq > 3) {
		alertBadParams()
		return
	}

	if (active != 1 && active != 0) {
		alertBadParams()
		return
	}

	state.sequences[(space << 2) + seq] = active
}

export function getSequence(state, space, seq) {
	if (space < 0 || space > 15 || seq < 0 || seq > 3) {
		alertBadParams()
		return
	}

	return state.sequences[(space << 2) + seq]
}

export function setOff(state, space, offStatus) {
	if (space < 0 || space > 15) {
		alertBadParams()
		return
	}

	state.isOff[space] = offStatus
}

export function getOff(state, space) {
	if (space < 0 || space > 15) {
		alertBadParams()
		return
	}

	return state.isOff[space]
}

export function setPreset(state, space, preset) {
	if (space < 0 || space > 15 || preset < -1 || preset > 15) {
		alertBadParams()
		return
	}

	state.presets[space] = preset
}

export function getPreset(state, space) {
	if (space < 0 || space > 15) {
		alertBadParams()
		return
	}

	return state.presets[space]
}
