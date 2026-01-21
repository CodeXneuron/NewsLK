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
    const [isPaused, setIsPaused] = useState(false);
    const breakingNews = articles.filter(
        (article) => article.category === "Breaking News"
    );

    useEffect(() => {
        if (breakingNews.length === 0 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [breakingNews.length, isPaused]);

    if (breakingNews.length === 0) return null;

    const currentArticle = breakingNews[currentIndex];

    return (
        <div className="sticky top-16 z-10 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-lg backdrop-blur-sm overflow-hidden">
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>

            <div
                className="container mx-auto flex items-center gap-3 px-4 py-2.5 md:px-6 relative"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className="flex items-center gap-2 whitespace-nowrap">
                    {/* Pulsing LIVE indicator */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
                        <div className="relative w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <AlertCircle className="h-5 w-5 animate-pulse" />
                    <span className="font-bold text-sm uppercase tracking-wider">
                        Breaking News
                    </span>
                </div>
                <div className="h-4 w-px bg-white/30" />
                <div className="flex-1 overflow-hidden">
                    <Link
                        href={`/article/${currentArticle.id}`}
                        className="block animate-ticker-slide hover:underline transition-all duration-300"
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
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                ? "bg-white w-6"
                                : "bg-white/40 hover:bg-white/60 w-1.5"
                                }`}
                            aria-label={`View breaking news ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
