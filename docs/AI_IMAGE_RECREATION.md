# AI Image Recreation - Setup Guide

## Why Recreate Images?

The original news images from Hiru News API contain their logo/watermark. By using AI to recreate the images, we can:
- ✅ Keep the same subject matter and composition
- ✅ Remove Hiru News branding completely
- ✅ Add NewsLK branding instead
- ✅ Maintain professional quality

## How It Works

```
Original Image → Gemini Vision Analysis → AI Recreation → Clean Image
     ↓                    ↓                      ↓              ↓
"cricket.jpg"    "Cricket match scene"    Generate new    No logos!
with Hiru logo   + detailed description    similar image
```

## Setup Options

### Option 1: Replicate (Recommended)

**Pros:**
- High quality (Stable Diffusion XL)
- Fast generation (~30 seconds)
- Pay-per-use (~$0.01 per image)

**Setup:**
1. Go to https://replicate.com
2. Sign up for free account
3. Get API token from https://replicate.com/account/api-tokens
4. Add to `.env.local`:
   ```env
   REPLICATE_API_TOKEN="r8_your_token_here"
   IMAGE_RECREATION_METHOD="ai-generation"
   ```

### Option 2: Hugging Face (Free)

**Pros:**
- Completely free
- No credit card required
- Good quality

**Cons:**
- Slower (~60 seconds per image)
- May have rate limits

**Setup:**
1. Go to https://huggingface.co
2. Sign up for free account
3. Get token from https://huggingface.co/settings/tokens
4. Add to `.env.local`:
   ```env
   HUGGINGFACE_API_TOKEN="hf_your_token_here"
   IMAGE_RECREATION_METHOD="ai-generation"
   ```

### Option 3: Current Overlay Method (Free, Instant)

**Pros:**
- Free
- Instant (no generation time)
- No API needed

**Cons:**
- Just covers the logo with overlay
- Doesn't recreate the image

**Current setting:**
```env
IMAGE_RECREATION_METHOD="overlay"
```

## Enable AI Recreation

1. **Get an API token** (choose Replicate or Hugging Face)

2. **Add to `.env.local`:**
   ```env
   # For Replicate
   REPLICATE_API_TOKEN="r8_your_token_here"
   
   # OR for Hugging Face
   HUGGINGFACE_API_TOKEN="hf_your_token_here"
   
   # Enable AI generation
   IMAGE_RECREATION_METHOD="ai-generation"
   ```

3. **Restart server:**
   ```bash
   npm run dev
   ```

4. **Images will be recreated automatically!**
   - First load: Shows original with overlay (instant)
   - Background: AI generates clean version
   - Cached: Future loads use clean AI version

## Cost Estimate

### Replicate
- ~$0.01 per image
- 100 images = $1.00
- 1000 images = $10.00

### Hugging Face
- FREE (with rate limits)
- May be slower during peak times

## Testing

Once configured, the system will:
1. Analyze each news image with Gemini Vision
2. Generate a recreation prompt
3. Create new image without logos
4. Cache in Firebase Storage
5. Serve clean images on all future loads

## Troubleshooting

**Images not generating?**
- Check API token is correct
- Check `IMAGE_RECREATION_METHOD="ai-generation"`
- Check console logs for errors

**Too slow?**
- Use Replicate instead of Hugging Face
- Or stick with overlay method for instant results

**Too expensive?**
- Use Hugging Face (free)
- Or use overlay method
- Or only recreate featured articles

## Recommendation

**For testing:** Use Hugging Face (free)  
**For production:** Use Replicate (fast, cheap)  
**For instant results:** Keep overlay method (current)

The overlay method works great and is instant - AI recreation is optional for even better results!
