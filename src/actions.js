export function UpdateActions(self) {
	const actions = {}

	actions[`set_preset`] = {
		name: 'Set Active Preset',
		description: 'Activate an Echo preset',
		options: [
			{
				id: 'space',
				type: 'number',
				label: 'Space Number',
				default: 1,
				min: 1,
				max: 16,
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
				`pst act: ${event.options.space}, ${event.options.pst}, ${event.options.fade_time}`
			await self.server.send(cmd)
		},
	}

	actions[`set_off`] = {
		name: 'Set Space Off',
		description: 'Turn off all zones in space',
		options: [
			{
				id: 'space',
				type: 'number',
				label: 'Space Number',
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
			const cmd = `off: ${event.options.space}, ${event.options.fade_time}`
			await self.server.send(cmd)
		},
	}

	actions[`set_activate_sequence`] = {
		name: 'Activate Sequence',
		options: [
			{
				id: 'space',
				type: 'number',
				label: 'Space Number',
				default: 1,
				min: 1,
				max: 16,
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
			const cmd = `seq act: ${event.options.space}, ${event.options.seq}`
			await self.server.send(cmd)
		},
	}

	actions[`set_deactivate_sequence`] = {
		name: 'Deactivate Sequence',
		options: [
			{
				id: 'space',
				type: 'number',
				label: 'Space Number',
				default: 1,
				min: 1,
				max: 16,
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
			const cmd = `seq dect: ${event.options.space}, ${event.options.seq}`
			await self.server.send(cmd)
		},
	}

	actions[`set_zone_int`] = {
		name: 'Set Zone Intensity',
		description: 'Change intensity (brightness) of a zone',
		options: [
			{
				id: 'space',
				type: 'number',
				label: 'Space Number',
				default: 1,
				min: 1,
				max: 16,
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
			const cmd = `zone int: ${event.options.space}, ${event.options.zone}, ${event.options.int}, ${event.options.fade_time}`
			await self.server.send(cmd)
		},
	}

	actions[`get_preset`] = {
		name: 'Get Active Preset',
		options: [
			{
				id: 'space',
				type: 'number',
				label: 'Space Number',
				default: 1,
				min: 1,
				max: 16,
			},
		],
		callback: async (event) => {
			const cmd = `pst get: ${event.options.space}`
			await self.server.send(cmd)
		},
	},

	actions[`get_off`] = {
		name: 'Get Space Off Status',
		options: [
			{
				id: 'space',
				type: 'number',
				label: 'Space Number',
				default: 1,
				min: 1,
				max: 16,
			},
		],
		callback: async (event) => {
			const cmd = `off get: ${event.options.space}`
			await self.server.send(cmd)
		},
	},

	actions[`get_sequence`] = {
		name: 'Get Sequence Status',
		options: [
			{
				id: 'space',
				type: 'number',
				label: 'Space Number',
				default: 1,
				min: 1,
				max: 16,
			},
		],
		callback: async (event) => {
			const cmd = `seq get: ${event.options.space}`
			await self.server.send(cmd)
		},
	}

	actions[`get_sync`] = {
		name: 'Sync',
		description: 'Sync all space variables from Echo to Companion',
		options: [
			{
				id: 'space',
				type: 'number',
				label: 'Space Number',
				default: 1,
				min: 1,
				max: 16,
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
			const cmd = `sync get: ${spaceValue}`
			await self.server.send(cmd)
		},
	}

	actions[`get_zone_int`] = {
		name: 'Get Zone Intensities',
		description: 'Use to get updates on zone intensities',
		options: [
			{
				id: 'space',
				type: 'number',
				label: 'Space Number',
				default: 1,
				min: 1,
				max: 16,
			},
		],
		callback: async (event) => {
			const cmd = `zone int get: ${event.options.space}`
			await self.server.send(cmd)
		},
	}

	self.setActionDefinitions(actions)
}
