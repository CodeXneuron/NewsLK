# Quick Start Guide - AI Thumbnail System

## 🚀 Quick Setup

### 1. Enable the System
The system is already configured and ready to use! Just ensure this is set in `.env.local`:

```env
NEXT_PUBLIC_USE_GENERATED_THUMBNAILS="true"
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. View Results
Open `http://localhost:9002` and browse different news categories to see the branded thumbnails!

## 🎨 What You Get

- **9 Categories** with unique visual themes
- **27 High-Quality Images** (3 per category)
- **Professional Look** that matches your brand
- **Instant Loading** from Unsplash CDN
- **Smart Caching** with Firebase Storage

## 📸 Category Themes

| Category | Color | Style |
|----------|-------|-------|
| 🔴 Breaking News | Red | Urgent & Dramatic |
| 🏛️ Politics | Navy | Professional & Authoritative |
| ⚽ Sports | Green | Energetic & Dynamic |
| 💼 Business | Blue | Corporate & Sleek |
| 💻 Technology | Purple | Futuristic & Innovative |
| 🎭 Entertainment | Orange | Vibrant & Colorful |
| 🏘️ Local News | Teal | Community-Focused |
| 🌸 Lifestyle | Pink | Elegant & Sophisticated |
| 🌍 International | Purple | Global & Diverse |

## 🔧 Toggle On/Off

### Use Branded Thumbnails (Current)
```env
NEXT_PUBLIC_USE_GENERATED_THUMBNAILS="true"
```

### Use Original API Images
```env
NEXT_PUBLIC_USE_GENERATED_THUMBNAILS="false"
```

**Note:** Restart the dev server after changing this setting!

## 📝 Customization

### Add New Images for a Category

Edit `src/lib/hiru-news-api.ts` and find the `getBrandedThumbnail` function:

```typescript
'Sports': [
  'https://images.unsplash.com/photo-xxx?w=1200&h=675&fit=crop&q=80',
  'https://images.unsplash.com/photo-yyy?w=1200&h=675&fit=crop&q=80',
  'https://images.unsplash.com/photo-zzz?w=1200&h=675&fit=crop&q=80',
  // Add more images here!
],
```

### Change Category Colors

Edit `src/lib/thumbnail-styles.ts`:

```typescript
'Sports': {
  colors: ['#00AA00', '#006600'], // Change these colors
  style: 'energetic, dynamic',
  mood: 'exciting and action-packed',
  layout: 'action-oriented',
},
```

## 🎯 Best Practices

### Image Selection Tips
1. **Use Unsplash** for high-quality, professional images
2. **Maintain 16:9 aspect ratio** (1200x675px recommended)
3. **Match category theme** - colors and subject matter
4. **Test on mobile** - ensure images look good on small screens

### Finding Good Images
Visit [Unsplash](https://unsplash.com) and search for:
- **Breaking News**: "newspaper", "urgent", "alert"
- **Sports**: "cricket", "stadium", "athletes"
- **Business**: "office", "skyline", "corporate"
- **Technology**: "computer", "circuit", "innovation"
- **Entertainment**: "concert", "stage", "celebration"
- **Local News**: "city", "community", "neighborhood"
- **Lifestyle**: "wellness", "fashion", "lifestyle"
- **International**: "globe", "world", "travel"

### Image URL Format
```
https://images.unsplash.com/photo-XXXXXXXXX?w=1200&h=675&fit=crop&q=80
```

Parameters:
- `w=1200` - Width
- `h=675` - Height
- `fit=crop` - Crop to fit
- `q=80` - Quality (80%)

## 🐛 Troubleshooting

### Thumbnails Not Showing?
1. Check `.env.local` has `NEXT_PUBLIC_USE_GENERATED_THUMBNAILS="true"`
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Clear browser cache (Ctrl+Shift+R)

### Images Loading Slowly?
- Unsplash CDN is very fast, but check your internet connection
- Images are optimized at 1200x675px for quick loading

### Want Original Images Back?
Set `NEXT_PUBLIC_USE_GENERATED_THUMBNAILS="false"` and restart

## 📚 Documentation

- **Full Documentation**: `docs/THUMBNAIL_SYSTEM.md`
- **Implementation Walkthrough**: See artifacts
- **Code Examples**: In the documentation

## 🎉 You're All Set!

Your NewsLK site now has a unique, professional look with branded thumbnails that match each category's theme. Enjoy your beautiful news site! 🚀
