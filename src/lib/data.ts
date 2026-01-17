import type { Article, NewsCategory } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { subDays } from 'date-fns';

const placeholderImageMap = new Map(PlaceHolderImages.map(p => [p.id, p]));

const getArticleImage = (id: string) => {
  const placeholder = placeholderImageMap.get(`news-${id}`);
  return {
    url: placeholder?.imageUrl || 'https://picsum.photos/seed/fallback/600/400',
    hint: placeholder?.imageHint || 'news article'
  };
};

const articles: Article[] = [
  {
    id: '1',
    title: 'Sri Lanka Secures Landmark Debt Restructuring Agreement',
    description: 'The government has successfully reached a final agreement with bilateral creditors, marking a major milestone in the country\'s economic recovery path.',
    category: 'Breaking News',
    publishedAt: subDays(new Date(), 0).toISOString(),
    url: '#',
    imageUrl: getArticleImage('1').url,
    imageHint: 'Economic headlines',
  },
  {
    id: '2',
    title: 'New High-Speed Rail Project Proposed for Colombo-Kandy Link',
    description: 'Transport Ministry unveils plans for a modernized rail link aimed at reducing travel time between the capital and the hill country to under 90 minutes.',
    category: 'Local News',
    publishedAt: subDays(new Date(), 0).toISOString(),
    url: '#',
    imageUrl: getArticleImage('2').url,
    imageHint: 'Modern train on tracks',
  },
  {
    id: '3',
    title: 'Sri Lanka Lions Triumph Over Australia in T20 Series',
    description: 'A stellar performance by the middle order guided the national team to a historic series victory at the Premadasa Stadium last night.',
    category: 'Sports',
    publishedAt: subDays(new Date(), 0).toISOString(),
    url: '#',
    imageUrl: getArticleImage('3').url,
    imageHint: 'Cricket stadium celebration',
  },
  {
    id: '4',
    title: 'Colombo Port City Sees Surge in Foreign Direct Investment',
    description: 'International tech firms and financial institutions are increasingly eyeing the Port City as a South Asian hub, with new SEZ regulations now in place.',
    category: 'Business',
    publishedAt: subDays(new Date(), 1).toISOString(),
    url: '#',
    imageUrl: getArticleImage('4').url,
    imageHint: 'Port city skyline',
  },
  {
    id: '5',
    title: 'Revival of Local Cinema: "Sigiriya Shadows" Breaks Box Office Records',
    description: 'The indigenous film industry celebrates a major success as a locally produced historical epic draws massive crowds across the island.',
    category: 'Entertainment',
    publishedAt: subDays(new Date(), 1).toISOString(),
    url: '#',
    imageUrl: getArticleImage('5').url,
    imageHint: 'Film premiere event',
  },
  {
    id: '6',
    title: 'Renewable Energy Initiative: Mega Solar Park Launched in Hambantota',
    description: 'The 500MW solar power project aims to significantly reduce the country\'s reliance on fossil fuels by 2030.',
    category: 'Technology',
    publishedAt: subDays(new Date(), 2).toISOString(),
    url: '#',
    imageUrl: getArticleImage('6').url,
    imageHint: 'Solar panel farm',
  },
  {
    id: '7',
    title: 'Educational Reforms: National Digital Literacy Program Announced',
    description: 'The Ministry of Education is set to introduce coding and AI basics into the school curriculum starting next academic year.',
    category: 'Local News',
    publishedAt: subDays(new Date(), 3).toISOString(),
    url: '#',
    imageUrl: getArticleImage('7').url,
    imageHint: 'Students with tablets',
  },
  {
    id: '8',
    title: 'Tourism Boom: record-breaking 2 Million Visitors Expected This Year',
    description: 'With the easing of travel restrictions and global promotional campaigns, the tourism sector is poised for its best year in a decade.',
    category: 'Business',
    publishedAt: subDays(new Date(), 4).toISOString(),
    url: '#',
    imageUrl: getArticleImage('8').url,
    imageHint: 'Scenic Sri Lankan beach',
  },
  {
    id: '9',
    title: 'Rare Blue Whale Sighting Off the Coast of Mirissa',
    description: 'Marine biologists report an unusual increase in whale sightings, highlighting the importance of marine conservation in the southern coast.',
    category: 'Lifestyle',
    publishedAt: subDays(new Date(), 5).toISOString(),
    url: '#',
    imageUrl: getArticleImage('9').url,
    imageHint: 'Whale tail in ocean',
  },
  {
    id: '10',
    title: 'AI Startup from Sri Lanka Wins Global Innovation Award',
    description: 'A tech startup based in Colombo has been recognized in Silicon Valley for its groundbreaking health-tech solutions using machine learning.',
    category: 'Technology',
    publishedAt: subDays(new Date(), 6).toISOString(),
    url: '#',
    imageUrl: getArticleImage('10').url,
    imageHint: 'Tech office environment',
  }
];

// Import Hiru News API functions
import {
  fetchBreakingNews,
  fetchLatestNews,
  fetchNewsByCategory,
  fetchArticleById,
} from './hiru-news-api';

// Cache for API responses (60 seconds)
const cache = new Map<string, { data: Article[]; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 60 seconds

/**
 * Get cached data if available and not expired
 */
function getCachedData(key: string): Article[] | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

/**
 * Set cached data
 */
function setCachedData(key: string, data: Article[]): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Get news articles - fetches from Hiru News API with fallback to mock data
 */
export async function getNews(category?: NewsCategory): Promise<Article[]> {
  const cacheKey = category || 'all';

  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log(`[Cache Hit] Returning cached data for: ${cacheKey}`);
    return cachedData;
  }

  try {
    console.log(`[API] Fetching news from Hiru News API: ${category || 'all'}`);

    let apiArticles: Article[];

    if (category === 'Breaking News') {
      apiArticles = await fetchBreakingNews(10);
    } else if (category) {
      apiArticles = await fetchNewsByCategory(category, 10);
    } else {
      apiArticles = await fetchLatestNews(15);
    }

    // Cache the API response
    setCachedData(cacheKey, apiArticles);

    console.log(`[API Success] Fetched ${apiArticles.length} articles from Hiru News`);
    return apiArticles;

  } catch (error) {
    console.error('[API Error] Failed to fetch from Hiru News API, falling back to mock data:', error);

    // Fallback to mock data
    await new Promise(resolve => setTimeout(resolve, 500));

    if (category) {
      const filtered = articles.filter(article => article.category === category);
      setCachedData(cacheKey, filtered);
      return filtered;
    }

    setCachedData(cacheKey, articles);
    return articles;
  }
}

/**
 * Get a single article by ID - tries API first, then falls back to mock data
 */
export async function getArticle(id: string): Promise<Article | undefined> {
  try {
    console.log(`[API] Fetching article ${id} from Hiru News API`);
    const article = await fetchArticleById(id);

    if (article) {
      console.log(`[API Success] Found article ${id}`);
      return article;
    }
  } catch (error) {
    console.error(`[API Error] Failed to fetch article ${id}:`, error);
  }

  // Fallback to mock data
  await new Promise(resolve => setTimeout(resolve, 300));
  return articles.find(article => article.id === id);
}

