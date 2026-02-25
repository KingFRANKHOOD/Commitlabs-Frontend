import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/backend/rateLimit';
import { logCommitmentCreated } from '@/lib/backend/logger';

export async function POST(req: NextRequest) {
    // Get identifying key (IP address or user ID if authenticated)
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'anonymous';

    // Apply rate limiting check
    const isAllowed = await checkRateLimit(ip, 'api/commitments');

    if (!isAllowed) {
        return NextResponse.json(
            { error: 'Too many requests' },
            { status: 429 }
        );
    }

    // TODO: Implement commitment creation logic
    // e.g., interact with smart contract, store in database, etc.

    // analytics hook
    try {
        const body = await req.json();
        logCommitmentCreated({ ip, ...body });
    } catch (e) {
        // body might be empty or invalid; still log IP
        logCommitmentCreated({ ip, error: 'failed to parse request body' });
    }

    return NextResponse.json({
        message: 'Commitments creation endpoint stub - rate limiting applied',
        ip: ip
    });
}
