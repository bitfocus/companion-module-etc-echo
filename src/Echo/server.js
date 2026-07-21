import dgram from 'node:dgram'
import { InstanceStatus, createModuleLogger } from '@companion-module/base'
import { EventEmitter } from 'node:events'
import { parseData } from './parse.js'

const serverLogger = createModuleLogger('UDPServer')
const sendLogger = createModuleLogger('Send')
const parseLogger = createModuleLogger('Parse')

const REQUEST_PREFIX = "E$"
const EOL = {
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

		this.udp = dgram.createSocket({ type: 'udp4', reuseAddr: true })
		this.udp.bind({ port: this.config.serverport, address: this.config.selfIP }, () => {
			this.emit('status', 'ok')
			serverLogger.info('Listening for UDP packets on ' + this.config.serverport)
		})

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
			parseData(msg.toString())
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
		const sendBuf = Buffer.from(`${REQUEST_PREFIX}${msg}${EOL[this.config.EOL]}`, 'latin1')
		sendLogger.debug(`sending ${sendBuf.toString()} to ${this.config.host}:${this.config.port}`)
		this.udp.send(sendBuf, 0, sendBuf.length, this.config.port, this.config.host)
	}

	parse(dataResponse) {
		parseData(msg.toString(), this.echoData)
	}
}
