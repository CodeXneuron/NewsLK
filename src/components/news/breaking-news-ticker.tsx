"use client";

import { useEffect, useState } from "react";
import { Article } from "@/types";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface BreakingNewsTickerProps {
    articles: Article[];
}

export function BreakingNewsTicker({ articles }: BreakingNewsTickerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const breakingNews = articles.filter(
        (article) => article.category === "Breaking News"
    );

    useEffect(() => {
        if (breakingNews.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [breakingNews.length]);

    if (breakingNews.length === 0) return null;

    const currentArticle = breakingNews[currentIndex];

    return (
        <div className="sticky top-16 z-10 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-lg backdrop-blur-sm">
            <div className="container mx-auto flex items-center gap-3 px-4 py-2.5 md:px-6">
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <AlertCircle className="h-5 w-5 animate-pulse" />
                    <span className="font-bold text-sm uppercase tracking-wider">
                        Breaking News
                    </span>
                </div>
                <div className="h-4 w-px bg-white/30" />
                <div className="flex-1 overflow-hidden">
                    <Link
                        href={`/article/${currentArticle.id}`}
                        className="block animate-ticker-slide hover:underline"
                    >
                        <p className="truncate text-sm font-medium">
                            {currentArticle.title}
                        </p>
                    </Link>
                </div>
                <div className="hidden md:flex items-center gap-1.5">
                    {breakingNews.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-1.5 w-1.5 rounded-full transition-all ${index === currentIndex
                                ? "bg-white w-4"
                                : "bg-white/40 hover:bg-white/60"
                                }`}
                            aria-label={`View breaking news ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
