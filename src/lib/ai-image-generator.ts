/**
 * AI Image Generation Service
 * Supports multiple providers with automatic fallback
 * Priority: FLUX.1-schnell (fast) -> FLUX.1-dev (quality) -> SDXL (fallback)
 */

interface ReplicateResponse {
    id: string;
    status: string;
    output?: string[] | string;
    error?: string;
    logs?: string;
}

/**
 * Generate an image using Replicate's FLUX.1-schnell (fast, cost-effective)
 */
export async function generateImageWithFLUXSchnell(prompt: string): Promise<string | null> {
    try {
        const apiToken = process.env.REPLICATE_API_KEY;

        if (!apiToken) {
            console.log('[FLUX Schnell] API key not configured');
            return null;
        }

        console.log('[FLUX Schnell] Starting image generation...');

        // FLUX.1-schnell - Fast generation (1-4 steps, ~$0.003 per image)
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${apiToken}`,
                'Content-Type': 'application/json',
                'Prefer': 'wait',
            },
            body: JSON.stringify({
                version: 'black-forest-labs/flux-schnell',
                input: {
                    prompt: prompt,
                    num_outputs: 1,
                    aspect_ratio: '16:9',
                    output_format: 'jpg',
                    output_quality: 90,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[FLUX Schnell] API error:', response.status, errorText);
            return null;
        }

        const prediction: ReplicateResponse = await response.json();

        // Poll for completion if not immediately ready
        const imageUrl = prediction.status === 'succeeded'
            ? extractImageUrl(prediction.output)
            : await pollForCompletion(prediction.id, apiToken, 30); // 30 second timeout for fast model

        if (imageUrl) {
            console.log('[FLUX Schnell] Image generated successfully');
        }

        return imageUrl;

    } catch (error) {
        console.error('[FLUX Schnell] Error generating image:', error);
        return null;
    }
}

/**
 * Generate an image using Replicate's FLUX.1-dev (higher quality)
 */
export async function generateImageWithFLUXDev(prompt: string): Promise<string | null> {
    try {
        const apiToken = process.env.REPLICATE_API_KEY;

        if (!apiToken) {
            console.log('[FLUX Dev] API key not configured');
            return null;
        }

        console.log('[FLUX Dev] Starting high-quality image generation...');

        // FLUX.1-dev - Higher quality (28 steps, ~$0.01 per image)
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                version: 'black-forest-labs/flux-dev',
                input: {
                    prompt: prompt,
                    num_outputs: 1,
                    aspect_ratio: '16:9',
                    output_format: 'jpg',
                    output_quality: 95,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[FLUX Dev] API error:', response.status, errorText);
            return null;
        }

        const prediction: ReplicateResponse = await response.json();
        const imageUrl = await pollForCompletion(prediction.id, apiToken, 120); // 2 minute timeout

        if (imageUrl) {
            console.log('[FLUX Dev] High-quality image generated successfully');
        }

        return imageUrl;

    } catch (error) {
        console.error('[FLUX Dev] Error generating image:', error);
        return null;
    }
}

/**
 * Generate an image using Replicate's Stable Diffusion XL (fallback)
 */
export async function generateImageWithReplicate(prompt: string): Promise<string | null> {
    try {
        const apiToken = process.env.REPLICATE_API_KEY;

        if (!apiToken) {
            console.log('[Replicate SDXL] API key not configured');
            return null;
        }

        console.log('[Replicate SDXL] Starting image generation (fallback)...');

        // Enhanced negative prompt to prevent logos and watermarks
        const negativePrompt = 'logo, watermark, text, signature, branding, hiru news, hirunews, hirunews.lk, company logo, brand mark, copyright, website url, news logo, channel logo, low quality, blurry, distorted, deformed';

        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
                input: {
                    prompt: prompt,
                    negative_prompt: negativePrompt,
                    width: 1216, // Closest to 16:9 that SDXL supports
                    height: 832,
                    num_outputs: 1,
                    guidance_scale: 7.5,
                    num_inference_steps: 40,
                    scheduler: 'DPMSolverMultistep',
                    refine: 'expert_ensemble_refiner',
                    high_noise_frac: 0.8,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Replicate SDXL] API error:', response.status, errorText);
            return null;
        }

        const prediction: ReplicateResponse = await response.json();
        const imageUrl = await pollForCompletion(prediction.id, apiToken, 120);

        if (imageUrl) {
            console.log('[Replicate SDXL] Image generated successfully');
        }

        return imageUrl;

    } catch (error) {
        console.error('[Replicate SDXL] Error generating image:', error);
        return null;
    }
}

/**
 * Poll Replicate API until image generation is complete
 */
async function pollForCompletion(
    predictionId: string,
    apiToken: string,
    timeoutSeconds: number = 120
): Promise<string | null> {
    const maxAttempts = Math.floor(timeoutSeconds / 2); // Poll every 2 seconds
    const pollInterval = 2000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));

        try {
            const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
                headers: {
                    'Authorization': `Token ${apiToken}`,
                },
            });

            if (!response.ok) {
                console.error(`[Polling] Failed to poll prediction: ${response.status}`);
                continue;
            }

            const prediction: ReplicateResponse = await response.json();

            if (prediction.status === 'succeeded' && prediction.output) {
                return extractImageUrl(prediction.output);
            }

            if (prediction.status === 'failed') {
                console.error('[Polling] Image generation failed:', prediction.error);
                return null;
            }

            if (prediction.status === 'canceled') {
                console.error('[Polling] Image generation was canceled');
                return null;
            }

            // Status is still 'starting' or 'processing', continue polling
            if (attempt % 5 === 0) {
                console.log(`[Polling] Still processing... (${attempt * 2}s elapsed)`);
            }

        } catch (error) {
            console.error('[Polling] Error during polling:', error);
            // Continue polling despite errors
        }
    }

    console.error('[Polling] Image generation timed out');
    return null;
}

/**
 * Extract image URL from Replicate output (handles both string and array formats)
 */
function extractImageUrl(output: string | string[] | undefined): string | null {
    if (!output) return null;

    if (typeof output === 'string') {
        return output;
    }

    if (Array.isArray(output) && output.length > 0) {
        return output[0];
    }

    return null;
}

/**
 * Alternative: Use Hugging Face Inference API (free tier available)
 */
export async function generateImageWithHuggingFace(prompt: string): Promise<string | null> {
    try {
        const apiToken = process.env.HUGGINGFACE_API_KEY;

        if (!apiToken) {
            console.log('[HuggingFace] API key not configured');
            return null;
        }

        console.log('[HuggingFace] Starting image generation...');

        const response = await fetch(
            'https://router.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        negative_prompt: 'logo, watermark, text, signature, branding, hiru news, low quality, blurry',
                        width: 1024,
                        height: 576,
                        num_inference_steps: 30,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[HuggingFace] API error:', response.status, errorText);
            return null;
        }

        // Response is the image blob
        const blob = await response.blob();

        // Convert blob to base64 for storage
        const buffer = await blob.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:image/png;base64,${base64}`;

        console.log('[HuggingFace] Image generated successfully');
        return dataUrl;

    } catch (error) {
        console.error('[HuggingFace] Error generating image:', error);
        return null;
    }
}

