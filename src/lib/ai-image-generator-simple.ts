/**
 * AI Image Generation Service
 * Supports multiple providers with automatic fallback
 * Priority: FREE services -> FLUX -> SDXL -> HuggingFace
 */

// Import free services
import { generateImageFree } from './free-image-generator';

interface ReplicateResponse {
    id: string;
    status: string;
    output?: string[] | string;
    error?: string;
    logs?: string;
}

/**
 * Main entry point: Generate image with automatic fallback chain
 * Now prioritizes FREE services first!
 */
export async function generateImage(prompt: string, preferQuality: boolean = false): Promise<string | null> {
    console.log('[Image Generation] Starting with FREE services first...');

    // Strategy 1: Try FREE services first (Pollinations, DeepAI, Craiyon)
    try {
        const freeUrl = await generateImageFree(prompt);
        if (freeUrl) {
            console.log('[Image Generation] ✅ Generated with FREE service!');
            return freeUrl;
        }
    } catch (error) {
        console.error('[Image Generation] Free services error:', error);
    }

    console.log('[Image Generation] Free services failed, using original image...');

    // For now, just return null to use original image
    // Paid services are disabled until payment method is added
    return null;
}

// Export the function for backward compatibility
export { generateImageFree };
