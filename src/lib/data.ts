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
    title: 'Major Political Rally Shakes Capital City',
    description: 'Thousands gather in the city center to protest new economic policies, leading to significant disruptions.',
    category: 'Breaking News',
    publishedAt: subDays(new Date(), 0).toISOString(),
    url: '#',
    imageUrl: getArticleImage('1').url,
    imageHint: getArticleImage('1').hint,
  },
  {
    id: '2',
    title: 'Parliament Passes Controversial New Bill',
    description: 'After a heated debate, the new infrastructure bill was passed by a narrow margin.',
    category: 'Politics',
    publishedAt: subDays(new Date(), 1).toISOString(),
    url: '#',
    imageUrl: getArticleImage('2').url,
    imageHint: getArticleImage('2').hint,
  },
  {
    id: '3',
    title: 'National Cricket Team Secures Victory in Thriller',
    description: 'A last-ball six seals a memorable win for the Sri Lankan Lions in the final match of the series.',
    category: 'Sports',
    publishedAt: subDays(new Date(), 1).toISOString(),
    url: '#',
    imageUrl: getArticleImage('3').url,
    imageHint: getArticleImage('3').hint,
  },
  {
    id: '4',
    title: 'New Film "Island Dreams" to Premiere Next Month',
    description: 'The highly anticipated film from a renowned local director is set for a nationwide release.',
    category: 'Entertainment',
    publishedAt: subDays(new Date(), 2).toISOString(),
    url: '#',
    imageUrl: getArticleImage('4').url,
    imageHint: getArticleImage('4').hint,
  },
  {
    id: '5',
    title: 'Colombo Port Expansion Project Begins',
    description: 'The first phase of the port expansion aims to increase cargo capacity by 20%.',
    category: 'Local News',
    publishedAt: subDays(new Date(), 3).toISOString(),
    url: '#',
    imageUrl: getArticleImage('5').url,
    imageHint: getArticleImage('5').hint,
  },
  {
    id: '6',
    title: 'Sri Lanka Strengthens Ties with European Nations',
    description: 'A series of new trade agreements have been signed to boost exports to the European market.',
    category: 'International',
    publishedAt: subDays(new Date(), 4).toISOString(),
    url: '#',
    imageUrl: getArticleImage('6').url,
    imageHint: getArticleImage('6').hint,
  },
  {
    id: '7',
    title: 'Government Announces New Tax Relief Measures',
    description: 'In an effort to stimulate the economy, the finance ministry has announced new tax cuts for small businesses.',
    category: 'Politics',
    publishedAt: subDays(new Date(), 5).toISOString(),
    url: '#',
    imageUrl: getArticleImage('7').url,
    imageHint: getArticleImage('7').hint,
  },
  {
    id: '8',
    title: 'Record Tourist Arrivals This Season',
    description: 'Tourism board reports a record number of visitors, marking a strong recovery for the sector.',
    category: 'Local News',
    publishedAt: subDays(new Date(), 6).toISOString(),
    url: '#',
    imageUrl: getArticleImage('8').url,
    imageHint: getArticleImage('8').hint,
  },
  {
    id: '9',
    title: 'Stock Exchange Hits All-Time High',
    description: 'Investor confidence soars as the Colombo Stock Exchange index surpasses previous records.',
    category: 'Breaking News',
    publishedAt: subDays(new Date(), 0).toISOString(),
    url: '#',
    imageUrl: getArticleImage('9').url,
    imageHint: getArticleImage('9').hint,
  },
  {
    id: '10',
    title: 'Wildlife Conservation Efforts Show Positive Results',
    description: 'New census data reveals a growing population of endangered species in national parks.',
    category: 'Local News',
    publishedAt: subDays(new Date(), 7).toISOString(),
    url: '#',
    imageUrl: getArticleImage('10').url,
    imageHint: getArticleImage('10').hint,
  },
  {
    id: '11',
    title: 'Music Festival Draws International Artists to Galle',
    description: 'The annual Galle Music Festival featured a diverse lineup of local and international talent.',
    category: 'Entertainment',
    publishedAt: subDays(new Date(), 8).toISOString(),
    url: '#',
    imageUrl: getArticleImage('11').url,
    imageHint: getArticleImage('11').hint,
  },
  {
    id: '12',
    title: 'Athlete Spotlight: The Rise of a New Sprinting Star',
    description: 'A young athlete from a rural village is breaking national records and aiming for the world stage.',
    category: 'Sports',
    publishedAt: subDays(new Date(), 9).toISOString(),
    url: '#',
    imageUrl: getArticleImage('12').url,
    imageHint: getArticleImage('12').hint,
  },
];

export async function getNews(category?: NewsCategory): Promise<Article[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (category) {
    return articles.filter(article => article.category === category);
  }
  
  return articles;
}

export async function getArticle(id: string): Promise<Article | undefined> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return articles.find(article => article.id === id);
}
