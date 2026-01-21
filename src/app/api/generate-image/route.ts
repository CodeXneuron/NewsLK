import { NextRequest, NextResponse } from 'next/server';
import type { NewsCategory } from '@/types';
import { thumbnailStyles } from '@/lib/thumbnail-styles';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface GenerateImageRequest {
    articleId: string;
    title: string;
    category: NewsCategory;
    description?: string;
}

/**
 * POST /api/generate-image
 * Generate a custom branded image using AI
 */
export async function POST(request: NextRequest) {
    try {
        const body: GenerateImageRequest = await request.json();

        // Validate required fields
        if (!body.articleId || !body.title || !body.category) {
            return NextResponse.json(
                { error: 'Missing required fields: articleId, title, category' },
                { status: 400 }
            );
        }

        const style = thumbnailStyles[body.category];

        // Create a detailed prompt for image generation
        const prompt = `Create a professional, modern news thumbnail image for NewsLK (Sri Lankan news website).

Article: "${body.title.slice(0, 100)}"
Category: ${body.category}

Design Requirements:
- Style: ${style.style}
- Color Scheme: Vibrant ${style.colors[0]} and ${style.colors[1]} gradients
- Mood: ${style.mood}
- Layout: ${style.layout}
- Include "NewsLK" branding text in a modern font
- Add category badge in the corner
- Professional news media quality
- Clean, modern, attention-grabbing design
- 16:9 aspect ratio (1200x675px)
- High contrast for web display
- Incorporate Sri Lankan cultural elements subtly

The image should look professional, branded, and immediately convey the news category while being visually striking.`;

        // Return the prompt and metadata for now
        // In production, this would call an actual image generation service
        return NextResponse.json({
            success: true,
            prompt,
            articleId: body.articleId,
            category: body.category,
            style: style,
            message: 'Image generation endpoint ready. Connect to AI service for actual generation.',
        });

    } catch (error) {
        console.error('[API] Error in image generation:', error);

        return NextResponse.json(
            {
                error: 'Failed to process image generation request',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
