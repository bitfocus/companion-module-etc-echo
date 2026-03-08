import { InstanceBase, Regex, InstanceStatus } from '@companion-module/base'
// const UpgradeScripts = require('./src/upgrades')
import { UpdateActions } from './src/actions.js'
import { UpdateFeedbacks } from './src/feedbacks.js'
import { setVariables } from './src/variables.js'
import { UpdatePresetDefinitions } from './src/presets.js'
import { GetConfigFields } from './src/lib/config.js'
import { CreateUDPServer } from './src/lib/udpserver.js'

export default class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		// The following runs when the module is opened for the first time or when the config is changed
		this.config = config

		// Set needed variables
		this.EchoData = {
			zonesInts: Array(16).fill(0),
			spaceOff: true,
			activePreset: 0,
			activeSequence: 0,
		}
		
		try {
			CreateUDPServer(this)
		} catch (err) {
			this.log('error', 'UDP server failed to start: ' + err.message)
		}

		this.updateStatus(InstanceStatus.Ok)

		UpdateActions(this) // export actions
		UpdateFeedbacks(this) // export feedbacks
		setVariables(this) // export variable definitions
		UpdatePresetDefinitions(this)
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

		CreateUDPServer(this)
	}

	// Return config fields for web config
	getConfigFields() {
		GetConfigFields()
	}
}
