let sink = null
let buffer = []

function emit(level, ...args) {
    const message = args
        .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
        .join(' ')

    if (sink) {
        sink(level, message)
    } else {
        buffer.push({ level, message })
    }
}

/** Set up logger at init */
export function connect(loggerFn) {
    sink = loggerFn

    while (buffer.length) {
        const { level, message } = buffer.shift()
        sink(level, message)
    }
}

/** Shut down logger */
export function disconnect() {
    sink = null
    buffer = []
}

/** Logging method for core files */
export function logger(namespace) {
    return {
        debug: (...a) => emit('debug', `[${namespace}]`, ...a),
        info: (...a) => emit('info', `[${namespace}]`, ...a),
        warn: (...a) => emit('warn', `[${namespace}]`, ...a),
        error: (...a) => emit('error', `[${namespace}]`, ...a),
    }
}