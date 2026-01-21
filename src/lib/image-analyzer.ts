import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Analyze an image using Gemini Vision API
 * Returns a detailed description of the image content
 */
export async function analyzeImage(imageUrl: string): Promise<string> {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        // Fetch the image
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        const imageBase64 = Buffer.from(imageBuffer).toString('base64');

        // Create the prompt for image analysis
        const prompt = `Analyze this news image and provide a detailed description. Focus on:
1. Main subject or scene
2. Key people, objects, or events shown
3. Setting or location
4. Mood or atmosphere
5. Important visual elements

Provide a concise but comprehensive description in 2-3 sentences that could be used to recreate a similar image.`;

        // Generate content with image
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: imageBase64,
                },
            },
        ]);

        const response = await result.response;
        const description = response.text();

        console.log(`[Image Analysis] Analyzed image: ${imageUrl.substring(0, 50)}...`);
        console.log(`[Image Analysis] Description: ${description}`);

        return description;

    } catch (error) {
        console.error('[Image Analysis] Error analyzing image:', error);

        // Fallback: return a generic description based on URL
        return 'News article image showing relevant content';
    }
}

/**
 * Analyze image specifically for recreation purposes
 * Provides detailed scene analysis for AI image generation
 */
export async function analyzeImageForRecreation(imageUrl: string): Promise<{
    sceneDescription: string;
    subjects: string[];
    composition: string;
    lighting: string;
    mood: string;
    colors: string[];
    hasWatermark: boolean;
    watermarkLocation?: string;
}> {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

        // Fetch the image
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        const imageBase64 = Buffer.from(imageBuffer).toString('base64');

        // Enhanced prompt for detailed recreation analysis
        const prompt = `Analyze this news image in detail for recreation purposes. Provide a structured analysis:

1. SCENE DESCRIPTION: Describe the main scene, subject, and what's happening (2-3 sentences, ignore any logos/watermarks)
2. SUBJECTS: List the key people, objects, or elements (comma-separated)
3. COMPOSITION: Describe the framing, layout, and positioning of elements
4. LIGHTING: Describe the lighting conditions (natural/artificial, direction, quality)
5. MOOD: Describe the overall atmosphere and emotional tone
6. COLORS: List the 3-5 dominant colors in the image
7. WATERMARK: Does this image have any logos, watermarks, or branding? If yes, where are they located?

Format your response as JSON:
{
  "sceneDescription": "...",
  "subjects": ["...", "..."],
  "composition": "...",
  "lighting": "...",
  "mood": "...",
  "colors": ["...", "..."],
  "hasWatermark": true/false,
  "watermarkLocation": "bottom-right" or "top-left" etc.
}`;

        // Generate content with image
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: imageBase64,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Try to parse JSON response
        try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
            const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
            const analysis = JSON.parse(jsonText);

            console.log(`[Image Analysis] Detailed analysis complete for: ${imageUrl.substring(0, 50)}...`);

            return {
                sceneDescription: analysis.sceneDescription || '',
                subjects: Array.isArray(analysis.subjects) ? analysis.subjects : [],
                composition: analysis.composition || '',
                lighting: analysis.lighting || '',
                mood: analysis.mood || '',
                colors: Array.isArray(analysis.colors) ? analysis.colors : [],
                hasWatermark: analysis.hasWatermark || false,
                watermarkLocation: analysis.watermarkLocation,
            };
        } catch (parseError) {
            console.warn('[Image Analysis] Failed to parse JSON, using text analysis:', parseError);

            // Fallback: extract information from text
            return {
                sceneDescription: text.substring(0, 200),
                subjects: [],
                composition: '',
                lighting: '',
                mood: '',
                colors: [],
                hasWatermark: text.toLowerCase().includes('watermark') || text.toLowerCase().includes('logo'),
                watermarkLocation: text.toLowerCase().includes('bottom') ? 'bottom-right' : undefined,
            };
        }

    } catch (error) {
        console.error('[Image Analysis] Error analyzing image for recreation:', error);

        // Return minimal fallback data
        return {
            sceneDescription: 'News article image',
            subjects: [],
            composition: '',
            lighting: '',
            mood: '',
            colors: [],
            hasWatermark: false,
        };
    }
}

/**
 * Generate a recreation prompt based on detailed image analysis
 */
export async function generateRecreationPrompt(
    imageUrl: string,
    title: string,
    category: string,
    categoryColors: string[]
): Promise<string> {
    try {
        // Get detailed analysis
        const analysis = await analyzeImageForRecreation(imageUrl);

        // Build a comprehensive recreation prompt
        const prompt = `Create a professional news photograph for a Sri Lankan news website.

SCENE TO RECREATE:
${analysis.sceneDescription}

KEY ELEMENTS:
- Main subjects: ${analysis.subjects.length > 0 ? analysis.subjects.join(', ') : 'news-related content'}
- Composition: ${analysis.composition || 'professional news photography framing'}
- Lighting: ${analysis.lighting || 'natural, well-lit'}
- Mood: ${analysis.mood || 'professional and informative'}
- Color palette: ${analysis.colors.length > 0 ? analysis.colors.join(', ') : categoryColors.join(', ')}

ARTICLE CONTEXT:
- Title: "${title}"
- Category: ${category}

REQUIREMENTS:
- Style: Professional photojournalism, high-quality news media
- NO logos, watermarks, or text overlays
- Clean, professional composition
- Sharp focus, high detail
- Aspect ratio: 16:9 (landscape)
- Lighting: ${analysis.lighting || 'natural and balanced'}
- Maintain the same subject matter and scene as described above
- Professional news photography aesthetic

Create a realistic, professional news photograph that captures the essence of the scene described above.`;

        console.log(`[Recreation Prompt] Generated prompt for: ${title.substring(0, 50)}...`);
        return prompt;

    } catch (error) {
        console.error('[Recreation Prompt] Error generating prompt:', error);

        // Fallback prompt
        return `Professional news photograph for "${title}" in ${category} category. High-quality photojournalism style, 16:9 aspect ratio, no watermarks or logos. ${categoryColors.length > 0 ? `Color palette: ${categoryColors.join(', ')}.` : ''} Realistic, professional news media quality.`;
    }
}

/**
 * Analyze image and extract key information for overlay
 */
export async function getImageMetadata(imageUrl: string): Promise<{
    description: string;
    dominantColors: string[];
    subjects: string[];
}> {
    try {
        const description = await analyzeImage(imageUrl);

        // Extract subjects from description (simple keyword extraction)
        const subjects = extractKeywords(description);

        return {
            description,
            dominantColors: [], // Could be enhanced with color analysis
            subjects,
        };

    } catch (error) {
        console.error('[Image Metadata] Error:', error);
        return {
            description: 'News image',
            dominantColors: [],
            subjects: [],
        };
    }
}

/**
 * Simple keyword extraction from description
 */
function extractKeywords(text: string): string[] {
    // Remove common words and extract meaningful keywords
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were'];

    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !commonWords.includes(word));

    // Return unique keywords
    return [...new Set(words)].slice(0, 5);
}
