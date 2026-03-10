const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./src/upgrades')
const UpdateActions = require('./src/actions')
const UpdateFeedbacks = require('./src/feedbacks')
const UpdateVariableDefinitions = require('./src/variables')
const UpdatePresetDefinitions = require('./src/presets')
const dgram = require('dgram')
const { networkInterfaces } = require('os')

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		this.EchoData = {
			zonesInts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			spaceOff: true,
			activePreset: 0,
			activeSequence: 0,
		}

		this.getIPs = () => {
			// Get IP addresses of device Companion is running on
			this.nets = networkInterfaces()
			this.interfaces = []

			for (const n of Object.keys(this.nets)) {
				for (const net of this.nets[n]) {
					if (net.family == 'IPv4' && !net.internal) {
						this.interfaces.push({ id: net.address, label: n + ' - ' + net.address })
					}
				}
			}
			return this.interfaces
		}
	}

	async init(config) {
		// The following runs when the module is opened for the first time or when the config is changed
		this.config = config

		await this.configUpdated(config)

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updatePresetDefinitions()
	}

	// When module gets deleted or deactivated
	async destroy() {
		if (this.udp) {
			this.udp.close()
			delete this.udp
		} else {
			this.updateStatus(InstanceStatus.Disconnected)
		}

		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		if (this.udp) {
			this.udp.close()
			delete this.udp
		}

		this.config = config

		this.init_udp()
	}

	init_udp() {
		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.host) {
			this.udp = dgram.createSocket({ type: 'udp4', reuseAddr: true })
			this.udp.bind({ port: this.config.serverport, address: this.config.selfIP }, () => {
				this.updateStatus(InstanceStatus.Ok)
				this.log('info', 'Listening for UDP packets on ' + this.config.serverport)
			})

			this.udp.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', 'Network error: ' + err.message)

				this.udp.close()
			})

			// If we get data, thing should be good
			this.udp.on('listening', () => {
				this.updateStatus(InstanceStatus.Ok)
			})

			// Call when data gets received
			this.udp.on('message', (msg, dInfo) => {
				let dataResponse = msg.toString()
				this.spaceRegexCheck = new RegExp(String.raw`.+?(?=: +${this.config.space})`)

				if (this.spaceRegexCheck.test(dataResponse)) {
					switch (true) {
						case /E>pst act:/.test(dataResponse):
							// Expected data response: E>pst act: <space> <active preset>
							// If active preset == 0, no preset is applied
							this.log('info', 'Preset data recieved')
							let pstData = dataResponse.slice(11).split(', ')
							this.EchoData.activePreset = pstData[1].replace(/(\r\n|\n|\r)/gm, '')

							// Update variables in Companion
							this.setVariableValues({
								activePreset: this.EchoData.activePreset,
							})

							// Update feedbacks
							this.checkFeedbacks('CheckInt', 'SpaceOff', 'ActivePreset')
							break
						case /E>space off:/.test(dataResponse):
							// Expected data response: E>space off: <space> <truthy/falsy> (1 == truthy)
							// Currently ignoring space data... assuming only using with one space
							this.log('info', 'Space off data recieved')
							let offData = dataResponse.slice(13).split(', ')
							this.EchoData.spaceOff = offData[1].replace(/(\r\n|\n|\r)/gm, '') === '1' ? true : false

							// Update variables in Companion
							this.setVariableValues({
								spaceOff: this.EchoData.spaceOff,
							})

							// Update feedbacks
							this.checkFeedbacks('CheckInt', 'SpaceOff', 'ActivePreset')
							break
						case /E>seq act:/.test(dataResponse):
							this.log('info', 'Sequence data recieved')
							let seqData = dataResponse.slice(11).split(', ')
							this.EchoData.activeSequence = seqData[1].replace(/(\r\n|\n|\r)/gm, '')

							this.setVariableValues({
								activeSequence: this.EchoData.activeSequence,
							})
							break
						case /E>lok:/.test(dataResponse):
							this.log('info', 'Sync data recieved')
							break
						case /E>zone int:/.test(dataResponse):
							// Zone intensity data
							this.log('info', 'Zone intensity data recieved')
							let zoneData = dataResponse.split('E>zone int: ')
							zoneData.shift() // First value in array should be blank
							zoneData.forEach((zone) => {
								let zRes = zone.split(', ')
								this.EchoData.zonesInts[zRes[1] - 1] = zRes[2].replace(/(\r\n|\n|\r)/gm, '')
							})

							// Update variables in Companion
							this.setVariableValues({
								z1_int: this.EchoData.zonesInts[0],
								z2_int: this.EchoData.zonesInts[1],
								z3_int: this.EchoData.zonesInts[2],
								z4_int: this.EchoData.zonesInts[3],
								z5_int: this.EchoData.zonesInts[4],
								z6_int: this.EchoData.zonesInts[5],
								z7_int: this.EchoData.zonesInts[6],
								z8_int: this.EchoData.zonesInts[7],
								z9_int: this.EchoData.zonesInts[8],
								z10_int: this.EchoData.zonesInts[9],
								z11_int: this.EchoData.zonesInts[10],
								z12_int: this.EchoData.zonesInts[11],
								z13_int: this.EchoData.zonesInts[12],
								z14_int: this.EchoData.zonesInts[13],
								z15_int: this.EchoData.zonesInts[14],
								z16_int: this.EchoData.zonesInts[15],
							})

							// Update feedbacks
							this.checkFeedbacks('CheckInt', 'SpaceOff', 'ActivePreset')
							break
						default:
							this.log('info', 'Unexpected UDP data received')
							break
					}
				}
			})

			this.udp.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	// Return config fields for web config
	getConfigFields() {
		this.interfaceList = this.getIPs()
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value:
					'This module is configured to only control one Echo "Space" at a time, ' +
					'due to the sheer number of parameters required to track all 16 available ' +
					'spaces. The ability to receive feedbacks from multiple modules in parallel does not currently work.'
			},
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
				choices: this.interfaceList,
				default: this.interfaceList[0].id,
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
				id: 'space',
				label: 'Echo Space',
				default: '1',
				width: 6,
				regex: Regex.NUMBER,
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
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	updatePresetDefinitions() {
		UpdatePresetDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
