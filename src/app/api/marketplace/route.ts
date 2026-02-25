import { NextRequest } from 'next/server';
import { withApiHandler } from '@/lib/backend/withApiHandler';
import { ok } from '@/lib/backend/apiResponse';
import { logInfo } from '@/lib/backend/logger';

export const GET = withApiHandler(async (req: NextRequest) => {
    logInfo(req, 'Marketplace items requested');
    // TODO: Fetch marketplace items from database or smart contract
    return ok({ items: [] }, 200);
});
