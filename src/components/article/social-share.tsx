"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Share2 } from "lucide-react";

interface SocialShareProps {
    title: string;
    articleId: string;
}

export function SocialShare({ title, articleId }: SocialShareProps) {
    const handleFacebookShare = () => {
        const url = `${window.location.origin}/article/${articleId}`;
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            '_blank'
        );
    };

    const handleTwitterShare = () => {
        const url = `${window.location.origin}/article/${articleId}`;
        window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            '_blank'
        );
    };

    const handleWhatsAppShare = () => {
        const url = `${window.location.origin}/article/${articleId}`;
        window.open(
            `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
            '_blank'
        );
    };

    return (
        <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Share this article:
            </span>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleFacebookShare}
                >
                    <Facebook className="h-4 w-4" />
                    Facebook
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleTwitterShare}
                >
                    <Twitter className="h-4 w-4" />
                    Twitter
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleWhatsAppShare}
                >
                    <Share2 className="h-4 w-4" />
                    WhatsApp
                </Button>
            </div>
        </div>
    );
}
