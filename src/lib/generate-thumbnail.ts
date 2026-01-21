import type { NewsCategory } from '@/types';
import { generateThumbnailPrompt, getSimplifiedPrompt } from '@/lib/thumbnail-styles';
import { getCachedThumbnail, saveThumbnail } from '@/lib/thumbnail-cache';

/**
 * Generate a custom thumbnail for a news article
 * This function uses AI to create branded thumbnails
 */
export async function generateThumbnail(
    articleId: string,
    title: string,
    category: NewsCategory,
    description?: string,
    originalImageUrl?: string
): Promise<string> {
    try {
        // Check cache first
        const cachedUrl = await getCachedThumbnail(articleId, category);
        if (cachedUrl) {
            return cachedUrl;
        }

        console.log(`[Thumbnail Generation] Generating thumbnail for article: ${articleId}`);

        // Generate the prompt
        const prompt = getSimplifiedPrompt(title, category);

        // For now, we'll use a fallback approach since direct image generation
        // requires additional setup. We'll create a placeholder that can be
        // replaced with actual AI-generated images later.

        // Option 1: Use original image as fallback
        if (originalImageUrl) {
            console.log(`[Thumbnail Generation] Using original image as fallback for: ${articleId}`);
            return originalImageUrl;
        }

        // Option 2: Use category-based placeholder
        const placeholderUrl = getCategoryPlaceholder(category);
        console.log(`[Thumbnail Generation] Using category placeholder for: ${articleId}`);
        return placeholderUrl;

    } catch (error) {
        console.error('[Thumbnail Generation] Error generating thumbnail:', error);

        // Fallback to original image or placeholder
        if (originalImageUrl) {
            return originalImageUrl;
        }

        return getCategoryPlaceholder(category);
    }
}

/**
 * Get a category-specific placeholder image
 * These are high-quality placeholders that match the category theme
 */
function getCategoryPlaceholder(category: NewsCategory): string {
    const placeholders: Record<NewsCategory, string> = {
        'Breaking News': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
        'Politics': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop',
        'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
        'Business': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
        'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
        'Entertainment': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
        'Local News': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop',
        'Lifestyle': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop',
        'International': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=600&fit=crop',
    };

    return placeholders[category] || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop';
}

/**
 * Generate thumbnail with external AI service
 * This is a placeholder for future implementation with actual AI image generation
 */
async function generateWithAI(prompt: string): Promise<Blob | null> {
    // TODO: Implement actual AI image generation
    // Options:
    // 1. Use Replicate API with Stable Diffusion
    // 2. Use OpenAI DALL-E API
    // 3. Use other image generation services

    console.log('[AI Generation] AI image generation not yet implemented');
    return null;
}

/**
 * Batch generate thumbnails for multiple articles
 */
export async function batchGenerateThumbnails(
    articles: Array<{
        id: string;
        title: string;
        category: NewsCategory;
        description?: string;
        originalImageUrl?: string;
    }>
): Promise<Map<string, string>> {
    const results = new Map<string, string>();

    // Process articles in parallel with a limit
    const BATCH_SIZE = 5;
    for (let i = 0; i < articles.length; i += BATCH_SIZE) {
        const batch = articles.slice(i, i + BATCH_SIZE);

        const promises = batch.map(async (article) => {
            try {
                const url = await generateThumbnail(
                    article.id,
                    article.title,
                    article.category,
                    article.description,
                    article.originalImageUrl
                );
                results.set(article.id, url);
            } catch (error) {
                console.error(`Error generating thumbnail for article ${article.id}:`, error);
                if (article.originalImageUrl) {
                    results.set(article.id, article.originalImageUrl);
                }
            }
        });

        await Promise.all(promises);
    }

    return results;
}
