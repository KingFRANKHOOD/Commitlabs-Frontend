import { withApiHandler } from '@/lib/backend/withApiHandler';
import { ok } from '@/lib/backend/apiResponse';

export const GET = withApiHandler(async () => {
    const metrics = {
        status: 'up',
        uptime: process.uptime(),
        // TODO: replace mock counters with real instrumentation (e.g. Prometheus, Datadog)
        mock_requests_total: Math.floor(Math.random() * 1000),
        mock_errors_total: Math.floor(Math.random() * 10),
        timestamp: new Date().toISOString(),
    };

    return ok(metrics);
});