/**
 * Main entry point: Generate image with automatic fallback chain
 */
export async function generateImage(prompt: string, preferQuality: boolean = false): Promise<string | null> {
    console.log('[Image Generation] Starting with fallback chain...');

    // Strategy 1: Fast generation (FLUX Schnell) - default for most images
    if (!preferQuality) {
        const fluxSchnellUrl = await generateImageWithFLUXSchnell(prompt);
        if (fluxSchnellUrl) return fluxSchnellUrl;

        console.log('[Image Generation] FLUX Schnell failed, trying FLUX Dev...');
    }

    // Strategy 2: High quality (FLUX Dev) - for featured articles or if schnell failed
    const fluxDevUrl = await generateImageWithFLUXDev(prompt);
    if (fluxDevUrl) return fluxDevUrl;

    console.log('[Image Generation] FLUX Dev failed, trying Stable Diffusion XL...');

    // Strategy 3: Fallback to SDXL
    const sdxlUrl = await generateImageWithReplicate(prompt);
    if (sdxlUrl) return sdxlUrl;

    console.log('[Image Generation] SDXL failed, trying HuggingFace...');

    // Strategy 4: Last resort - HuggingFace (free tier)
    const hfUrl = await generateImageWithHuggingFace(prompt);
    if (hfUrl) return hfUrl;

    console.error('[Image Generation] All generation services failed');
    return null;
}

