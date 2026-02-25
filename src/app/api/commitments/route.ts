import { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/backend/rateLimit';
import { withApiHandler } from '@/lib/backend/withApiHandler';
import { ok } from '@/lib/backend/apiResponse';
import { TooManyRequestsError } from '@/lib/backend/errors';
import { logInfo } from '@/lib/backend/logger';

export const POST = withApiHandler(async (req: NextRequest) => {
    const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'anonymous';

    const isAllowed = await checkRateLimit(ip, 'api/commitments');
    if (!isAllowed) {
        throw new TooManyRequestsError();
    }

    logInfo(req, 'Creating commitment', { ip });

    // TODO: validate request body, interact with Soroban smart contract,
    //       store commitment record in database, mint NFT, etc.

    return ok({ message: 'Commitment created successfully.' }, 201);
});