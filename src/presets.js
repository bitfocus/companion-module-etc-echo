import { combineRgb } from '@companion-module/base'

export function UpdatePresetDefinitions(self) {
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
		},
		activateSequence: {
			name: 'Activate Sequence X',
			type: 'simple',
			style: {
				text: 'Activate Sequence $(local:seqNum)',
				size: 14,
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(102, 0, 102),
			},
			steps: [
				{
					down: [{ actionId: 'set_activate_sequence', options: { seq: { isExpression: true, value: `$(local:seqNum)` } } }],
					up: [],
				},
			],
			localVariables: [
				{ variableType: 'simple', variableName: 'seqNum', startupValue: 1}
			],
		},
		deactivateSequence: {
			name: 'Deactivate Sequence X',
			type: 'simple',
			style: {
				text: 'Deactivate Sequence $(local:seqNum)',
				size: 14,
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 102),
			},
			steps: [
				{
					down: [{ actionId: 'set_deactivate_sequence', options: { seq: { isExpression: true, value: `$(local:seqNum)` } } }],
					up: [],
				},
			],
			localVariables: [
				{ variableType: 'simple', variableName: 'seqNum', startupValue: 1}
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
					templateValues: self.EchoData.generatePresetArray('Preset', 16)
				}
			]
		},
		{
			id: 'c',
			name: 'Activate Sequence',
			definitions: [
				{
					type: 'template',
					presetId: 'activateSequence',
					templateVariableName: 'seqNum',
					templateValues: self.EchoData.generatePresetArray('Sequence', 4)
				}
			]
		},
		{
			id: 'd',
			name: 'Deactivate Sequence',
			definitions: [
				{
					type: 'template',
					presetId: 'deactivateSequence',
					templateVariableName: 'seqNum',
					templateValues: self.EchoData.generatePresetArray('Sequence', 4)
				}
			]
		}
	]

	self.setPresetDefinitions(structure, presets)
}
