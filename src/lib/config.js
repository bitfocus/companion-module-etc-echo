import { getNetworkInterfaces } from "./utilities.js"

const interfaceList = getNetworkInterfaces()

// Return config fields for web config
export function GetConfigFields () {
    return [
        {
            type: 'static-text',
            id: 'info',
            width: 12,
            label: 'Information',
            value:
                'This module is configured to only control one Echo "Space" at a time, ' +
                'due to the sheer number of parameters required to track all 16 available ' +
                'spaces. The ability to receive feedbacks from multiple modules in parallel does not currently work.',
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
            choices: interfaceList,
            default: interfaceList[0].id,
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