'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { NewsCategory } from '@/types';
import { thumbnailStyles } from '@/lib/thumbnail-styles';

interface BrandedImageProps {
    src: string;
    alt: string;
    category: NewsCategory;
    title?: string;
    width?: number;
    height?: number;
    className?: string;
    showOverlay?: boolean;
}

/**
 * BrandedImage component that adds NewsLK branding overlay to images
 * This provides instant visual branding without server-side processing
 */
export function BrandedImage({
    src,
    alt,
    category,
    title,
    width = 1200,
    height = 675,
    className = '',
    showOverlay = true,
}: BrandedImageProps) {
    const [imageError, setImageError] = useState(false);
    const style = thumbnailStyles[category];

    // Fallback image if original fails to load
    const fallbackSrc = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=675&fit=crop&q=80';

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: '16/9' }}>
            {/* Original Image */}
            <Image
                src={imageError ? fallbackSrc : src}
                alt={alt}
                width={width}
                height={height}
                className="object-cover w-full h-full"
                onError={() => setImageError(true)}
                priority={false}
            />

            {/* Branded Overlay */}
            {showOverlay && (
                <>
                    {/* Gradient Overlay matching category colors */}
                    <div
                        className="absolute inset-0 opacity-20 mix-blend-multiply"
                        style={{
                            background: `linear-gradient(135deg, ${style.colors[0]}40 0%, ${style.colors[1]}60 100%)`,
                        }}
                    />

                    {/* Category Badge */}
                    <div
                        className="absolute top-4 left-4 px-3 py-1 rounded-md font-semibold text-white text-sm shadow-lg"
                        style={{
                            backgroundColor: style.colors[0],
                        }}
                    >
                        {category}
                    </div>

                    {/* NewsLK Logo/Watermark - Hidden per user request */}
                    {/* Uncomment below to show NewsLK branding watermark
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-md">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-white font-bold text-sm tracking-wider">NewsLK</span>
                    </div>
                    */}

                    {/* Optional: Article Title Overlay */}
                    {title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                            <h3 className="text-white font-bold text-lg line-clamp-2 drop-shadow-lg">
                                {title}
                            </h3>
                        </div>
                    )}

                    {/* Hide Hiru News logo - full width bottom gradient (shorter) */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black via-black/80 to-transparent" />



                    {/* NewsLK Professional Watermark */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-lg">
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-white font-bold text-xs tracking-wider">NewsLK</span>
                    </div>

                    {/* Subtle Border */}
                    <div
                        className="absolute inset-0 border-2 pointer-events-none"
                        style={{
                            borderColor: `${style.colors[0]}40`,
                        }}
                    />
                </>
            )}
        </div>
    );
}

/**
 * Simple branded image without overlay (just the image)
 */
export function SimpleImage({
    src,
    alt,
    width = 1200,
    height = 675,
    className = '',
}: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
}) {
    const [imageError, setImageError] = useState(false);
    const fallbackSrc = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=675&fit=crop&q=80';

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: '16/9' }}>
            <Image
                src={imageError ? fallbackSrc : src}
                alt={alt}
                width={width}
                height={height}
                className="object-cover w-full h-full"
                onError={() => setImageError(true)}
                priority={false}
            />
        </div>
    );
}
