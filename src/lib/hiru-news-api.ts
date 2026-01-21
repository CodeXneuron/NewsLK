import type { Article, NewsCategory } from '@/types';

const API_BASE_URL = 'https://hirunews.vercel.app/api';
const API_TIMEOUT = 15000; // 15 seconds - increased to handle slow API responses

// Category mapping from Hiru News API to our app categories
const categoryMap: Record<string, NewsCategory> = {
    'sports': 'Sports',
    'business': 'Business',
    'entertainment': 'Entertainment',
    'international': 'International',
    'general': 'Local News',
    'local': 'Local News',
};

// Reverse mapping for API calls
const reverseCategoryMap: Record<NewsCategory, string> = {
    'Sports': 'sports',
    'Business': 'business',
    'Entertainment': 'entertainment',
    'Technology': 'general', // Hiru News doesn't have a dedicated tech category
    'International': 'international',
    'Local News': 'general',
    'Breaking News': 'breaking-news',
    'Politics': 'general',
    'Lifestyle': 'general',
};

interface HiruArticle {
    id: string;
    headline: string;
    url: string;
    thumbnail: string;
    summary: string;
    fullText?: string;
    images?: Array<{ url: string; alt: string; caption: string }>;
    category: string;
    publishedDate: string;
    author?: string;
    wordCount?: number;
    hasFullContent?: boolean;
}

interface HiruApiResponse {
    success: boolean;
    data: HiruArticle[];
    count: number;
    timestamp: string;
    source: string;
    error?: string;
}

/**
 * Fetch data from Hiru News API with timeout
 */
