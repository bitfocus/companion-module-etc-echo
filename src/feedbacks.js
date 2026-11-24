import { getOff, getPreset, getZone } from './core/state.js'
import { colors } from './core/colors.js'
import { logger } from './core/logging.js'

const log = logger('Feedbacks')

export async function UpdateFeedbacks(self) {
	self.setFeedbackDefinitions({
		ActivePreset: {
			name: 'Active Preset',
			type: 'boolean',
			// description: 'If certain preset is active, change style of the button',
			defaultStyle: {
				bgcolor: colors.green,
				color: colors.black,
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
				bgcolor: colors.red,
				color: colors.white,
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
					log.warn('isOff not stored correctly. Please file issue on Github.')
					return
				}

				return isOff ? 1 : 0
			},
		},
		CheckInt: {
			name: 'ZoneIntensity',
			type: 'boolean',
			defaultStyle: {
				bgcolor: colors.amber,
				color: colors.black,
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
				const activeInt = getZone(self.EchoData, feedback.options.space - 1, feedback.options.zone - 1)
				return feedback.options.int == activeInt
			},
		},
	})
}
