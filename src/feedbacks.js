import { combineRgb } from '@companion-module/base'

export async function UpdateFeedbacks(self) {
	self.setFeedbackDefinitions({
		ActivePreset: {
			name: 'Active Preset',
			type: 'boolean',
			description: 'Reacts when a specific preset has been recalled',
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
					max: 16,
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
			description: 'Reacts when a specific space is off',
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
					max: 16,
				},
			],
			callback: (feedback) => {
				return self.echoData.spaces.get(feedback.options.space)?.off
			},
		},
		CheckInt: {
			name: 'Check Intensity',
			type: 'boolean',
			description: 'Reacts when a zone is a specific intensity',
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
