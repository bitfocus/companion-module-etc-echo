module.exports = function (self) {
	const sendUDP = async (msg) => {
		// Format and send UDP message to server
		const sendBuf = Buffer.from(msg, 'latin1')

		if (self.udp !== undefined) {
			self.log('debug', 'sending to ' + self.config.host + ':' + self.config.port + ': ' + sendBuf.toString())

			self.udp.send(sendBuf, 0, sendBuf.length, self.config.port, self.config.host)
		}
	}

	// Create dropdown for zone selection
	this.ZoneNames = []
	for (let i = 1; i <= 16; i++) {
		this.ZoneNames[i-1] = { id: i, label: `Zone ${i}` }
	}

	self.setActionDefinitions({
		set_preset: {
			name: 'Set Active Preset',
			description: 'Activate an Echo preset',
			options: [
				{
					id: 'pst',
					type: 'number',
					label: 'Preset Number',
					default: 1,
					min: 1,
					max: 64,
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
				const cmd = 'E$pst act: ' + self.config.space + ', ' + event.options.pst + ', ' + event.options.fade_time + '\r'
				await sendUDP(cmd)
			},
		},
		set_off: {
			name: 'Set Space Off',
			description: 'Turn off all zones in space',
			options: [
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
				const cmd = 'E$off: ' + self.config.space + ', ' + event.options.fade_time + '\r'
				await sendUDP(cmd)
			},
		},
		set_activate_sequence: {
			name: 'Activate Sequence',
			options: [
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
				const cmd = 'E$seq act: ' + self.config.space + ', ' + event.options.seq + '\r'
				await sendUDP(cmd)
			},
		},
		set_deactivate_sequence: {
			name: 'Deactivate Sequence',
			options: [
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
				const cmd = 'E$seq dect: ' + self.config.space + ', ' + event.options.seq + '\r'
				await sendUDP(cmd)
			},
		},
		set_zone_int: {
			name: 'Set Zone Intensity',
			description: 'Change intensity (brightness) of a zone',
			options: [
				{
					id: 'zone',
					type: 'dropdown',
					label: 'Zone Number',
					choices: this.ZoneNames,
					default: this.ZoneNames[0].id,
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
					self.config.space +
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
			options: [],
			callback: async (event) => {
				const cmd = 'E$pst get: ' + self.config.space + '\r'
				await sendUDP(cmd)
			},
		},
		get_off: {
			name: 'Get Space Off Status',
			options: [],
			callback: async (event) => {
				const cmd = 'E$off get: ' + self.config.space + '\r'
				await sendUDP(cmd)
			},
		},
		get_sequence: {
			name: 'Get Sequence Status',
			options: [],
			callback: async (event) => {
				const cmd = 'E$seq get: ' + self.config.space + '\r'
				await sendUDP(cmd)
			},
		},
		get_sync: {
			name: 'Sync',
			description: 'Sync all variables between Companion and Echo',
			options: [],
			callback: async (event) => {
				const cmd = 'E$sync get: ' + self.config.space + '\r'
				await sendUDP(cmd)
			},
		},
		get_zone_int: {
			name: 'Get Zone Intensities',
			description: 'Use to get updates on zone intensities',
			options: [],
			callback: async (event) => {
				const cmd = 'E$zone int get: ' + self.config.space + '\r'
				await sendUDP(cmd)
			},
		},
	})
}
