import { test, describe, mock, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { UDPServer } from '../Echo/server.js'

// A fake stand-in for UDPHelper: a real EventEmitter (so .on()/.emit() work
// exactly like the real socket) with send/destroy replaced by mock.fn()
// so we can assert on how they were called, without opening a real socket.
function createFakeSocket() {
	const socket = new EventEmitter()
	socket.send = mock.fn()
	socket.destroy = mock.fn()
	return socket
}

describe('UDPServer', () => {
	let echoData
	let fakeSocket
	let createSocket
	let parseFn
	let server

	beforeEach(() => {
		echoData = { fake: 'echoData' }
		fakeSocket = createFakeSocket()
		createSocket = mock.fn(() => fakeSocket)
		parseFn = mock.fn()
		server = new UDPServer({ host: '127.0.0.1', port: 9703, eol: 'CRLF' }, echoData, createSocket, parseFn)
	})

	describe('connect', () => {
		test('emits bad_config and never creates a socket when host is missing', () => {
			const badServer = new UDPServer({ host: '', port: 9703, eol: 'CRLF' }, echoData, createSocket, parseFn)
			const statusListener = mock.fn()
			badServer.on('status', statusListener)

			badServer.connect()

			assert.deepEqual(statusListener.mock.calls[0].arguments, ['bad_config'])
			assert.equal(createSocket.mock.callCount(), 0)
		})

		test('emits connecting, then creates a socket via the factory with host/port', () => {
			const statusListener = mock.fn()
			server.on('status', statusListener)

			server.connect()

			assert.equal(statusListener.mock.calls[0].arguments[0], 'connecting')
			assert.equal(createSocket.mock.callCount(), 1)
			assert.deepEqual(createSocket.mock.calls[0].arguments, ['127.0.0.1', 9703])
		})

		test('emits "ok" status when the socket starts listening', () => {
			const statusListener = mock.fn()
			server.on('status', statusListener)
			server.connect()

			fakeSocket.emit('listening')

			const okCall = statusListener.mock.calls.find((c) => c.arguments[0] === 'ok')
			assert.ok(okCall, 'expected an "ok" status to have been emitted')
		})

		test('forwards status_change with its real status and message (not hardcoded)', () => {
			const statusListener = mock.fn()
			server.on('status', statusListener)
			server.connect()

			fakeSocket.emit('status_change', 'unknown_error', 'weird device state')

			const forwarded = statusListener.mock.calls.find((c) => c.arguments[0] === 'unknown_error')
			assert.ok(forwarded, 'expected status_change status to be forwarded verbatim, not hardcoded to ok')
			assert.equal(forwarded.arguments[1], 'weird device state')
		})

		test('on socket error: emits connection_failure with the error message and destroys the socket', () => {
			const statusListener = mock.fn()
			server.on('status', statusListener)
			server.connect()

			fakeSocket.emit('error', new Error('boom'))

			const failure = statusListener.mock.calls.find((c) => c.arguments[0] === 'connection_failure')
			assert.ok(failure)
			assert.equal(failure.arguments[1], 'boom')
			assert.equal(fakeSocket.destroy.mock.callCount(), 1)
			assert.equal(server.udp, undefined)
		})

		test('incoming data is decoded and handed to the parse function with echoData', () => {
			server.connect()

			fakeSocket.emit('data', Buffer.from('E>lok: 1\r\n'))

			assert.equal(parseFn.mock.callCount(), 1)
			const [decoded, passedEchoData] = parseFn.mock.calls[0].arguments
			assert.equal(decoded, 'E>lok: 1\r\n')
			assert.equal(passedEchoData, echoData)
		})

		test('a second connect() call destroys the previous socket before creating a new one', () => {
			server.connect()
			const firstSocket = fakeSocket

			const secondSocket = createFakeSocket()
			createSocket.mock.mockImplementationOnce(() => secondSocket)

			server.connect()

			assert.equal(firstSocket.destroy.mock.callCount(), 1)
			assert.equal(server.udp, secondSocket)
		})
	})

	describe('destroy', () => {
		test('does nothing and does not throw if never connected', () => {
			assert.doesNotThrow(() => server.destroy())
		})

		test('calls the socket\'s destroy and clears the reference', () => {
			server.connect()

			server.destroy()

			assert.equal(fakeSocket.destroy.mock.callCount(), 1)
			assert.equal(server.udp, undefined)
		})
	})

	describe('send', () => {
		test('logs and does not throw when not connected, and does not call socket.send', () => {
			assert.doesNotThrow(() => server.send('zone int: 1, 1, 50'))
			assert.equal(fakeSocket.send.mock.callCount(), 0)
		})

		test('sends a correctly framed buffer once connected', () => {
			server.connect()

			server.send('zone int: 1, 1, 50')

			assert.equal(fakeSocket.send.mock.callCount(), 1)
			const [sentBuf] = fakeSocket.send.mock.calls[0].arguments
			assert.ok(Buffer.isBuffer(sentBuf), 'expected a Buffer to be sent')
			assert.equal(sentBuf.toString('latin1'), 'E$zone int: 1, 1, 50\r\n')
		})

		test('uses the CR EOL when configured', () => {
			const crServer = new UDPServer({ host: '127.0.0.1', port: 9703, eol: 'CR' }, echoData, createSocket, parseFn)
			crServer.connect()

			crServer.send('lok: 1')

			const [sentBuf] = fakeSocket.send.mock.calls[0].arguments
			assert.equal(sentBuf.toString('latin1'), 'E$lok: 1\r')
		})

		test('uses the LF EOL when configured', () => {
			const lfServer = new UDPServer({ host: '127.0.0.1', port: 9703, eol: 'LF' }, echoData, createSocket, parseFn)
			lfServer.connect()

			lfServer.send('lok: 1')

			const [sentBuf] = fakeSocket.send.mock.calls[0].arguments
			assert.equal(sentBuf.toString('latin1'), 'E$lok: 1\n')
		})
	})
})