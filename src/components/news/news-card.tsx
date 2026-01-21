"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, Share2 } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Article } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import { BrandedImage } from "@/components/ui/branded-image";

interface NewsCardProps {
  article: Article;
  useRecreation?: boolean; // Whether to use branded overlay
}

export function NewsCard({ article, useRecreation = true }: NewsCardProps) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();

  const handleBookmark = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to bookmark articles.",
        variant: "destructive",
      });
      return;
    }
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Article bookmarked",
      description: `"${article.title}"`,
    });
  };

  const handleShare = async () => {
    const articleUrl = `${window.location.origin}/article/${article.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: articleUrl,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(articleUrl);
      toast({
        title: "Link copied!",
        description: "Article link has been copied to clipboard.",
      });
    }
  };

  const formattedDate = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true,
  });

  // Check if we should use image recreation
  const shouldUseRecreation = useRecreation && process.env.NEXT_PUBLIC_USE_IMAGE_RECREATION === 'true';

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/50 bg-card shadow-sm hover-lift animate-fade-in transition-all duration-300 hover:border-primary/30 hover:shadow-glow-hover">
      <CardHeader className="p-0 relative overflow-hidden">
        <Link
          href={`/article/${article.id}`}
          className="block overflow-hidden"
        >
          {shouldUseRecreation ? (
            <BrandedImage
              src={article.imageUrl}
              alt={article.title}
              category={article.category}
              className="transition-transform duration-700 ease-out group-hover:scale-110"
              showOverlay={true}
            />
          ) : (
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-muted">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                data-ai-hint={article.imageHint}
              />
              {/* Gradient overlay - always visible on mobile, hover on desktop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-100 transition-opacity duration-300" />
            </div>
          )}
        </Link>
        {!shouldUseRecreation && (
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 font-semibold shadow-lg bg-white/95 backdrop-blur-sm text-foreground border-0 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
          >
            {article.category}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4 sm:p-6 space-y-2 sm:space-y-3">
        <div className="mb-3 flex items-center justify-between">
          <time
            dateTime={article.publishedAt}
            className="text-xs font-medium text-muted-foreground"
          >
            {formattedDate}
          </time>
        </div>
        <CardTitle className="font-headline text-lg sm:text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
          <Link
            href={`/article/${article.id}`}
            className="hover:underline decoration-2 underline-offset-4"
          >
            {article.title}
          </Link>
        </CardTitle>
        <p className="flex-1 text-sm sm:text-base text-muted-foreground line-clamp-3 leading-relaxed">
          {article.description}
        </p>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0 flex items-center gap-2 border-t border-border/50 mt-auto">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Bookmark article"
          onClick={handleBookmark}
          className="hover:bg-primary/10 hover:text-primary transition-all duration-300 min-w-[44px] min-h-[44px] ripple"
        >
          <Bookmark
            className={cn(
              "h-5 w-5 transition-all duration-300",
              isBookmarked ? "fill-primary text-primary scale-110" : "text-muted-foreground"
            )}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Share article"
          onClick={handleShare}
          className="hover:bg-primary/10 hover:text-primary transition-all duration-300 min-w-[44px] min-h-[44px] ripple"
        >
          <Share2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
        </Button>
        <Link
          href={`/article/${article.id}`}
          className="ml-auto"
        >
          <Button
            variant="default"
            size="sm"
            className="text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/20 group/btn"
          >
            Read More
            <svg
              className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
