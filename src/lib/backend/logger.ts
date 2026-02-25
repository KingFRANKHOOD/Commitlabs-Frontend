type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: Record<string, unknown>;
    error?: {
        name: string;
        message: string;
        stack?: string;
    };
}

function formatEntry(entry: LogEntry): string {
    return JSON.stringify(entry);
}

function createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
): LogEntry {
    const entry: LogEntry = {
        level,
        message,
        timestamp: new Date().toISOString(),
    };

    if (context) entry.context = context;

    if (error) {
        entry.error = {
            name: error.name,
            message: error.message,
            stack: error.stack,
        };
    }

    return entry;
}

export const logger = {
    info(message: string, context?: Record<string, unknown>): void {
        const entry = createLogEntry('info', message, context);
        console.log(formatEntry(entry));
    },

    warn(message: string, context?: Record<string, unknown>): void {
        const entry = createLogEntry('warn', message, context);
        console.warn(formatEntry(entry));
    },

    error(message: string, error?: Error, context?: Record<string, unknown>): void {
        const entry = createLogEntry('error', message, context, error);
        console.error(formatEntry(entry));
    },

    debug(message: string, context?: Record<string, unknown>): void {
        if (process.env.NODE_ENV === 'development') {
            const entry = createLogEntry('debug', message, context);
            console.debug(formatEntry(entry));
        }
    },
};