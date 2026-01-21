import type { NewsCategory } from '@/types';
import { generateRecreationPrompt } from './image-analyzer';
import { getCachedThumbnail, saveThumbnail } from './thumbnail-cache';
import { thumbnailStyles } from './thumbnail-styles';

/**
 * Recreate an image with NewsLK branding
 * This is the main entry point for image recreation
 */
export async function recreateImage(
    originalImageUrl: string,
    articleId: string,
    title: string,
    category: NewsCategory
): Promise<string> {
    try {
        // Check cache first
        const cachedUrl = await getCachedThumbnail(articleId, category);
        if (cachedUrl) {
            console.log(`[Image Recreation] Using cached image for article ${articleId}`);
            return cachedUrl;
        }

        console.log(`[Image Recreation] Recreating image for article ${articleId}`);

        // Get category style
        const style = thumbnailStyles[category];

        // Method 1: Try AI recreation (if enabled and API available)
        const useAIRecreation = process.env.IMAGE_RECREATION_METHOD === 'ai-generation';

        if (useAIRecreation) {
            try {
                const recreatedUrl = await recreateWithAI(
                    originalImageUrl,
                    articleId,
                    title,
                    category,
                    style.colors
                );

                if (recreatedUrl) {
                    return recreatedUrl;
                }
            } catch (error) {
                console.error('[Image Recreation] AI recreation failed, falling back:', error);
            }
        }

        // Method 2: Fallback to overlay method
        // For now, we'll use the original image with a note to add overlay
        // The overlay will be added via client-side CSS or server-side image processing

        console.log(`[Image Recreation] Using original image with overlay for article ${articleId}`);
        return originalImageUrl;

    } catch (error) {
        console.error('[Image Recreation] Error recreating image:', error);
        return originalImageUrl; // Fallback to original
    }
}

/**
 * Recreate image using AI generation with Gemini analysis
 */
async function recreateWithAI(
    originalImageUrl: string,
    articleId: string,
    title: string,
    category: NewsCategory,
    categoryColors: string[]
): Promise<string | null> {
    try {
        // Import AI generator (free services only)
        const { generateImage } = await import('./ai-image-generator-simple');
        const { generateRecreationPrompt } = await import('./image-analyzer');

        console.log(`[AI Recreation] Starting recreation for article ${articleId}`);
        console.log(`[AI Recreation] Original image: ${originalImageUrl.substring(0, 80)}...`);

        // Generate recreation prompt based on Gemini image analysis
        const prompt = await generateRecreationPrompt(
            originalImageUrl,
            title,
            category,
            categoryColors
        );

        console.log(`[AI Recreation] Generated prompt (${prompt.length} chars)`);
        console.log(`[AI Recreation] Prompt preview: ${prompt.substring(0, 150)}...`);

        // Determine if this is a featured article (use higher quality)
        const preferQuality = category === 'Breaking News' || title.toLowerCase().includes('breaking');

        // Generate image with automatic fallback chain
        const generatedImageUrl = await generateImage(prompt, preferQuality);

        if (!generatedImageUrl) {
            console.log('[AI Recreation] All AI services failed or unavailable');
            return null;
        }

        console.log(`[AI Recreation] Image generated successfully`);

        // Save to Firebase Storage for permanent hosting
        try {
            // Convert URL/data URL to blob for storage
            let imageBlob: Blob;

            if (generatedImageUrl.startsWith('data:')) {
                // Data URL from Hugging Face
                const base64Data = generatedImageUrl.split(',')[1];
                const binaryData = atob(base64Data);
                const bytes = new Uint8Array(binaryData.length);
                for (let i = 0; i < binaryData.length; i++) {
                    bytes[i] = binaryData.charCodeAt(i);
                }
                imageBlob = new Blob([bytes], { type: 'image/png' });
            } else {
                // Regular URL from Replicate
                const imageResponse = await fetch(generatedImageUrl);
                if (!imageResponse.ok) {
                    throw new Error(`Failed to fetch generated image: ${imageResponse.status}`);
                }
                imageBlob = await imageResponse.blob();
            }

            // Save and get permanent URL
            const savedUrl = await saveThumbnail(articleId, category, imageBlob);

            console.log(`[AI Recreation] Successfully saved to Firebase Storage`);
            console.log(`[AI Recreation] Cached URL: ${savedUrl.substring(0, 80)}...`);

            return savedUrl;

        } catch (storageError) {
            console.error('[AI Recreation] Failed to save to Firebase Storage:', storageError);
            console.log('[AI Recreation] Using temporary generated URL');

            // Return the generated URL even if storage fails
            // (it will be temporary but still usable)
            return generatedImageUrl;
        }

    } catch (error) {
        console.error('[AI Recreation] Error:', error);
        return null;
    }
}

/**
 * Batch recreate images for multiple articles
 */
export async function batchRecreateImages(
    articles: Array<{
        id: string;
        title: string;
        category: NewsCategory;
        originalImageUrl: string;
    }>
): Promise<Map<string, string>> {
    const results = new Map<string, string>();

    // Process in batches to avoid overwhelming the API
    const BATCH_SIZE = 3;

    for (let i = 0; i < articles.length; i += BATCH_SIZE) {
        const batch = articles.slice(i, i + BATCH_SIZE);

        const promises = batch.map(async (article) => {
            try {
                const url = await recreateImage(
                    article.originalImageUrl,
                    article.id,
                    article.title,
                    article.category
                );
                results.set(article.id, url);
            } catch (error) {
                console.error(`[Batch Recreation] Error for article ${article.id}:`, error);
                results.set(article.id, article.originalImageUrl);
            }
        });

        await Promise.all(promises);

        // Small delay between batches to respect rate limits
        if (i + BATCH_SIZE < articles.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return results;
}

/**
 * Check if image recreation is enabled
 */
export function isImageRecreationEnabled(): boolean {
    return process.env.NEXT_PUBLIC_USE_IMAGE_RECREATION === 'true';
}

/**
 * Get recreation method
 */
export function getRecreationMethod(): 'overlay' | 'ai-generation' | 'none' {
    const method = process.env.IMAGE_RECREATION_METHOD;

    if (method === 'ai-generation') return 'ai-generation';
    if (method === 'overlay') return 'overlay';

    return 'none';
}
