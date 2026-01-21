'use client';

import { TrendingUp, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { NewsCategory } from '@/types';

interface TrendingTopic {
    category: NewsCategory;
    count: number;
    trend: 'up' | 'down' | 'stable';
}

interface TrendingTopicsProps {
    topics?: TrendingTopic[];
}

// Default trending topics (in a real app, this would come from analytics)
const defaultTopics: TrendingTopic[] = [
    { category: 'Politics', count: 24, trend: 'up' },
    { category: 'Sports', count: 18, trend: 'up' },
    { category: 'Business', count: 15, trend: 'stable' },
    { category: 'Technology', count: 12, trend: 'up' },
    { category: 'Entertainment', count: 10, trend: 'down' },
];

export function TrendingTopics({ topics = defaultTopics }: TrendingTopicsProps) {
    return (
        <Card className="glass overflow-hidden border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Header with gradient */}
            <div className="p-3 bg-gradient-to-r from-red-600/20 via-orange-600/20 to-red-600/20 border-b border-border/30 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Flame className="h-5 w-5 text-red-500 animate-pulse" />
                        <div className="absolute inset-0 blur-sm">
                            <Flame className="h-5 w-5 text-red-500" />
                        </div>
                    </div>
                    <h3 className="font-bold text-sm bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        Trending Now
                    </h3>
                </div>
            </div>

            {/* Trending list */}
            <div className="p-3 space-y-1">
                {topics.slice(0, 3).map((topic, index) => (
                    <Link
                        key={topic.category}
                        href={`/?category=${encodeURIComponent(topic.category)}`}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 transition-all duration-200 group border border-transparent hover:border-red-500/20"
                    >
                        <div className="flex items-center gap-3">
                            {/* Rank badge with gradient */}
                            <div className="relative">
                                <Badge
                                    variant="secondary"
                                    className={`w-7 h-7 flex items-center justify-center font-bold text-xs transition-all duration-200 ${index === 0
                                        ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30'
                                        : index === 1
                                            ? 'bg-gradient-to-br from-orange-500 to-yellow-500 text-white shadow-md shadow-orange-500/20'
                                            : 'bg-gradient-to-br from-yellow-500 to-amber-500 text-white shadow-sm shadow-yellow-500/10'
                                        }`}
                                >
                                    {index + 1}
                                </Badge>
                            </div>

                            {/* Category name */}
                            <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors duration-200">
                                {topic.category}
                            </span>
                        </div>

                        {/* Count and trend indicator */}
                        <div className="flex items-center gap-2.5">
                            <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                                {topic.count}
                            </span>
                            <div
                                className={`w-2 h-2 rounded-full shadow-lg transition-transform duration-200 group-hover:scale-125 ${topic.trend === 'up'
                                    ? 'bg-green-500 shadow-green-500/50 animate-pulse'
                                    : topic.trend === 'down'
                                        ? 'bg-red-500 shadow-red-500/50'
                                        : 'bg-yellow-500 shadow-yellow-500/50'
                                    }`}
                            />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Subtle bottom gradient */}
            <div className="h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
        </Card>
    );
}
