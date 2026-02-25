import { NextResponse } from 'next/server';

export interface ApiSuccess<T> {
    success: true;
    data: T;
}

export interface ApiError {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Returns a standard JSON success response.
 */
export function ok<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
    return NextResponse.json({ success: true, data }, { status });
}

/**
 * Returns a standard JSON error response.
 */
export function fail(
    message: string,
    code = 'INTERNAL_ERROR',
    status = 500,
    details?: unknown
): NextResponse<ApiError> {
    return NextResponse.json(
        {
            success: false,
            error: { code, message, ...(details !== undefined ? { details } : {}) },
        },
        { status }
    );
}