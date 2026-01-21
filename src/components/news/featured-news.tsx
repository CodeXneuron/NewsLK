"use client";

import Image from "next/image";
import Link from "next/link";
import { Article } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Clock, ArrowRight } from "lucide-react";

interface FeaturedNewsProps {
    article: Article;
}

export function FeaturedNews({ article }: FeaturedNewsProps) {
    const formattedDate = formatDistanceToNow(new Date(article.publishedAt), {
        addSuffix: true,
    });

    return (
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl group hover:shadow-glow-hover transition-all duration-500">
            <div className="grid gap-0 md:grid-cols-2">
                {/* Image Section */}
                <div className="relative h-48 sm:h-64 md:h-auto overflow-hidden">
                    <Link
                        href={`/article/${article.id}`}
                        className="block h-full"
                    >
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            width={800}
                            height={600}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            data-ai-hint={article.imageHint}
                            priority
                        />
                    </Link>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent md:bg-gradient-to-r md:from-slate-900/90 md:via-slate-900/50 md:to-transparent" />
                </div>

                {/* Content Section */}
                <div className="relative flex flex-col justify-center p-4 sm:p-6 md:p-10 text-white">
                    <div className="mb-4 flex items-center gap-3">
                        <Badge
                            variant="secondary"
                            className="bg-red-600 text-white hover:bg-red-700 font-bold uppercase tracking-wide shadow-glow transition-all duration-300 hover:shadow-glow-hover"
                        >
                            Featured
                        </Badge>
                        <Badge variant="outline" className="border-white/30 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60">
                            {article.category}
                        </Badge>
                    </div>

                    <Link
                        href={`/article/${article.id}`}
                        className="group/link"
                    >
                        <h2 className="mb-3 sm:mb-4 font-headline text-2xl sm:text-3xl font-bold leading-tight transition-all duration-300 group-hover/link:text-red-400 md:text-4xl lg:text-5xl drop-shadow-lg">
                            {article.title}
                        </h2>
                    </Link>

                    <p className="mb-4 sm:mb-6 text-sm sm:text-base text-slate-300 md:text-lg line-clamp-3 sm:line-clamp-none leading-relaxed">
                        {article.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Clock className="h-4 w-4" />
                            <time dateTime={article.publishedAt}>{formattedDate}</time>
                        </div>

                        <Link href={`/article/${article.id}`}>
                            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-300 hover:shadow-md hover:shadow-primary/20 group/btn">
                                Read Article
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-blue-600/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    );
}
