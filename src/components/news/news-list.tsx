"use client";

import { useSearchParams } from "next/navigation";
import type { Article } from "@/types";
import { NewsCard } from "./news-card";
import { useMemo } from "react";

interface NewsListProps {
  articles: Article[];
}

export function NewsList({ articles }: NewsListProps) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const filteredArticles = useMemo(() => {
    if (!category) {
      return articles;
    }
    return articles.filter(
      (article) => article.category === decodeURIComponent(category)
    );
  }, [articles, category]);
  
  const categoryTitle = category ? decodeURIComponent(category) : "All News";

  return (
    <div className="container mx-auto">
      <h2 className="mb-6 font-headline text-3xl font-bold md:text-4xl">
        {categoryTitle}
      </h2>
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted p-12 text-center">
            <h3 className="text-xl font-semibold">No Articles Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are no articles in the "{categoryTitle}" category at the moment.
            </p>
        </div>
      )}
    </div>
  );
}
