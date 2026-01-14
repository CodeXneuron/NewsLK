"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark } from "lucide-react";
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

  const formattedDate = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true,
  });

  return (
    <Card className="flex h-full transform-gpu flex-col overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-content-show">
      <CardHeader className="p-0">
        <Link href={article.url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            width={600}
            height={400}
            className="aspect-[3/2] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={article.imageHint}
          />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="secondary" className="font-semibold">
            {article.category}
          </Badge>
          <time dateTime={article.publishedAt} className="text-xs text-muted-foreground">
            {formattedDate}
          </time>
        </div>
        <CardTitle className="mb-2 font-headline text-lg leading-tight">
           <Link href={article.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            {article.title}
          </Link>
        </CardTitle>
        <p className="flex-1 text-sm text-muted-foreground">
          {article.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Bookmark article"
          onClick={handleBookmark}
        >
          <Bookmark
            className={cn(
              "h-5 w-5 transition-colors",
              isBookmarked ? "fill-primary text-primary" : "text-muted-foreground"
            )}
          />
        </Button>
      </CardFooter>
    </Card>
  );
}
