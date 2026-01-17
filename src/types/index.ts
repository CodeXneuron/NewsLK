export type NewsCategory = 'Breaking News' | 'Politics' | 'Sports' | 'Entertainment' | 'Local News' | 'International' | 'Business' | 'Technology' | 'Lifestyle';

export const ALL_CATEGORIES: NewsCategory[] = [
  'Breaking News',
  'Politics',
  'Sports',
  'Business',
  'Technology',
  'Entertainment',
  'Local News',
  'Lifestyle',
  'International',
];

export interface Article {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  publishedAt: string;
  url: string;
  category: NewsCategory;
  fullText?: string;
  images?: Array<{ url: string; alt: string; caption: string }>;
  author?: string;
}
