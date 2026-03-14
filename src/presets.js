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
					down: [
						{
							actionId: 'set_preset',
							options: {
								space: { isExpression: true, value: `$(local:spaceNumber)` },
								pst: { isExpression: true, value: `$(local:presetNumber)` },
								fade_time: self.config.fadetime,
							},
						},
					],
					up: [],
				},
			],
			localVariables: [
				{ variableType: 'simple', variableName: 'presetNumber', startupValue: 1 },
				{ variableType: 'simple', variableName: 'SpaceNumber', startupValue: 1 },
			],
			feedbacks: [
				{
					feedbackId: 'ActivePreset',
					options: {
						space: { isExpression: true, value: `$(local:spaceNumber)` },
						preset: { isExpression: true, value: `$(local:presetNumber)` },
					},
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
					down: [
						{ actionId: 'set_activate_sequence', options: { seq: { isExpression: true, value: `$(local:seqNum)` } } },
					],
					up: [],
				},
			],
			localVariables: [{ variableType: 'simple', variableName: 'seqNum', startupValue: 1 }],
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
					down: [
						{ actionId: 'set_deactivate_sequence', options: { seq: { isExpression: true, value: `$(local:seqNum)` } } },
					],
					up: [],
				},
			],
			localVariables: [{ variableType: 'simple', variableName: 'seqNum', startupValue: 1 }],
		},
		setZoneIntensity: {
			name: 'Set Zone X to Y',
			type: 'simple',
			style: {
				text: `Set Zone $(local:zoneValue) to $(local:intValue)`,
				size: 14,
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(153, 76, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'set_zone_int',
							options: {
								space: { isExpression: true, value: `$(local:spaceNumber)` },
								zone: { isExpression: true, value: `$(local:zoneValue)` },
								int: { isExpression: true, value: `$(local:intValue)` },
								fade_time: self.config.fadetime,
							},
						},
					],
					up: [],
				},
			],
			localVariables: [
				{ variableType: 'simple', variableName: 'spaceNumber', startupValue: 1 },
				{ variableType: 'simple', variableName: 'zoneValue', startupValue: 1 },
				{ variableType: 'simple', variableName: 'intValue', startupValue: 255 },
			],
			feedbacks: [
				{
					feedbackId: 'CheckInt',
					options: {
						space: { isExpression: true, value: `$(local:spaceNumber)` },
						zone: { isExpression: true, value: `$(local:zoneValue)` },
						int: { isExpression: true, value: `$(local:intValue)` },
					},
					style: {
						bgcolor: combineRgb(255, 120, 0),
						color: combineRgb(0, 0, 0),
					},
				},
			],
		},
	}

	const structure = [
		{
			id: '1',
			name: 'Space 1',
			definitions: [
				{
					id: '1a',
					name: 'Space Off',
					type: 'simple',
					presets: ['off'],
				},
				{
					id: '1b',
					name: 'Space Presets',
					type: 'template',
					presetId: 'activatePreset',
					templateVariableName: 'presetNumber',
					templateValues: self.EchoData.generatePresetArray('Preset', 16),
					commonVariableValues: {
						spaceNumber: 1,
					},
				},
				{
					id: '1c',
					name: 'Activate Sequence',
					type: 'template',
					presetId: 'activateSequence',
					templateVariableName: 'seqNum',
					templateValues: self.EchoData.generatePresetArray('Sequence', 4),
				},
				{
					id: '1d',
					name: 'Deactivate Sequence',
					type: 'template',
					presetId: 'deactivateSequence',
					templateVariableName: 'seqNum',
					templateValues: self.EchoData.generatePresetArray('Sequence', 4),
				},
				{
					id: '1e',
					name: 'Turn Zone On',
					type: 'template',
					presetId: 'setZoneIntensity',
					templateVariableName: 'zoneValue',
					templateValues: self.EchoData.generatePresetArray('Zone', 16),
					commonVariableValues: {
						spaceNumber: 1,
						intValue: 255,
					},
				},
				{
					id: '1f',
					name: 'Turn Zone Off',
					type: 'template',
					presetId: 'setZoneIntensity',
					templateVariableName: 'zoneValue',
					templateValues: self.EchoData.generatePresetArray('Zone', 16),
					commonVariableValues: {
						spaceNumber: 1,
						intValue: 0,
					},
				},
			],
		},
	]

	self.setPresetDefinitions(structure, presets)
}
