import { getNews } from "@/lib/data";
import { NewsList } from "@/components/news/news-list";
import { BreakingNewsTicker } from "@/components/news/breaking-news-ticker";
import { FeaturedNews } from "@/components/news/featured-news";
import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";
import type { NewsCategory } from "@/types";

interface HomeProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const category = params.category as NewsCategory | undefined;

  // Fetch filtered articles for the current category
  const articles = await getNews(category);

  // Always fetch breaking news for the ticker, regardless of category
  const breakingNews = await getNews("Breaking News");

  const featuredArticle = articles[0]; // First article as featured

  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="flex justify-center items-center h-16"><Loader className="h-8 w-8" /></div>}>
        <BreakingNewsTicker articles={breakingNews} />
      </Suspense>

      <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader className="h-12 w-12" /></div>}>
        <FeaturedNews article={featuredArticle} />
      </Suspense>

      <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader className="h-12 w-12" /></div>}>
        <NewsList articles={articles.slice(1)} />
      </Suspense>
    </div>
  );
}
