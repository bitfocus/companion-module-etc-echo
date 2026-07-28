import { UDPHelper, InstanceStatus, createModuleLogger } from '@companion-module/base'
import { EventEmitter } from 'node:events'
import { parseData } from './parse.js'

const serverLogger = createModuleLogger('UDPServer')
const sendLogger = createModuleLogger('Send')
const parseLogger = createModuleLogger('Parse')

const REQUEST_PREFIX = "E$"
const EOL_CHARACTER = {
	CR: '\r',
	LF: '\n',
	CRLF: '\r\n'
}

export class UDPServer extends EventEmitter {
	constructor(config, echoData) {
		super()
		this.config = config
		this.echoData = echoData
		this.udp = undefined
	}

	connect() {
		if (!this.config.host) {
			this.emit('status', 'bad_config')
			return
		}
		this.destroy()

		this.emit('status', 'connecting')

		this.udp = new UDPHelper(this.config.host, this.config.port)

		// Register emitter listeners
		this.udp.on('listening', () => {
			this.emit('status', 'ok')
		})

		this.udp.on('status_change', (status, message) => {
			this.emit('status', 'ok', message)
		})

		this.udp.on('error', (err) => {
			this.emit('status', 'connection_failure', err.message)
			serverLogger.error('Network error: ' + err.message)
			this.udp.close()
		})

		this.udp.on('message', (msg, dInfo) => {
			parse(msg.toString(), this.echoData)
		})
	}

	destroy() {
		if (this.udp) {
			this.udp.close()
			delete this.udp
		}
	}

	send(msg) {
		if (!this.udp) {
			sendLogger.error('Not connected to ECHO server!')
		}

		// Format and send UDP message to server
		console.log(this.config.EOL)
		// const sendBuf = Buffer.from(`${REQUEST_PREFIX}${msg}${EOL_CHARACTER[this.config.EOL]}`, 'latin1')
		const sendBuf = Buffer.from(`${REQUEST_PREFIX}${msg}\r`, 'latin1')
		sendLogger.debug(`sending ${sendBuf.toString()} to ${this.config.host}:${this.config.port}`)
		sendLogger.debug(`sending bytes: ${sendBuf.toString('hex')}`)
		this.udp.send(sendBuf, 0, sendBuf.length, this.config.port, this.config.host)
	}

	parse(dataResponse) {
		parseData(msg.toString(), this.echoData)
	}
}
