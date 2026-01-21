import { analyzeImageForRecreation, generateRecreationPrompt } from '@/lib/image-analyzer';
import { generateImage } from '@/lib/ai-image-generator';
import type { NewsCategory } from '@/types';

/**
 * Test the Gemini image recreation pipeline with a sample image
 * 
 * Usage:
 * 1. Add a test image URL below
 * 2. Run: npx tsx src/lib/test-recreation.ts
 */

async function testImageRecreation() {
    console.log('🚀 Testing Gemini Image Recreation Pipeline\n');

    // Test configuration
    const testImage = {
        // Using a simple test image (you can replace with actual Hiru News URL)
        url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=675&fit=crop',
        title: 'Breaking: Major Political Development in Sri Lanka',
        category: 'Breaking News' as NewsCategory,
        articleId: 'test-001',
    };

    const categoryColors = ['#ef4444', '#dc2626', '#b91c1c']; // Red for breaking news

    try {
        // Step 1: Analyze the image
        console.log('📸 Step 1: Analyzing image with Gemini Vision...');
        console.log(`   Image URL: ${testImage.url}\n`);

        const analysis = await analyzeImageForRecreation(testImage.url);

        console.log('✅ Analysis complete:');
        console.log(`   Scene: ${analysis.sceneDescription}`);
        console.log(`   Subjects: ${analysis.subjects.join(', ')}`);
        console.log(`   Composition: ${analysis.composition}`);
        console.log(`   Lighting: ${analysis.lighting}`);
        console.log(`   Mood: ${analysis.mood}`);
        console.log(`   Colors: ${analysis.colors.join(', ')}`);
        console.log(`   Has Watermark: ${analysis.hasWatermark ? 'Yes' : 'No'}`);
        if (analysis.watermarkLocation) {
            console.log(`   Watermark Location: ${analysis.watermarkLocation}`);
        }
        console.log('');

        // Step 2: Generate recreation prompt
        console.log('📝 Step 2: Generating recreation prompt...\n');

        const prompt = await generateRecreationPrompt(
            testImage.url,
            testImage.title,
            testImage.category,
            categoryColors
        );

        console.log('✅ Prompt generated:');
        console.log(`   Length: ${prompt.length} characters`);
        console.log(`   Preview:\n${prompt.substring(0, 300)}...\n`);

        // Step 3: Generate new image
        console.log('🎨 Step 3: Generating new image with AI...');
        console.log('   This may take 5-30 seconds depending on the service...\n');

        const startTime = Date.now();
        const newImageUrl = await generateImage(prompt, true); // Use high quality for test
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        if (newImageUrl) {
            console.log(`✅ Image generated successfully in ${duration}s!`);
            console.log(`   New Image URL: ${newImageUrl}\n`);

            // Step 4: Summary
            console.log('📊 Summary:');
            console.log(`   Original: ${testImage.url}`);
            console.log(`   Recreated: ${newImageUrl}`);
            console.log(`   Watermark removed: ${analysis.hasWatermark ? 'Yes' : 'N/A'}`);
            console.log(`   Generation time: ${duration}s`);
            console.log('\n✨ Test completed successfully!\n');
        } else {
            console.error('❌ Image generation failed');
            console.error('   Check your API keys and try again\n');
        }

    } catch (error) {
        console.error('❌ Test failed:', error);
        console.error('\nTroubleshooting:');
        console.error('1. Check that GEMINI_API_KEY is set in .env.local');
        console.error('2. Check that REPLICATE_API_KEY is set in .env.local');
        console.error('3. Verify the test image URL is accessible');
        console.error('4. Check your internet connection\n');
    }
}

// Run the test
testImageRecreation().catch(console.error);
