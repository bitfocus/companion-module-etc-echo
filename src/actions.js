export function UpdateActions(self) {
	const sendUDP = async (msg) => {
		// Format and send UDP message to server
		const sendBuf = Buffer.from(msg, 'latin1')

		if (self.udp !== undefined) {
			self.log('debug', 'sending to ' + self.config.host + ':' + self.config.port + ': ' + sendBuf.toString())
			self.udp.send(sendBuf, 0, sendBuf.length, self.config.port, self.config.host)
		}
	}

	self.setActionDefinitions({
		set_preset: {
			name: 'Set Active Preset',
			description: 'Activate an Echo preset',
			options: [
				{
					id: 'space',
					type: 'number',
					label: 'Space Number',
					default: 1,
					min: 1,
					max: self.config.spaces,
				},
				{
					id: 'pst',
					type: 'number',
					label: 'Preset Number',
					default: 1,
					min: 1,
					max: 16,
				},
				{
					id: 'fade_time',
					type: 'number',
					label: 'Fade Time (sec)',
					default: 2.0,
					min: 0.0,
					max: 25.4,
				},
			],
			callback: async (event) => {
				const cmd =
					'E$pst act: ' + event.options.space + ', ' + event.options.pst + ', ' + event.options.fade_time + '\r'
				await sendUDP(cmd)
			},
		},
		set_off: {
			name: 'Set Space Off',
			description: 'Turn off all zones in space',
			options: [
				{
					id: 'space',
					type: 'number',
					label: 'Space Number',
					default: 1,
					min: 1,
					max: self.config.spaces,
				},
				{
					id: 'fade_time',
					type: 'number',
					label: 'Fade Time (sec)',
					default: 2.0,
					min: 0.0,
					max: 25.4,
				},
			],
			callback: async (event) => {
				const cmd = 'E$off: ' + event.options.space + ', ' + event.options.fade_time + '\r'
				await sendUDP(cmd)
			},
		},
		set_activate_sequence: {
			name: 'Activate Sequence',
			options: [
				{
					id: 'space',
					type: 'number',
					label: 'Space Number',
					default: 1,
					min: 1,
					max: self.config.spaces,
				},
				{
					id: 'seq',
					type: 'number',
					label: 'Sequence Number',
					default: 1,
					min: 1,
					max: 4,
				},
			],
			callback: async (event) => {
				const cmd = 'E$seq act: ' + event.options.space + ', ' + event.options.seq + '\r'
				await sendUDP(cmd)
			},
		},
		set_deactivate_sequence: {
			name: 'Deactivate Sequence',
			options: [
				{
					id: 'space',
					type: 'number',
					label: 'Space Number',
					default: 1,
					min: 1,
					max: self.config.spaces,
				},
				{
					id: 'seq',
					type: 'number',
					label: 'Preset Number',
					default: 1,
					min: 1,
					max: 4,
				},
			],
			callback: async (event) => {
				const cmd = 'E$seq dect: ' + event.options.space + ', ' + event.options.seq + '\r'
				await sendUDP(cmd)
			},
		},
		set_zone_int: {
			name: 'Set Zone Intensity',
			description: 'Change intensity (brightness) of a zone',
			options: [
				{
					id: 'space',
					type: 'number',
					label: 'Space Number',
					default: 1,
					min: 1,
					max: self.config.spaces,
				},
				{
					id: 'zone',
					type: 'number',
					label: 'Zone Number',
					default: 1,
					min: 1,
					max: 16,
				},
				{
					id: 'int',
					type: 'number',
					label: 'Zone Intensity',
					default: 255,
					min: 0,
					max: 255,
				},
				{
					id: 'fade_time',
					type: 'number',
					label: 'Fade Time (sec)',
					default: 2.0,
					min: 0.0,
					max: 25.4,
				},
			],
			callback: async (event) => {
				const cmd =
					'E$zone int: ' +
					event.options.space +
					', ' +
					event.options.zone +
					', ' +
					event.options.int +
					', ' +
					event.options.fade_time +
					'\r'
				await sendUDP(cmd)
			},
		},
		get_preset: {
			name: 'Get Active Preset',
			options: [
				{
					id: 'space',
					type: 'number',
					label: 'Space Number',
					default: 1,
					min: 1,
					max: self.config.spaces,
				},
			],
			callback: async (event) => {
				const cmd = 'E$pst get: ' + event.options.space + '\r'
				await sendUDP(cmd)
			},
		},
		get_off: {
			name: 'Get Space Off Status',
			options: [
				{
					id: 'space',
					type: 'number',
					label: 'Space Number',
					default: 1,
					min: 1,
					max: self.config.spaces,
				},
			],
			callback: async (event) => {
				const cmd = 'E$off get: ' + event.options.space + '\r'
				await sendUDP(cmd)
			},
		},
		get_sequence: {
			name: 'Get Sequence Status',
			options: [
				{
					id: 'space',
					type: 'number',
					label: 'Space Number',
					default: 1,
					min: 1,
					max: self.config.spaces,
				},
			],
			callback: async (event) => {
				const cmd = 'E$seq get: ' + event.options.space + '\r'
				await sendUDP(cmd)
			},
		},
		get_sync: {
			name: 'Sync',
			description: 'Sync all space variables from Echo to Companion',
			options: [
				{
					id: 'space',
					type: 'number',
					label: 'Space Number',
					default: 1,
					min: 1,
					max: self.config.spaces,
				},
				{
					id: 'getAll',
					type: 'checkbox',
					label: 'Get values for all spaces',
					default: false,
				},
			],
			callback: async (event) => {
				const spaceValue = event.options.getAll ? 0 : event.options.space
				const cmd = 'E$sync get: ' + spaceValue + '\r'
				await sendUDP(cmd)
			},
		},
		get_zone_int: {
			name: 'Get Zone Intensities',
			description: 'Use to get updates on zone intensities',
			options: [
				{
					id: 'space',
					type: 'number',
					label: 'Space Number',
					default: 1,
					min: 1,
					max: self.config.spaces,
				},
			],
			callback: async (event) => {
				const cmd = 'E$zone int get: ' + event.options.space + '\r'
				await sendUDP(cmd)
			},
		},
	})
}
