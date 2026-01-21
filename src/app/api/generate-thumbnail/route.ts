import { NextRequest, NextResponse } from 'next/server';
import { generateThumbnail } from '@/lib/generate-thumbnail';
import type { NewsCategory } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ThumbnailRequest {
    articleId: string;
    title: string;
    category: NewsCategory;
    description?: string;
    originalImageUrl?: string;
}

/**
 * POST /api/generate-thumbnail
 * Generate a custom AI thumbnail for a news article
 */
export async function POST(request: NextRequest) {
    try {
        const body: ThumbnailRequest = await request.json();

        // Validate required fields
        if (!body.articleId || !body.title || !body.category) {
            return NextResponse.json(
                { error: 'Missing required fields: articleId, title, category' },
                { status: 400 }
            );
        }

        // Generate the thumbnail
        const thumbnailUrl = await generateThumbnail(
            body.articleId,
            body.title,
            body.category,
            body.description,
            body.originalImageUrl
        );

        return NextResponse.json({
            success: true,
            thumbnailUrl,
            cached: true, // For now, we're using fallbacks
        });

    } catch (error) {
        console.error('[API] Error generating thumbnail:', error);

        return NextResponse.json(
            {
                error: 'Failed to generate thumbnail',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/generate-thumbnail?articleId=xxx
 * Get a cached thumbnail or generate a new one
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const articleId = searchParams.get('articleId');
        const title = searchParams.get('title');
        const category = searchParams.get('category') as NewsCategory;
        const originalImageUrl = searchParams.get('originalImageUrl');

        if (!articleId || !title || !category) {
            return NextResponse.json(
                { error: 'Missing required query parameters: articleId, title, category' },
                { status: 400 }
            );
        }

        const thumbnailUrl = await generateThumbnail(
            articleId,
            title,
            category,
            undefined,
            originalImageUrl || undefined
        );

        return NextResponse.json({
            success: true,
            thumbnailUrl,
        });

    } catch (error) {
        console.error('[API] Error generating thumbnail:', error);

        return NextResponse.json(
            {
                error: 'Failed to generate thumbnail',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
