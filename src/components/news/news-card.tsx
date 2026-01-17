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

interface NewsCardProps {
  article: Article;
}

export function NewsCard({ article }: NewsCardProps) {
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

  return (
    <Card className="group flex h-full transform-gpu flex-col overflow-hidden border-muted/40 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-red-600/20 animate-content-show">
      <CardHeader className="p-0 relative overflow-hidden">
        <Link
          href={`/article/${article.id}`}
          className="block overflow-hidden"
        >
          <div className="relative aspect-[3/2] w-full overflow-hidden bg-muted">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              data-ai-hint={article.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 font-semibold shadow-lg bg-white/90 backdrop-blur-sm text-foreground"
        >
          {article.category}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <time
            dateTime={article.publishedAt}
            className="text-xs font-medium text-muted-foreground"
          >
            {formattedDate}
          </time>
        </div>
        <CardTitle className="mb-3 font-headline text-lg leading-tight line-clamp-2">
          <Link
            href={`/article/${article.id}`}
            className="hover:text-red-600 transition-colors"
          >
            {article.title}
          </Link>
        </CardTitle>
        <p className="flex-1 text-sm text-muted-foreground line-clamp-3">
          {article.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Bookmark article"
          onClick={handleBookmark}
          className="hover:bg-red-50 hover:text-red-600"
        >
          <Bookmark
            className={cn(
              "h-5 w-5 transition-all",
              isBookmarked ? "fill-red-600 text-red-600" : "text-muted-foreground"
            )}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Share article"
          onClick={handleShare}
          className="hover:bg-red-50 hover:text-red-600"
        >
          <Share2 className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Link
          href={`/article/${article.id}`}
          className="ml-auto"
        >
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-red-600/20 hover:bg-red-600 hover:text-white transition-colors"
          >
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
