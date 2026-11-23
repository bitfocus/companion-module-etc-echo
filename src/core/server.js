import dgram from 'node:dgram'
import { InstanceStatus } from '@companion-module/base'
import { setOff, setPreset, setSequence, setZone } from './state'

/* Parse int and shift to 0-based for state */
const toIdx = (v) => Math.max(0, (parseInt(v, 10) || 1) - 1)

export function createUDPServer(self) {
	self.updateStatus(InstanceStatus.Connecting)

	if (self.config.host) {
		self.udp = dgram.createSocket({ type: 'udp4', reuseAddr: true })
		self.udp.bind({ port: self.config.serverport, address: self.config.selfIP }, () => {
			self.updateStatus(InstanceStatus.Ok)
			self.log('info', 'Listening for UDP packets on ' + self.config.serverport)
		})

		self.udp.on('error', (err) => {
			self.updateStatus(InstanceStatus.ConnectionFailure, err.message)
			self.log('error', 'Network error: ' + err.message)

			self.udp.close()
		})

		// If we get data, thing should be good
		self.udp.on('listening', () => {
			self.updateStatus(InstanceStatus.Ok)
		})

		// Call when data gets received
		self.udp.on('message', (msg) => {
			const data = msg.toString()
			let m

			if (data.includes('E>zone int:')) {
				for (const chunk of data.split('E>zone int: ').slice(1)) {
					const [sp, zn, int] = chunk.split(',').map((s) => parseInt(s, 10))
					if (!isNaN(sp)) {
						setZone(self.EchoData, toIdx(sp), toIdx(zn), int & 0xFF)
					}
				}

				self.checkAllFeedbacks()
				self.log('info', 'Zone intensity data received')
				return
			}

			if ((m = data.match(/^E>pst act:\s*(\d+),\s*(.+?)\s*$/))) {
				setPreset(self.EchoData, toIdx(m[1]), m[2].trim())
				self.checkAllFeedbacks()
				self.log('info', 'Preset data received')
			} else if ((m = data.match(/^E>space off:\s*(\d+),\s*(\d)\s*$/))) {
				setOff(self.EchoData, toIdx(m[1]), m[2] === '1' ? 1 : 0)
				self.checkAllFeedbacks()
				self.log('info', 'Space off data received')
			} else if ((m = data.match(/^E>>seq act:\s*(\d+),\s*(\d+),\s*(\d+)\s*$/))) {
				setSequence(self.EchoData, toIdx(m[1]), toIdx(m[2]), parseInt(m[3], 10))
				self.checkAllFeedbacks()
				self.log('info', 'Sequence data received')
			} else if (data.startsWith('E>lok:')) {
				self.log('info', 'Sync data received')
			} else {
				self.log('info', 'Unexpected UDP data received')
			}
		})
	} else {
		self.updateStatus(InstanceStatus.BadConfig)
	}
}
