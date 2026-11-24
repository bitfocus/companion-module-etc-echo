import { colors } from './core/colors.js'

export function UpdatePresetDefinitions(self) {
	const presets = {}

	presets[`preset_off`] = {
		name: 'Space Off',
		category: 'Presets',
		type: 'button',
		style: {
			text: 'Space Off',
			size: 18,
			color: colors.white,
			bgcolor: colors.redText
		},
		feedbacks: [
			{
				feedbackId: 'SpaceOff',
				style: {
					bgcolor: colors.red,
					color: colors.white,
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
			category: 'Presets',
			type: 'button',
			style: {
				text: `Preset ${i}`,
				size: 18,
				color: colors.white,
				bgcolor: colors.greenText,
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
						bgcolor: colors.green,
						color: colors.white,
					},
				},
			],
		}
	}

	// Create buttons for zone intensity control
	let zoneButtonInts = [0, 25, 50, 75, 100]
	// Create five buttons, ranging from 0% to 100% intensity
	for (const z of zoneButtonInts) {
		presets[`zone_starter_${z * 2.55}`] = {
			name: `Set Zone 1 to ${z}%`,
			category: 'Intensity Starters',
			type: 'button',
			style: {
				text: `Zone 1\n ${z}%`,
				size: 14,
				color: colors.white,
				bgcolor: colors.burntOrange,
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
						bgcolor: colors.amber,
						color: colors.black,
					},
				},
			],
		}
	}

	// Create buttons for sequence control
	for (let i = 1; i <= 4; i++) {
		presets[`activate_seq_${i}`] = {
			name: `Activate Sequence ${i}`,
			category: 'Activate Sequence',
			type: 'button',
			style: {
				text: `Activate Sequence ${i}`,
				size: 14,
				color: colors.white,
				bgcolor: colors.purple,
			},
			steps: [
				{
					down: [{ actionId: 'set_activate_sequence', options: { space: 1, seq: i } }],
					up: [],
				},
			],
		}

		presets[`deactivate_seq_${i}`] = {
			name: `Deactivate Sequence ${i}`,
			category: 'Deactivate Sequence',
			type: 'button',
			style: {
				text: `Deactivate Sequence ${i}`,
				size: 14,
				color: colors.white,
				bgcolor: colors.blue,
			},
			steps: [
				{
					down: [{ actionId: 'set_deactivate_sequence', options: { space: 1, seq: i } }],
					up: [],
				},
			],
		}
	}

	self.setPresetDefinitions(presets)
}
