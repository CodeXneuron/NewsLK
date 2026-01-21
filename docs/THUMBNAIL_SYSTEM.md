# AI-Powered Thumbnail Generation System

## Overview

NewsLK now features an intelligent thumbnail generation system that replaces generic API images with branded, category-specific thumbnails. This gives your news site a unique, professional, and cohesive visual identity.

## Features

✅ **Category-Based Branding**: Each news category has its own curated visual theme
✅ **High-Quality Images**: Professional Unsplash images optimized for web display (1200x675px)
✅ **Consistent Visual Identity**: Maintains brand consistency across all articles
✅ **Smart Fallbacks**: Original API images preserved as fallback
✅ **Firebase Storage Caching**: Efficient caching system for generated thumbnails
✅ **Easy Toggle**: Enable/disable with a single environment variable

## How It Works

### 1. Article Transformation

When articles are fetched from the Hiru News API, the `transformArticle` function:
- Stores the original thumbnail URL
- Checks if generated thumbnails are enabled
- Selects a branded thumbnail based on the article's category
- Uses the article ID to consistently select the same image

### 2. Category Themes

Each category has a unique visual theme:

| Category | Colors | Style |
|----------|--------|-------|
| Breaking News | Red (#FF4444, #CC0000) | Urgent, bold, dramatic |
| Politics | Navy (#2C3E50, #34495E) | Professional, authoritative |
| Sports | Green (#00AA00, #006600) | Energetic, dynamic |
| Business | Blue (#1E88E5, #0D47A1) | Corporate, sleek |
| Technology | Purple (#9C27B0, #6A1B9A) | Futuristic, innovative |
| Entertainment | Orange (#FF6F00, #E65100) | Vibrant, colorful |
| Local News | Teal (#00897B, #00695C) | Community-focused, warm |
| Lifestyle | Pink (#D81B60, #AD1457) | Elegant, sophisticated |
| International | Purple (#5E35B1, #4527A0) | Global, diverse |

### 3. Image Selection

For each category, we maintain a pool of 3 high-quality images. The system uses the article ID to deterministically select one image, ensuring:
- Same article always gets the same thumbnail
- Even distribution across the image pool
- Consistent user experience

## Configuration

### Environment Variables

```env
# Enable/disable generated thumbnails
NEXT_PUBLIC_USE_GENERATED_THUMBNAILS="true"

# Gemini API key (for future AI generation)
GEMINI_API_KEY="your_api_key_here"

# Cache duration (30 days in seconds)
THUMBNAIL_CACHE_DURATION="2592000"
```

### Toggle Thumbnails

To switch between branded thumbnails and original API images:

```env
# Use branded thumbnails
NEXT_PUBLIC_USE_GENERATED_THUMBNAILS="true"

# Use original API images
NEXT_PUBLIC_USE_GENERATED_THUMBNAILS="false"
```

## File Structure

```
src/
├── lib/
│   ├── hiru-news-api.ts          # Article transformation with thumbnail logic
│   ├── thumbnail-styles.ts        # Category style configuration
│   ├── thumbnail-cache.ts         # Firebase Storage caching
│   ├── generate-thumbnail.ts      # Main thumbnail generation logic
│   ├── gemini-client.ts          # Gemini API client (for future use)
│   └── firebase/
│       └── config.ts             # Firebase config with Storage
├── app/
│   └── api/
│       ├── generate-thumbnail/   # Thumbnail generation API
│       │   └── route.ts
│       └── generate-image/       # AI image generation API
│           └── route.ts
└── types/
    └── index.ts                  # Extended Article interface
```

## API Endpoints

### POST /api/generate-thumbnail

Generate a custom thumbnail for an article.

**Request:**
```json
{
  "articleId": "123",
  "title": "Article Title",
  "category": "Breaking News",
  "description": "Article description",
  "originalImageUrl": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "thumbnailUrl": "https://...",
  "cached": true
}
```

### GET /api/generate-thumbnail

Get a thumbnail via query parameters.

**Example:**
```
GET /api/generate-thumbnail?articleId=123&title=Article&category=Sports
```

## Future Enhancements

### Phase 1: Current Implementation ✅
- Category-based curated images
- Firebase Storage caching
- Fallback mechanisms
- Environment variable toggle

### Phase 2: AI Generation (Planned)
- Real-time AI image generation using Gemini/DALL-E
- Custom branded overlays with NewsLK logo
- Dynamic text rendering on images
- Category-specific design templates

### Phase 3: Advanced Features (Planned)
- Background job for pre-generating thumbnails
- A/B testing different thumbnail styles
- Analytics on thumbnail performance
- User preference learning

## Customization

### Adding New Category Styles

Edit `src/lib/thumbnail-styles.ts`:

```typescript
export const thumbnailStyles: Record<NewsCategory, ThumbnailStyle> = {
  'Your Category': {
    colors: ['#PRIMARY', '#SECONDARY'],
    style: 'your style description',
    mood: 'your mood description',
    layout: 'your layout description',
  },
  // ... other categories
};
```

### Adding New Thumbnail Images

Edit `src/lib/hiru-news-api.ts` in the `getBrandedThumbnail` function:

```typescript
const brandedThumbnails: Record<NewsCategory, string[]> = {
  'Your Category': [
    'https://images.unsplash.com/photo-xxx?w=1200&h=675&fit=crop&q=80',
    'https://images.unsplash.com/photo-yyy?w=1200&h=675&fit=crop&q=80',
    'https://images.unsplash.com/photo-zzz?w=1200&h=675&fit=crop&q=80',
  ],
  // ... other categories
};
```

## Performance

- **Image Loading**: Optimized 1200x675px images from Unsplash CDN
- **Caching**: Firebase Storage with 30-day cache duration
- **Fallback**: Instant fallback to original images if needed
- **No Runtime Generation**: Pre-selected images for fast loading

## Troubleshooting

### Thumbnails Not Showing

1. Check environment variable:
   ```env
   NEXT_PUBLIC_USE_GENERATED_THUMBNAILS="true"
   ```

2. Verify Firebase Storage is configured:
   ```typescript
   // src/lib/firebase/config.ts
   export { storage };
   ```

3. Check browser console for errors

### Original Images Still Showing

- Restart the development server after changing `.env.local`
- Clear browser cache
- Verify the environment variable is set to `"true"` (string, not boolean)

## Credits

- **Images**: High-quality photos from [Unsplash](https://unsplash.com)
- **Storage**: Firebase Cloud Storage
- **AI Integration**: Google Gemini API (planned)

## License

This thumbnail generation system is part of the NewsLK project.
