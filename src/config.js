import { networkInterfaces } from 'node:os'
import { Regex } from '@companion-module/base'

// Get network interfaces of device Companion is running on
const nets = networkInterfaces()
const interfaces = []

for (const n of Object.keys(nets)) {
	for (const net of nets[n]) {
		if (net.family == 'IPv4' && !net.internal) {
			interfaces.push({ id: net.address, label: n + ' - ' + net.address })
		}
	}
}

export const configFields = [
	{
		type: 'textinput',
		id: 'host',
		label: 'Target IP',
		width: 6,
		regex: Regex.IP,
		required: true,
	},
	{
		type: 'dropdown',
		id: 'selfIP',
		label: 'Network Interface',
		tooltip: 'Select the network interface used for connecting to Echo. This will be used to collect feedbacks.',
		choices: interfaces,
		default: interfaces[0].id,
		width: 6,
		required: true,
	},
	{
		type: 'textinput',
		id: 'port',
		label: 'Send Port',
		default: '4703',
		tooltip: 'Default port is 4703',
		width: 6,
		regex: Regex.PORT,
		required: true,
	},
	{
		type: 'textinput',
		id: 'serverport',
		label: 'Listen Port',
		default: '4703',
		width: 6,
		regex: Regex.PORT,
		required: true,
	},
	{
		type: 'textinput',
		id: 'fadetime',
		label: 'Default Fade Time',
		default: '2',
		width: 6,
		regex: Regex.FLOAT,
		required: true,
	},
]
