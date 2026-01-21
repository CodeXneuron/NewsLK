/**
 * Free AI Image Generation using Pollinations.ai
 * No API key required, completely free
 */

/**
 * Generate an image using Pollinations.ai (FREE)
 * This is a free service with no rate limits or API keys needed
 */
export async function generateImageWithPollinations(prompt: string): Promise<string | null> {
    try {
        console.log('[Pollinations] Starting free image generation...');

        // Pollinations.ai uses a simple URL-based API
        // The image is generated on-demand when you request the URL
        const encodedPrompt = encodeURIComponent(prompt);

        // Generate a unique seed based on the prompt to ensure consistency
        const seed = Math.abs(hashCode(prompt));

        // Pollinations.ai URL format
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=675&seed=${seed}&nologo=true`;

        // Actually fetch the image to verify it's not a rate limit response
        const response = await fetch(imageUrl);

        if (!response.ok) {
            console.error('[Pollinations] Image generation failed:', response.status);
            return null;
        }

        // Check content length - rate limit images are typically small (~50-100KB)
        // Real generated images should be larger (>200KB)
        const contentLength = response.headers.get('content-length');
        if (contentLength && parseInt(contentLength) < 150000) {
            console.warn('[Pollinations] ⚠️ Rate limit detected (small image size). Trying next service...');
            return null;
        }

        // Additional check: verify it's actually an image
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.startsWith('image/')) {
            console.error('[Pollinations] Invalid content type:', contentType);
            return null;
        }

        console.log('[Pollinations] Image generated successfully (free!)');
        return imageUrl;

    } catch (error) {
        console.error('[Pollinations] Error generating image:', error);
        return null;
    }
}

/**
 * Generate an image using DeepAI (FREE with API key)
 * Free tier: 5 requests/second
 */
export async function generateImageWithDeepAI(prompt: string): Promise<string | null> {
    try {
        const apiKey = process.env.DEEPAI_API_KEY || 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K';

        console.log('[DeepAI] Starting free image generation...');

        const formData = new FormData();
        formData.append('text', prompt);

        const response = await fetch('https://api.deepai.org/api/text2img', {
            method: 'POST',
            headers: {
                'api-key': apiKey,
            },
            body: formData,
        });

        if (!response.ok) {
            console.error('[DeepAI] API error:', response.status);
            return null;
        }

        const data = await response.json();

        if (data.output_url) {
            console.log('[DeepAI] Image generated successfully');
            return data.output_url;
        }

        return null;

    } catch (error) {
        console.error('[DeepAI] Error generating image:', error);
        return null;
    }
}

/**
 * Generate an image using Craiyon (formerly DALL-E mini) - FREE
 */
export async function generateImageWithCraiyon(prompt: string): Promise<string | null> {
    try {
        console.log('[Craiyon] Starting free image generation (slow, ~60s)...');

        const response = await fetch('https://api.craiyon.com/v3', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                model: 'art', // Options: 'art', 'drawing', 'photo', 'none'
                negative_prompt: 'logo, watermark, text, signature, branding',
                version: 'c4ue22fb7kb6wlac',
            }),
        });

        if (!response.ok) {
            console.error('[Craiyon] API error:', response.status);
            return null;
        }

        const data = await response.json();

        if (data.images && data.images.length > 0) {
            // Craiyon returns base64 images
            const imageBase64 = data.images[0];
            const dataUrl = `data:image/jpeg;base64,${imageBase64}`;
            console.log('[Craiyon] Image generated successfully');
            return dataUrl;
        }

        return null;

    } catch (error) {
        console.error('[Craiyon] Error generating image:', error);
        return null;
    }
}

/**
 * Simple hash function for generating consistent seeds
 */
function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
}

/**
 * Main free image generation with fallback chain
 */
export async function generateImageFree(prompt: string): Promise<string | null> {
    console.log('[Free Image Generation] Starting with free services...');

    // Strategy 1: Pollinations.ai (instant, free, no API key)
    const pollinationsUrl = await generateImageWithPollinations(prompt);
    if (pollinationsUrl) return pollinationsUrl;

    console.log('[Free Image Generation] Pollinations failed, trying DeepAI...');

    // Strategy 2: DeepAI (fast, free tier)
    const deepAIUrl = await generateImageWithDeepAI(prompt);
    if (deepAIUrl) return deepAIUrl;

    console.log('[Free Image Generation] DeepAI failed, trying Craiyon...');

    // Strategy 3: Craiyon (slow but reliable)
    const craiyonUrl = await generateImageWithCraiyon(prompt);
    if (craiyonUrl) return craiyonUrl;

    console.error('[Free Image Generation] All free services failed');
    return null;
}
