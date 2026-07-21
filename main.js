import { InstanceBase, InstanceStatus } from '@companion-module/base'
import { configFields } from './src/config.js'
import { upgradeScripts } from './src/upgrades.js'
import { UpdateActions } from './src/actions.js'
import { UpdateFeedbacks } from './src/feedbacks.js'
import { UpdateVariableDefinitions } from './src/variables.js'
import { UpdatePresetDefinitions } from './src/presets.js'
import { UDPServer } from './src/Echo/server.js'
import { EchoInstance } from './src/Echo/state.js'

const statusMap = {
	connecting: InstanceStatus.Connecting,
	ok: InstanceStatus.Ok,
	bad_config: InstanceStatus.BadConfig,
	connection_failure: InstanceStatus.ConnectionFailure,
}

export default class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.echoData = new EchoInstance()
		this.server = new UDPServer(config, this.echoData)

		this.server.on('status', (status, msg) => {
			this.updateStatus(statusMap[status], msg)
		})

		this.echoData.on('changed', (field) => {
			this.checkFeedbacks('CheckInt', 'SpaceOff', 'ActivePreset')  // TODO: scope to specific feedback check
			this.setVariableValues(this.buildVariables(field, space))
		})

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
		this.server.destroy()
		this.updateStatus(InstanceStatus.Disconnected)

		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		if (this.udp) {
			this.udp.close()
			delete this.udp
		}

		this.config = config

		if (this.echoData) {
			delete this.echoData
		}
		this.echoData = new EchoInstance()
		this.server.connect()
	}

	buildVariables(field, space) {
		const state = this.echoData.spaces.get(space)
		switch (field) {
			case 'activePreset':
				return { [`space${space}_preset`]: state.preset }
			case 'spaceOff':
				return { [`space${space}_off`]: state.off }
			case 'activeSequence':
				return { [`space${space}_sequence`]: state.sequence }
			case 'zonesInts': 
				return { [`space${space}_zones`]: Array.from(state.zones.values()) }
			default:
				return {}
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return configFields
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

export const UpgradeScripts = upgradeScripts
