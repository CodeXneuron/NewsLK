"use client";

import Image from "next/image";
import Link from "next/link";
import { Article } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";

interface FeaturedNewsProps {
    article: Article;
}

export function FeaturedNews({ article }: FeaturedNewsProps) {
    const formattedDate = formatDistanceToNow(new Date(article.publishedAt), {
        addSuffix: true,
    });

    return (
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
            <div className="grid gap-0 md:grid-cols-2">
                {/* Image Section */}
                <div className="relative h-64 md:h-auto overflow-hidden">
                    <Link
                        href={`/article/${article.id}`}
                        className="block h-full"
                    >
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            width={800}
                            height={600}
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                            data-ai-hint={article.imageHint}
                            priority
                        />
                    </Link>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent md:hidden" />
                </div>

                {/* Content Section */}
                <div className="relative flex flex-col justify-center p-6 md:p-10 text-white">
                    <div className="mb-4 flex items-center gap-3">
                        <Badge
                            variant="secondary"
                            className="bg-red-600 text-white hover:bg-red-700 font-bold uppercase tracking-wide"
                        >
                            Featured
                        </Badge>
                        <Badge variant="outline" className="border-white/30 text-white">
                            {article.category}
                        </Badge>
                    </div>

                    <Link
                        href={`/article/${article.id}`}
                        className="group"
                    >
                        <h2 className="mb-4 font-headline text-3xl font-bold leading-tight transition-colors group-hover:text-red-400 md:text-4xl lg:text-5xl">
                            {article.title}
                        </h2>
                    </Link>

                    <p className="mb-6 text-base text-slate-300 md:text-lg">
                        {article.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock className="h-4 w-4" />
                        <time dateTime={article.publishedAt}>{formattedDate}</time>
                    </div>
                </div>
            </div>

            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-blue-600/10 pointer-events-none" />
        </div>
    );
}
