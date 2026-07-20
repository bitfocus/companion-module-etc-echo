import { combineRgb } from '@companion-module/base'

function getSimplePresetsArray(prefix, numPresets) {
	let array = []

	for (let i = 1; i <= numPresets; i++) {
		array.push(prefix + i)
	}

	return array
}

export function UpdatePresetDefinitions(self) {
	const presets = []

	presets[`preset_off`] = {
		name: 'Space Off',
		type: 'simple',
		style: {
			text: 'Space Off',
			size: 18,
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(153, 0, 0),
		},
		feedbacks: [
			{
				feedbackId: 'SpaceOff',
				style: {
					bgcolor: combineRgb(204, 0, 0),
					color: combineRgb(255, 255, 255),
				},
			},
		],
		steps: [
			{
				down: [{ actionId: 'set_off', options: { space: 1, fade_time: self.config.fadetime } }],
				up: [],
			},
		],
	}

	// Create buttons for presets 1-16
	for (let i = 1; i <= 16; i++) {
		presets[`preset_${i}`] = {
			name: `Preset ${i}`,
			type: 'simple',
			style: {
				text: `Preset ${i}`,
				size: 18,
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 153, 0),
			},
			steps: [
				{
					down: [{ actionId: 'set_preset', options: { space: 1, pst: i, fade_time: self.config.fadetime } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'ActivePreset',
					options: { preset: i },
					style: {
						bgcolor: combineRgb(0, 204, 0),
						color: combineRgb(255, 255, 255),
					},
				},
			],
		}
	}

	// Create buttons for zone intensity control
	const zoneButtonInts = [0, 25, 50, 75, 100]
	// Create five buttons, ranging from 0% to 100% intensity
	for (const z of zoneButtonInts) {
		presets[`zone_starter_${z}`] = {
			name: `Set Zone 1 to ${z}%`,
			type: 'simple',
			style: {
				text: `Zone 1\n ${z}%`,
				size: 14,
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(153, 76, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'set_zone_int',
							options: { space: 1, zone: 1, int: Math.ceil(z * 2.55), fade_time: self.config.fadetime },
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'CheckInt',
					options: { space: 1, zone: 1, int: Math.ceil(z * 2.55) },
					style: {
						bgcolor: combineRgb(255, 120, 0),
						color: combineRgb(0, 0, 0),
					},
				},
			],
		}
	}

	// Create buttons for sequence control
	for (let i = 1; i <= 4; i++) {
		presets[`activate_seq_${i}`] = {
			name: `Activate Sequence ${i}`,
			type: 'simple',
			style: {
				text: `Activate Sequence ${i}`,
				size: 10,
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(102, 0, 102),
			},
			steps: [
				{
					down: [{ actionId: 'set_activate_sequence', options: { space: 1, seq: i } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets[`deactivate_seq_${i}`] = {
			name: `Deactivate Sequence ${i}`,
			type: 'simple',
			style: {
				text: `Deactivate Sequence ${i}`,
				size: 10,
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 102),
			},
			steps: [
				{
					down: [{ actionId: 'set_deactivate_sequence', options: { space: 1, seq: i } }],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	const structure = []

	structure.push(
		{
			id: 'presets',
			name: 'Space Presets',
			definitions: [
				{
					id: 'off',
					name: 'Off',
					type: 'simple',
					presets: ['preset_off'],
				},
				{
					id: 'presets',
					name: 'Presets',
					type: 'simple',
					presets: getSimplePresetsArray('preset_', 16),
				},
			],
		},
		{
			id: 'intStarters',
			name: 'Intensity Starters',
			definitions: [
				{
					id: 'intStarters',
					// name: 'Intensity Starters',
					type: 'simple',
					presets: ['zone_starter_0', 'zone_starter_25', 'zone_starter_50', 'zone_starter_75', 'zone_starter_100'],
				},
			],
		},
		{
			id: 'sequence',
			name: 'Sequence Controls',
			definitions: [
				{
					id: 'seq_act',
					name: 'Activate Sequence',
					type: 'simple',
					presets: getSimplePresetsArray('activate_seq_', 4),
				},
				{
					id: 'seq_dact',
					name: 'Deactivate Sequence',
					type: 'simple',
					presets: getSimplePresetsArray('deactivate_seq_', 4),
				},
			],
		},
	)

	self.setPresetDefinitions(structure, presets)
}
