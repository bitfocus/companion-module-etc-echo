import { createModuleLogger } from '@companion-module/base'

const parseLogger = createModuleLogger('Parse')

const SPACE_NUM = /:\s*(\d+)/

/**
 * Parses a raw UDP packet from the Echo and updates echoData accordingly.
 * @param {string} dataResponse
 * @param {import('./echo-data').EchoData} echoData
 */
export function parseData(dataResponse, echoData) {
    const spaceMatch = SPACE_NUM.exec(dataResponse)
	const spaceNum = spaceMatch ? Number(spaceMatch[1]) : undefined

    // [regex, log label, setter]
    const handlers = [
        [/E>pst act:\s*\d+,\s*([^\r\n]+)/, 'Preset', echoData.setActivePreset],
        [/E>space off:\s*\d+,\s*([^\r\n]+)/, 'Space Off', (space, value) => echoData.setSpaceOff(space, value === '1')],
        [/E>seq act:\s*\d+,\s*([^\r\n]+)/, 'Sequence', echoData.setActiveSequence],
    ]

    for (const [regex, label, setter] of handlers) {
        const match = regex.exec(dataResponse)
        if (match) {
            parseLogger.info(`${label} data received`)
            setter.call(echoData, spaceNum, match[1])
            return
        }
    }

    if (/E>lok:/.test(dataResponse)) {
        parseLogger.info('Sync data received')
        return
    }

    const ZONE_INT = /E>zone int:\s*(\d+),\s*(\d+),\s*([^\r\n]+)/g
    const zoneMatches = [...dataResponse.matchAll(ZONE_INT)]
    if (zoneMatches.length > 0) {
        parseLogger.info('Zone intensity data received')
        for (const [, space, zone, value] of zoneMatches) {
            echoData.setZoneIntensity(Number(space), Number(zone), value)
        }
        return
    }

    parseLogger.warning('Unexpected UDP data received')
}