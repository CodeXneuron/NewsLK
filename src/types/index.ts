export type NewsCategory = 'Breaking News' | 'Politics' | 'Sports' | 'Entertainment' | 'Local News' | 'International';

export const ALL_CATEGORIES: NewsCategory[] = [
  'Breaking News',
  'Politics',
  'Sports',

  'Entertainment',
  'Local News',
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
}
