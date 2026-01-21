import { NextRequest, NextResponse } from 'next/server';
import { recreateImage } from '@/lib/image-recreator';
import { analyzeImage } from '@/lib/image-analyzer';
import type { NewsCategory } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RecreateImageRequest {
    originalImageUrl: string;
    articleId: string;
    title: string;
    category: NewsCategory;
}

/**
 * POST /api/recreate-image
 * Recreate an image with NewsLK branding using Gemini + AI generation
 */
export async function POST(request: NextRequest) {
    try {
        const body: RecreateImageRequest = await request.json();

        // Validate required fields
        if (!body.originalImageUrl || !body.articleId || !body.title || !body.category) {
            return NextResponse.json(
                { error: 'Missing required fields: originalImageUrl, articleId, title, category' },
                { status: 400 }
            );
        }

        console.log(`[API] Starting image recreation for article: ${body.articleId}`);
        console.log(`[API] Original image: ${body.originalImageUrl.substring(0, 80)}...`);

        const startTime = Date.now();

        // Recreate the image using the Gemini-based pipeline
        const recreatedUrl = await recreateImage(
            body.originalImageUrl,
            body.articleId,
            body.title,
            body.category
        );

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        const durationNum = (Date.now() - startTime) / 1000;

        console.log(`[API] Recreation completed in ${duration}s`);

        return NextResponse.json({
            success: true,
            originalUrl: body.originalImageUrl,
            recreatedUrl,
            method: process.env.IMAGE_RECREATION_METHOD || 'overlay',
            processingTime: `${duration}s`,
            cached: durationNum < 1, // If very fast, it was likely cached
            articleId: body.articleId,
            category: body.category,
        });

    } catch (error) {
        console.error('[API] Error recreating image:', error);

        return NextResponse.json(
            {
                error: 'Failed to recreate image',
                message: error instanceof Error ? error.message : 'Unknown error',
                details: 'Check server logs for more information'
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/recreate-image/analyze
 * Analyze an image without recreating it
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const imageUrl = searchParams.get('imageUrl');

        if (!imageUrl) {
            return NextResponse.json(
                { error: 'Missing required query parameter: imageUrl' },
                { status: 400 }
            );
        }

        // Analyze the image
        const analysis = await analyzeImage(imageUrl);

        return NextResponse.json({
            success: true,
            imageUrl,
            analysis,
        });

    } catch (error) {
        console.error('[API] Error analyzing image:', error);

        return NextResponse.json(
            {
                error: 'Failed to analyze image',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
