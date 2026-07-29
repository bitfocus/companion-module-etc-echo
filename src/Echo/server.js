import { UDPHelper, InstanceStatus, createModuleLogger } from '@companion-module/base'
import { EventEmitter } from 'node:events'
import { parseData } from './parse.js'

const serverLogger = createModuleLogger('UDPServer')
const sendLogger = createModuleLogger('Send')

const REQUEST_PREFIX = "E$"
const EOL_CHARACTER = {
	CR: '\r',
	LF: '\n',
	CRLF: '\r\n'
}

export class UDPServer extends EventEmitter {
	/**
     * @param {{ host: string, port: number, eol: 'CR' | 'LF' | 'CRLF' }} config
     * @param {import('./state').EchoInstance} echoData
     * @param {(host: string, port: number) => UDPHelper} [createSocket]
     *   Factory for the underlying socket. Defaults to the real UDPHelper;
     *   override in tests to inject a fake without opening real sockets.
     * @param {(dataResponse: string, echoData: object) => void} [parseFn]
     *   Defaults to the real parseData; override in tests to isolate
     *   UDPServer's own behavior from the parser's.
     */
	constructor(config, echoData, createSocket = (host, port) => new UDPHelper(host,port), parseFn = parseData) {
		super()
		this.config = config
		this.echoData = echoData
		this.createSocket = createSocket
		this.parseFn = parseFn
		this.udp = undefined
	}

	connect() {
		if (!this.config.host) {
			this.emit('status', 'bad_config')
			return
		}
		this.destroy()

		this.emit('status', 'connecting')

		this.udp = this.createSocket(this.config.host, this.config.port)

		// Register emitter listeners
		this.udp.on('listening', () => {
			this.emit('status', 'ok')
		})

		this.udp.on('status_change', (status, message) => {
			this.emit('status', status, message)
		})

		this.udp.on('error', (err) => {
			this.emit('status', 'connection_failure', err.message)
			serverLogger.error('Network error: ' + err.message)
			this.destroy()
		})

		this.udp.on('data', (msg) => {
			this.parseFn(msg.toString(), this.echoData)
		})
	}

	destroy() {
		if (this.udp) {
			this.udp.destroy()
			this.udp = undefined
		}
	}

	send(msg) {
		if (!this.udp) {
			sendLogger.error('Not connected to ECHO server!')
			return
		}

		// Format and send UDP message to server
		const sendBuf = Buffer.from(`${REQUEST_PREFIX}${msg}${EOL_CHARACTER[this.config.eol]}`, 'latin1')
		sendLogger.debug(`sending ${sendBuf.toString()} to ${this.config.host}:${this.config.port}`)
		sendLogger.debug(`sending bytes: ${sendBuf.toString('hex')}`)
		// this.udp.send(sendBuf, 0, sendBuf.length, this.config.port, this.config.host)
		this.udp.send(sendBuf)
	}
}
