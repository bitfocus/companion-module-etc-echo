const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		ActivePreset: {
			name: 'Active Preset',
			type: 'boolean',
			description: 'If certain preset is active, change style of the button',
			defaultStyle: {
				bgcolor: combineRgb(0, 204, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'preset',
					type: 'number',
					label: 'Preset',
					default: 1,
					min: 1,
					max: 16,
				},
			],
			callback: (feedback) => {
				return feedback.options.preset == self.EchoData.activePreset
			},
		},
		SpaceOff: {
			name: 'Space Off',
			type: 'boolean',
			description: 'If space is off, change style of the button',
			defaultStyle: {
				bgcolor: combineRgb(204, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				return self.EchoData.spaceOff
			},
		},
		CheckInt: {
			name: 'Check Intensity',
			type: 'boolean',
			description: 'If space is at certain intensity, change style of the button',
			defaultStyle: {
				bgcolor: combineRgb(255, 120, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'zone',
					type: 'number',
					label: 'Zone',
					default: 1,
					min: 1,
					max: 16,
				},
				{
					id: 'int',
					type: 'number',
					label: 'Intensity',
					default: 255,
					min: 0,
					max: 255,
				},
			],
			callback: (feedback) => {
				return feedback.options.int == self.EchoData.zonesInts[feedback.options.zone - 1]
			},
		},
	})
}
