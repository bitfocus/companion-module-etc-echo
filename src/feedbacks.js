import { combineRgb } from '@companion-module/base'
import { getOff, getPreset, getZone } from './core/state'

// TODO finish
function raiseStateError() {
	console.log('State error occured')
}

export async function UpdateFeedbacks(self) {
	self.setFeedbackDefinitions({
		ActivePreset: {
			name: 'Active Preset',
			type: 'boolean',
			// description: 'If certain preset is active, change style of the button',
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
					asInteger: true,
				},
				{
					id: 'preset',
					type: 'number',
					label: 'Preset',
					default: 1,
					min: 1,
					max: 16,
					asInteger: true,
				},
			],
			callback: (feedback) => {
				const activePreset = getPreset(self.EchoData, feedback.options.space - 1)
				return feedback.options.preset == activePreset
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
					max: 16,
					asInteger: true,
				},
			],
			callback: (feedback) => {
				const isOff = getOff(self.EchoData, feedback.options.space - 1)
				if (isOff != 0 && isOff != 1) {
					raiseStateError()
					return
				}

				return isOff ? 1 : 0
			},
		},
		CheckInt: {
			name: 'ZoneIntensity',
			type: 'boolean',
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
					asInteger: true,
				},
				{
					id: 'zone',
					type: 'number',
					label: 'Zone Number',
					default: 1,
					min: 1,
					max: 16,
					asInteger: true,
				},
				{
					id: 'int',
					type: 'number',
					label: 'Intensity',
					default: 255,
					min: 0,
					max: 255,
					asInteger: true,
				},
			],
			callback: (feedback) => {
				activeInt = getZone(self.EchoData, feedback.options.space - 1, feedback.options.zone - 1)
				return feedback.options.int == activeInt
			},
		},
	})
}
