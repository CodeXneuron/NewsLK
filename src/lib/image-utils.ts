/**
 * Simple image proxy/fallback handler for Hiru News images
 * Use this when cdn.hirunews.lk is slow or timing out
 */

export function getOptimizedImageUrl(url: string): string {
    // If it's a Hiru News CDN image and it's slow, we have options:

    // Option 1: Use the image directly (bypass Next.js optimization)
    if (url.includes('cdn.hirunews.lk')) {
        // Return the original URL - we'll use unoptimized prop in Image component
        return url;
    }

    // Option 2: Use a faster CDN proxy (like imgproxy, cloudinary, etc.)
    // if (url.includes('cdn.hirunews.lk')) {
    //     return `https://your-image-proxy.com/${encodeURIComponent(url)}`;
    // }

    // Option 3: Use cached/recreated version if available
    // This would check Firebase Storage for a cached recreation

    return url;
}

export function getImageFallback(category: string): string {
    // Return a category-appropriate fallback image
    const fallbacks: Record<string, string> = {
        'Breaking News': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=675&fit=crop',
        'Politics': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=675&fit=crop',
        'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=675&fit=crop',
        'Business': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=675&fit=crop',
        'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=675&fit=crop',
        'Entertainment': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=675&fit=crop',
        'Local News': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=675&fit=crop',
        'Lifestyle': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=675&fit=crop',
        'International': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&h=675&fit=crop',
    };

    return fallbacks[category] || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=675&fit=crop';
}
