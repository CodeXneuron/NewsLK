import { NextResponse } from 'next/server';
import { getQueueStatus } from '@/lib/recreation-queue';

export const dynamic = 'force-dynamic';

/**
 * GET /api/recreation-queue/status
 * Get the current status of the image recreation queue
 */
export async function GET() {
    try {
        const status = getQueueStatus();

        return NextResponse.json({
            success: true,
            queue: status,
            message: status.processing > 0
                ? `Processing ${status.processing} image(s), ${status.pending} in queue`
                : status.pending > 0
                    ? `${status.pending} image(s) queued for recreation`
                    : 'Queue is empty',
        });
    } catch (error) {
        console.error('[API] Error getting queue status:', error);

        return NextResponse.json(
            {
                error: 'Failed to get queue status',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