async function fetchWithTimeout(url: string, timeout = API_TIMEOUT): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
            },
            // Add cache control to help with performance
            cache: 'no-store',
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);

        // Provide more specific error messages
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${timeout}ms: ${url}`);
            }
            throw new Error(`Network error: ${error.message}`);
        }
        throw error;
    }
}

/**
 * Transform Hiru News article to our Article type
 */
async function transformArticle(hiruArticle: HiruArticle): Promise<Article> {
    // Handle category safely - default to 'Local News' if undefined or not mapped
    const apiCategory = hiruArticle.category?.toLowerCase() || 'general';
    const mappedCategory = categoryMap[apiCategory] || 'Local News';

    // Parse date safely - Hiru News API returns dates in format "17 January 2026 10:34 AM"
    // If parsing fails, use current date as fallback
    let publishedAt: string;
    try {
        const parsedDate = new Date(hiruArticle.publishedDate);
        if (isNaN(parsedDate.getTime())) {
            // If date is invalid, use current date
            publishedAt = new Date().toISOString();
        } else {
            publishedAt = parsedDate.toISOString();
        }
    } catch (error) {
        // Fallback to current date if parsing fails
        publishedAt = new Date().toISOString();
    }

    // Store original thumbnail
    const originalImageUrl = hiruArticle.thumbnail || 'https://picsum.photos/seed/fallback/600/400';

    // Determine which image to use based on configuration
    const useImageRecreation = process.env.NEXT_PUBLIC_USE_IMAGE_RECREATION === 'true';
    const recreationMethod = process.env.IMAGE_RECREATION_METHOD;
    const useGeneratedThumbnails = process.env.NEXT_PUBLIC_USE_GENERATED_THUMBNAILS === 'true';

    let imageUrl: string;
    let generatedThumbnail = false;

    if (useImageRecreation && recreationMethod === 'ai-generation') {
        // AI Recreation Mode: Check cache first, then queue for background recreation
        try {
            // Import the cache checker and queue service
            const { getCachedThumbnail } = await import('./thumbnail-cache');
            const { queueImageRecreation } = await import('./recreation-queue');

            // Check if we have a cached recreated image
            const cachedUrl = await getCachedThumbnail(hiruArticle.id, mappedCategory);

            if (cachedUrl) {
                // Use the cached recreated image (fast!)
                console.log(`[Hiru API] Using cached recreation for article ${hiruArticle.id}`);
                imageUrl = cachedUrl;
                generatedThumbnail = true;
            } else {
                // No cached version - queue for background recreation
                console.log(`[Hiru API] Queueing recreation for article ${hiruArticle.id}`);

                // Queue the recreation (non-blocking)
                queueImageRecreation(
                    hiruArticle.id,
                    originalImageUrl,
                    hiruArticle.headline,
                    mappedCategory
                );

                // Use original image for now (will be replaced after recreation)
                imageUrl = originalImageUrl;
                generatedThumbnail = false;
            }
        } catch (error) {
            console.error('[Hiru API] Error checking cache or queueing recreation:', error);
            // Fallback to original image
            imageUrl = originalImageUrl;
            generatedThumbnail = false;
        }
    } else if (useGeneratedThumbnails) {
        // Use category-based branded thumbnails
        imageUrl = getBrandedThumbnail(mappedCategory, hiruArticle.id);
        generatedThumbnail = true;
    } else {
        // Use original API image as-is
        imageUrl = originalImageUrl;
        generatedThumbnail = false;
    }

    return {
        id: hiruArticle.id,
        title: hiruArticle.headline,
        description: hiruArticle.summary || '',
        category: mappedCategory,
        publishedAt,
        url: hiruArticle.url,
        imageUrl,
        imageHint: hiruArticle.images?.[0]?.alt || 'news article',
        fullText: hiruArticle.fullText,
        images: hiruArticle.images,
        author: hiruArticle.author,
        originalImageUrl,
        generatedThumbnail,
    };
}

/**
 * Get a branded thumbnail URL for a category
 * Uses high-quality, curated images that match the category's visual theme
 */
function getBrandedThumbnail(category: NewsCategory, articleId: string): string {
    // Category-specific branded thumbnails
    // These are curated high-quality images that match our brand colors
    const brandedThumbnails: Record<NewsCategory, string[]> = {
        'Breaking News': [
            'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&h=675&fit=crop&q=80',
        ],
        'Politics': [
            'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=1200&h=675&fit=crop&q=80',
        ],
        'Sports': [
            'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=1200&h=675&fit=crop&q=80',
        ],
        'Business': [
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=675&fit=crop&q=80',
        ],
        'Technology': [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&h=675&fit=crop&q=80',
        ],
        'Entertainment': [
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=1200&h=675&fit=crop&q=80',
        ],
        'Local News': [
            'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=675&fit=crop&q=80',
        ],
        'Lifestyle': [
            'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=675&fit=crop&q=80',
        ],
        'International': [
            'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=675&fit=crop&q=80',
            'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=675&fit=crop&q=80',
        ],
    };

    // Get thumbnails for this category
    const categoryThumbnails = brandedThumbnails[category] || brandedThumbnails['Local News'];

    // Use article ID to consistently select the same thumbnail for the same article
    const index = parseInt(articleId.replace(/\D/g, '') || '0') % categoryThumbnails.length;

    return categoryThumbnails[index];
}

/**
 * Fetch breaking news from Hiru News API
 */
export async function fetchBreakingNews(limit = 5): Promise<Article[]> {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/breaking-news?limit=${limit}`);

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data: HiruApiResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch breaking news');
        }

        return Promise.all(data.data.map(transformArticle));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('[Hiru API] Error fetching breaking news:', errorMessage);
        throw error;
    }
}

/**
 * Fetch latest news from Hiru News API
 */
export async function fetchLatestNews(limit = 10): Promise<Article[]> {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/latest-news?limit=${limit}`);

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data: HiruApiResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch latest news');
        }

        return Promise.all(data.data.map(transformArticle));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('[Hiru API] Error fetching latest news:', errorMessage);
        throw error;
    }
}

/**
 * Fetch news by category from Hiru News API
 */
export async function fetchNewsByCategory(category: NewsCategory, limit = 10): Promise<Article[]> {
    try {
        const apiCategory = reverseCategoryMap[category];

        if (!apiCategory) {
            throw new Error(`Unknown category: ${category}`);
        }

        // Breaking News uses a different endpoint
        if (category === 'Breaking News') {
            return fetchBreakingNews(limit);
        }

        const response = await fetchWithTimeout(
            `${API_BASE_URL}/category/${apiCategory}?limit=${limit}&details=false`
        );

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data: HiruApiResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || `Failed to fetch ${category} news`);
        }

        return Promise.all(data.data.map(transformArticle));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[Hiru API] Error fetching ${category} news:`, errorMessage);
        throw error;
    }
}

/**
 * Fetch a single article by ID
 */
export async function fetchArticleById(id: string): Promise<Article | null> {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/article/${id}?details=true`);

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`API returned ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !result.data) {
            return null;
        }

        return await transformArticle(result.data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[Hiru API] Error fetching article ${id}:`, errorMessage);
        return null;
    }
}
