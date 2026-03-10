const { combineRgb } = require('@companion-module/base')

module.exports = function (self) {
	const presets = {
		off: {
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
					down: [{ actionId: 'set_off', options: { fade_time: self.config.fadetime } }],
					up: [],
				},
			],
		},
		activatePreset: {
			name: 'Preset X',
			type: 'simple',
			style: {
				text: 'Preset $(local:presetNumber)',
				size: 18,
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 153, 0),
			},
			steps: [
				{
					down: [{ actionId: 'set_preset', options: {pst: { isExpression: true, value: `$(local:presetNumber)` }, fade_time: self.config.fadetime } }],
					up: [],
				},
			],
			localVariables: [
				{ variableType: 'simple', variableName: 'presetNumber', startupValue: 1}
			],
			feedbacks: [
				{
					feedbackId: 'ActivePreset',
					options: { preset: { isExpression: true, value: `$(local:presetNumber)` } },
					style: {
						bgcolor: combineRgb(0, 204, 0),
						color: combineRgb(255, 255, 255),
					},
				},
			],
		}
	}
	

	// // Create buttons for zone intensity control
	// let zoneButtonInts = [0, 25, 50, 75, 100]
	// for (let i = 1; i <= 16; i++) {
	// 	// For each zone, create five buttons, ranging from 0% to 100% intensity, and split each zone into its own category
	// 	for (const z of zoneButtonInts) {
	// 		presets[`zone_${i}_${z * 2.55}`] = {
	// 			name: `Set Zone ${i} to ${z}%`,
	// 			category: `${z}% Intensity`,
	// 			type: 'simple',
	// 			style: {
	// 				text: `Set Zone ${i} to ${z}%`,
	// 				size: 14,
	// 				color: combineRgb(255, 255, 255),
	// 				bgcolor: combineRgb(153, 76, 0),
	// 			},
	// 			steps: [
	// 				{
	// 					down: [
	// 						{
	// 							actionId: 'set_zone_int',
	// 							options: { zone: i, int: Math.ceil(z * 2.55), fade_time: self.config.fadetime },
	// 						},
	// 					],
	// 					up: [],
	// 				},
	// 			],
	// 			feedbacks: [
	// 				{
	// 					feedbackId: 'CheckInt',
	// 					options: { zone: i, int: Math.ceil(z * 2.55) },
	// 					style: {
	// 						bgcolor: combineRgb(255, 120, 0),
	// 						color: combineRgb(0, 0, 0),
	// 					},
	// 				},
	// 			],
	// 		}
	// 	}
	// }

	// // Create buttons for sequence control
	// for (let i = 1; i <= 4; i++) {
	// 	presets[`activate_seq_${i}`] = {
	// 		name: `Activate Sequence ${i}`,
	// 		category: 'Activate Sequence',
	// 		type: 'simple',
	// 		style: {
	// 			text: `Activate Sequence ${i}`,
	// 			size: 14,
	// 			color: combineRgb(255, 255, 255),
	// 			bgcolor: combineRgb(102, 0, 102),
	// 		},
	// 		steps: [
	// 			{
	// 				down: [{ actionId: 'set_activate_sequence', options: { seq: i } }],
	// 				up: [],
	// 			},
	// 		],
	// 	}

	// 	presets[`deactivate_seq_${i}`] = {
	// 		name: `Deactivate Sequence ${i}`,
	// 		category: 'Deactivate Sequence',
	// 		type: 'simple',
	// 		style: {
	// 			text: `Deactivate Sequence ${i}`,
	// 			size: 14,
	// 			color: combineRgb(255, 255, 255),
	// 			bgcolor: combineRgb(0, 0, 102),
	// 		},
	// 		steps: [
	// 			{
	// 				down: [{ actionId: 'set_deactivate_sequence', options: { seq: i } }],
	// 				up: [],
	// 			},
	// 		],
	// 	}
	// }

	const structure = [
		{
			id: 'a',
			name: 'Space Off',
			definitions: [
				{
					// id: 'b',
					// name: 'Recall Zone Preset',
					type: 'simple',
					presets: ['off']
				}
			]
		},
		{
			id: 'b',
			name: 'Zone Preset',
			definitions: [
				{
					type: 'template',
					presetId: 'activatePreset',
					templateVariableName: 'presetNumber',
					templateValues: [
						{ name: 'Preset 1', value: 1},
						{ name: 'Preset 2', value: 2},
						{ name: 'Preset 3', value: 3},
						{ name: 'Preset 4', value: 4},
						{ name: 'Preset 5', value: 5},
						{ name: 'Preset 6', value: 6},
						{ name: 'Preset 7', value: 7},
						{ name: 'Preset 8', value: 8},
						{ name: 'Preset 9', value: 9},
						{ name: 'Preset 10', value: 10},
						{ name: 'Preset 11', value: 11},
						{ name: 'Preset 12', value: 12},
						{ name: 'Preset 13', value: 13},
						{ name: 'Preset 14', value: 14},
						{ name: 'Preset 15', value: 15},
						{ name: 'Preset 16', value: 16},
					]
				}
			]
		}
	]

	self.setPresetDefinitions(structure, presets)
}
