import type { Article, NewsCategory } from '@/types';

const API_BASE_URL = 'https://hirunews.vercel.app/api';
const API_TIMEOUT = 5000; // 5 seconds

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
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * Transform Hiru News article to our Article type
 */
function transformArticle(hiruArticle: HiruArticle): Article {
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

    return {
        id: hiruArticle.id,
        title: hiruArticle.headline,
        description: hiruArticle.summary || '',
        category: mappedCategory,
        publishedAt,
        url: hiruArticle.url,
        imageUrl: hiruArticle.thumbnail || 'https://picsum.photos/seed/fallback/600/400',
        imageHint: hiruArticle.images?.[0]?.alt || 'news article',
        fullText: hiruArticle.fullText,
        images: hiruArticle.images,
        author: hiruArticle.author,
    };
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

        return data.data.map(transformArticle);
    } catch (error) {
        console.error('Error fetching breaking news:', error);
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

        return data.data.map(transformArticle);
    } catch (error) {
        console.error('Error fetching latest news:', error);
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

        return data.data.map(transformArticle);
    } catch (error) {
        console.error(`Error fetching ${category} news:`, error);
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

        return transformArticle(result.data);
    } catch (error) {
        console.error(`Error fetching article ${id}:`, error);
        return null;
    }
}
