import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    requestId?: string;
    context?: Record<string, unknown>;
    error?: {
        name: string;
        message: string;
        stack?: string;
    };
}

const requestIds = new WeakMap<Request | NextRequest, string>();

export function getRequestId(req?: Request | NextRequest): string {
    if (!req) return randomUUID();
    let rid = req.headers.get('x-request-id');
    if (rid) return rid;

    rid = requestIds.get(req);
    if (!rid) {
        rid = randomUUID();
        requestIds.set(req, rid);
    }
    return rid;
}

function formatEntry(entry: LogEntry): string {
    return JSON.stringify(entry);
}

function createLogEntry(
    level: LogLevel,
    req: Request | NextRequest | undefined | string,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
): LogEntry {
    let requestId: string | undefined;
    if (typeof req === 'string') {
        requestId = req;
    } else if (req) {
        requestId = getRequestId(req);
    }

    const entry: LogEntry = {
        level,
        message,
        timestamp: new Date().toISOString(),
        requestId,
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

export function logInfo(req: Request | NextRequest | undefined | string, message: string, context?: Record<string, unknown>): void {
    const entry = createLogEntry('info', req, message, context);
    console.log(formatEntry(entry));
}

export function logWarn(req: Request | NextRequest | undefined | string, message: string, context?: Record<string, unknown>): void {
    const entry = createLogEntry('warn', req, message, context);
    console.warn(formatEntry(entry));
}

export function logError(req: Request | NextRequest | undefined | string, message: string, error?: Error, context?: Record<string, unknown>): void {
    const entry = createLogEntry('error', req, message, context, error);
    console.error(formatEntry(entry));
}

export function logDebug(req: Request | NextRequest | undefined | string, message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
        const entry = createLogEntry('debug', req, message, context);
        console.debug(formatEntry(entry));
    }
}