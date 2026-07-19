import { combineRgb } from '@companion-module/base'

export async function UpdateFeedbacks(self) {
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
					id: 'space',
					type: 'number',
					label: 'Space Number',
					default: 1,
					min: 1,
					max: self.config.spaces,
				},
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
				return feedback.options.preset == self.echoData.spaces.get(feedback.options.space)?.preset
			},
		},
		SpaceOff: {
			name: 'Space Off',
			type: 'boolean',
			// description: 'If space is off, change style of the button',
			defaultStyle: {
				bgcolor: combineRgb(204, 0, 0),
				color: combineRgb(255, 255, 255),
			},
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
			callback: (feedback) => {
				return self.echoData.spaces.get(feedback.options.space)?.off
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
					id: 'space',
					type: 'number',
					label: 'Space Number',
					default: 1,
					min: 1,
					max: self.config.spaces,
				},
				{
					id: 'zone',
					type: 'dropdown',
					label: 'Zone Number',
					choices: self.echoData.ZoneNames,
					default: self.echoData.ZoneNames[0].id,
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
				return feedback.options.int == self.echoData.spaces.get(feedback.options.space)?.zones.get(feedback.options.zone)
			},
		},
	})
}
