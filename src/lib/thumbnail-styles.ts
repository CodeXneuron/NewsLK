import type { NewsCategory } from '@/types';

/**
 * Style configuration for AI-generated thumbnails
 * Defines visual themes for each news category
 */
export interface ThumbnailStyle {
    colors: string[];
    style: string;
    mood: string;
    layout: string;
}

export const thumbnailStyles: Record<NewsCategory, ThumbnailStyle> = {
    'Breaking News': {
        colors: ['#FF4444', '#CC0000', '#8B0000'],
        style: 'urgent, bold, dramatic with red accents',
        mood: 'intense and attention-grabbing',
        layout: 'dynamic diagonal composition with strong typography',
    },
    'Politics': {
        colors: ['#2C3E50', '#34495E', '#1A252F'],
        style: 'professional, authoritative with navy blue tones',
        mood: 'serious and formal',
        layout: 'structured grid with governmental imagery',
    },
    'Sports': {
        colors: ['#00AA00', '#006600', '#004400'],
        style: 'energetic, dynamic with green and gold accents',
        mood: 'exciting and action-packed',
        layout: 'action-oriented with motion blur effects',
    },
    'Business': {
        colors: ['#1E88E5', '#0D47A1', '#004D99'],
        style: 'corporate, sleek with blue and silver tones',
        mood: 'professional and trustworthy',
        layout: 'clean modern design with charts or graphs',
    },
    'Technology': {
        colors: ['#9C27B0', '#6A1B9A', '#4A148C'],
        style: 'futuristic, innovative with purple and cyan accents',
        mood: 'cutting-edge and modern',
        layout: 'geometric patterns with digital elements',
    },
    'Entertainment': {
        colors: ['#FF6F00', '#E65100', '#BF360C'],
        style: 'vibrant, colorful with orange and pink accents',
        mood: 'fun and engaging',
        layout: 'playful composition with spotlight effects',
    },
    'Local News': {
        colors: ['#00897B', '#00695C', '#004D40'],
        style: 'community-focused, warm with teal and green tones',
        mood: 'approachable and relatable',
        layout: 'balanced composition with Sri Lankan cultural elements',
    },
    'Lifestyle': {
        colors: ['#D81B60', '#AD1457', '#880E4F'],
        style: 'elegant, sophisticated with pink and gold accents',
        mood: 'aspirational and refined',
        layout: 'magazine-style layout with soft gradients',
    },
    'International': {
        colors: ['#5E35B1', '#4527A0', '#311B92'],
        style: 'global, diverse with purple and blue tones',
        mood: 'worldly and informative',
        layout: 'map-inspired design with international symbols',
    },
};

/**
 * Generate a detailed prompt for AI thumbnail generation
 */
export function generateThumbnailPrompt(
    title: string,
    category: NewsCategory,
    description?: string
): string {
    const style = thumbnailStyles[category];

    // Extract key themes from title
    const cleanTitle = title.slice(0, 100); // Limit length

    return `Create a professional news thumbnail image for a Sri Lankan news website called "NewsLK".

Article Title: "${cleanTitle}"
Category: ${category}

Visual Style Requirements:
- Color Palette: Use ${style.colors.join(', ')} as primary colors
- Design Style: ${style.style}
- Mood: ${style.mood}
- Layout: ${style.layout}

Design Elements:
- Include subtle NewsLK branding (text or logo placement)
- Modern, clean, professional aesthetic
- High contrast for readability
- Suitable for web display (16:9 or 4:3 aspect ratio)
- Include relevant iconography or symbols related to the article topic
- Use Sri Lankan cultural elements where appropriate (e.g., traditional patterns, colors)
- Ensure text is minimal but impactful
- Add a subtle gradient overlay for depth

Technical Requirements:
- High quality, sharp details
- Optimized for thumbnail display
- Professional news media quality
- No watermarks or stock photo indicators
- Photorealistic style with modern graphic design elements

The image should immediately convey the category and grab attention while maintaining professional news standards.`;
}

/**
 * Get a simplified prompt for faster generation
 */
export function getSimplifiedPrompt(title: string, category: NewsCategory): string {
    const style = thumbnailStyles[category];

    return `Professional news thumbnail for "${title.slice(0, 80)}" - ${category} category. 
Style: ${style.style}. 
Colors: ${style.colors[0]}, ${style.colors[1]}. 
Modern, clean design with NewsLK branding. 
16:9 aspect ratio, high quality.`;
}
