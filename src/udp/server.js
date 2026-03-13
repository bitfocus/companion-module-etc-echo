import dgram from 'node:dgram'
import { InstanceStatus, createModuleLogger } from '@companion-module/base'

// Make logger for UDP server
const udplogger = createModuleLogger('UDP Server')

export function createUDPServer(self) {
    self.updateStatus(InstanceStatus.Connecting)

    if (self.config.host) {
        self.udp = dgram.createSocket({ type: 'udp4', reuseAddr: true })
        self.udp.bind({ port: self.config.serverport, address: self.config.selfIP }, () => {
            self.updateStatus(InstanceStatus.Ok)
            udplogger.info('Listening for UDP packets on ' + self.config.serverport)
        })

        self.udp.on('error', (err) => {
            self.updateStatus(InstanceStatus.ConnectionFailure, err.message)
            udplogger.error('Network error: ' + err.message)

            self.udp.close()
        })

        // If we get data, thing should be good
        self.udp.on('listening', () => {
            self.updateStatus(InstanceStatus.Ok)
        })

        // Call when data gets received
        self.udp.on('message', (msg, dInfo) => {
            let dataResponse = msg.toString()
            self.spaceRegexCheck = new RegExp(String.raw`.+?(?=: +${self.config.space})`)

            if (self.spaceRegexCheck.test(dataResponse)) {
                switch (true) {
                    case /E>pst act:/.test(dataResponse):
                        // Expected data response: E>pst act: <space> <active preset>
                        // If active preset == 0, no preset is applied
                        udplogger.info('Preset data recieved')
                        let pstData = dataResponse.slice(11).split(', ')
                        self.EchoData.activePreset = pstData[1].replace(/(\r\n|\n|\r)/gm, '')

                        // Update variables in Companion
                        self.setVariableValues({
                            activePreset: self.EchoData.activePreset,
                        })

                        // Update feedbacks
                        self.checkFeedbacks('CheckInt', 'SpaceOff', 'ActivePreset')
                        break
                    case /E>space off:/.test(dataResponse):
                        // Expected data response: E>space off: <space> <truthy/falsy> (1 == truthy)
                        // Currently ignoring space data... assuming only using with one space
                        udplogger.info('Space off data recieved')
                        let offData = dataResponse.slice(13).split(', ')
                        self.EchoData.spaceOff = offData[1].replace(/(\r\n|\n|\r)/gm, '') === '1' ? true : false

                        // Update variables in Companion
                        self.setVariableValues({
                            spaceOff: self.EchoData.spaceOff,
                        })

                        // Update feedbacks
                        self.checkFeedbacks('CheckInt', 'SpaceOff', 'ActivePreset')
                        break
                    case /E>seq act:/.test(dataResponse):
                        udplogger.info('Sequence data recieved')
                        let seqData = dataResponse.slice(11).split(', ')
                        self.EchoData.activeSequence = seqData[1].replace(/(\r\n|\n|\r)/gm, '')

                        self.setVariableValues({
                            activeSequence: self.EchoData.activeSequence,
                        })
                        break
                    case /E>lok:/.test(dataResponse):
                        udplogger.info('Sync data recieved')
                        break
                    case /E>zone int:/.test(dataResponse):
                        // Zone intensity data
                        udplogger.info('Zone intensity data recieved')
                        let zoneData = dataResponse.split('E>zone int: ')
                        zoneData.shift() // First value in array should be blank
                        zoneData.forEach((zone) => {
                            let zRes = zone.split(', ')
                            self.EchoData.zonesInts[zRes[1] - 1] = zRes[2].replace(/(\r\n|\n|\r)/gm, '')
                        })

                        // Update variables in Companion
                        self.setVariableValues({
                            z1_int: self.EchoData.zonesInts[0],
                            z2_int: self.EchoData.zonesInts[1],
                            z3_int: self.EchoData.zonesInts[2],
                            z4_int: self.EchoData.zonesInts[3],
                            z5_int: self.EchoData.zonesInts[4],
                            z6_int: self.EchoData.zonesInts[5],
                            z7_int: self.EchoData.zonesInts[6],
                            z8_int: self.EchoData.zonesInts[7],
                            z9_int: self.EchoData.zonesInts[8],
                            z10_int: self.EchoData.zonesInts[9],
                            z11_int: self.EchoData.zonesInts[10],
                            z12_int: self.EchoData.zonesInts[11],
                            z13_int: self.EchoData.zonesInts[12],
                            z14_int: self.EchoData.zonesInts[13],
                            z15_int: self.EchoData.zonesInts[14],
                            z16_int: self.EchoData.zonesInts[15],
                        })

                        // Update feedbacks
                        self.checkFeedbacks('CheckInt', 'SpaceOff', 'ActivePreset')
                        break
                    default:
                        udplogger.info('Unexpected UDP data received')
                        break
                }
            }
        })

        self.udp.on('status_change', (status, message) => {
            self.updateStatus(status, message)
        })
    } else {
        self.updateStatus(InstanceStatus.BadConfig)
    }
}
