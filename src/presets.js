const { combineRgb } = require('@companion-module/base')
const feedbacks = require('./feedbacks')

module.exports = function (self) {
	const presets = {}

	presets[`preset_off`] = {
		name: 'Space Off',
		category: 'Presets',
		type: 'button',
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
				down: [{ actionId: 'set_off', options: { fade_time: self.config.fadetime } }],
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
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 153, 0),
			},
			steps: [
				{
					down: [{ actionId: 'set_preset', options: { pst: i, fade_time: self.config.fadetime } }],
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
	let zoneButtonInts = [0, 25, 50, 75, 100]
	for (let i = 1; i <= 16; i++) {
		// For each zone, create five buttons, ranging from 0% to 100% intensity, and split each zone into its own category
		for (const z of zoneButtonInts) {
			presets[`zone_${i}_${z * 2.55}`] = {
				name: `Set Zone ${i} to ${z}%`,
				category: `${z}% Intensity`,
				type: 'button',
				style: {
					text: `Set Zone ${i} to ${z}%`,
					size: 14,
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(153, 76, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: 'set_zone_int',
								options: { zone: i, int: Math.ceil(z * 2.55), fade_time: self.config.fadetime },
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'CheckInt',
						options: { zone: i, int: Math.ceil(z * 2.55) },
						style: {
							bgcolor: combineRgb(255, 120, 0),
							color: combineRgb(0, 0, 0),
						},
					},
				],
			}
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
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(102, 0, 102),
			},
			steps: [
				{
					down: [{ actionId: 'set_activate_sequence', options: { seq: i } }],
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
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 102),
			},
			steps: [
				{
					down: [{ actionId: 'set_deactivate_sequence', options: { seq: i } }],
					up: [],
				},
			],
		}
	}

	self.setPresetDefinitions(presets)
}
