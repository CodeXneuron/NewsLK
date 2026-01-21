import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Initialize Gemini API client
 */
let genAI: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
    if (!genAI) {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not configured in environment variables');
        }

        genAI = new GoogleGenerativeAI(apiKey);
    }

    return genAI;
}

/**
 * Generate an image using Gemini's Imagen model
 */
export async function generateImage(prompt: string): Promise<string> {
    try {
        const client = getGeminiClient();

        // Use Gemini's image generation model (Imagen)
        const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Note: As of now, Gemini API primarily focuses on text generation
        // For actual image generation, we'll need to use a different approach
        // This is a placeholder for when Imagen becomes available via API

        // For now, we'll return a generated placeholder or use an alternative service
        throw new Error('Image generation via Gemini API is not yet available. Please use alternative method.');

    } catch (error) {
        console.error('Error generating image with Gemini:', error);
        throw error;
    }
}

/**
 * Generate image description/analysis using Gemini
 * This can be used to create better prompts for image generation services
 */
export async function analyzeImagePrompt(
    title: string,
    description: string,
    category: string
): Promise<string> {
    try {
        const client = getGeminiClient();
        const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a professional graphic designer creating thumbnail images for a news website.
    
Article Details:
- Title: ${title}
- Description: ${description}
- Category: ${category}

Generate a detailed, professional image generation prompt that would create an eye-catching, branded news thumbnail. 
The prompt should specify:
1. Visual composition and layout
2. Color scheme matching the category
3. Key visual elements or symbols
4. Typography style
5. Mood and atmosphere
6. Technical specifications (aspect ratio, quality)

Keep the prompt concise but comprehensive (under 200 words).`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error('Error analyzing image prompt with Gemini:', error);
        throw error;
    }
}
