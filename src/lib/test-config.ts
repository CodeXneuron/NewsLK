import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

console.log('🔍 Checking API Configuration...\n');

// Check environment variables
console.log('Environment Variables:');
console.log(`  GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅ Set (' + process.env.GEMINI_API_KEY.substring(0, 20) + '...)' : '❌ Missing'}`);
console.log(`  REPLICATE_API_KEY: ${process.env.REPLICATE_API_KEY ? '✅ Set (' + process.env.REPLICATE_API_KEY.substring(0, 20) + '...)' : '❌ Missing'}`);
console.log(`  HUGGINGFACE_API_KEY: ${process.env.HUGGINGFACE_API_KEY ? '✅ Set (' + process.env.HUGGINGFACE_API_KEY.substring(0, 20) + '...)' : '❌ Missing'}`);
console.log(`  IMAGE_RECREATION_METHOD: ${process.env.IMAGE_RECREATION_METHOD || '❌ Not set'}`);
console.log(`  NEXT_PUBLIC_USE_IMAGE_RECREATION: ${process.env.NEXT_PUBLIC_USE_IMAGE_RECREATION || '❌ Not set'}`);

console.log('\n✨ Configuration check complete!\n');

// Test Replicate API connection
async function testReplicateConnection() {
    const apiKey = process.env.REPLICATE_API_KEY;

    if (!apiKey) {
        console.error('❌ REPLICATE_API_KEY not found in .env.local');
        return false;
    }

    try {
        console.log('🔌 Testing Replicate API connection...');

        const response = await fetch('https://api.replicate.com/v1/models', {
            headers: {
                'Authorization': `Token ${apiKey}`,
            },
        });

        if (response.ok) {
            console.log('✅ Replicate API connection successful!');
            const data = await response.json();
            console.log(`   Account is active and ready to use\n`);
            return true;
        } else {
            const errorText = await response.text();
            console.error(`❌ Replicate API error: ${response.status} ${response.statusText}`);
            console.error(`   Response: ${errorText}\n`);
            return false;
        }
    } catch (error) {
        console.error('❌ Connection error:', error);
        return false;
    }
}

// Test Gemini API
async function testGeminiConnection() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY not found in .env.local');
        return false;
    }

    try {
        console.log('🔌 Testing Gemini API connection...');

        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent('Hello');
        const response = await result.response;
        const text = response.text();

        console.log('✅ Gemini API connection successful!');
        console.log(`   Model responded: "${text.substring(0, 50)}..."\n`);
        return true;
    } catch (error) {
        console.error('❌ Gemini API error:', error);
        return false;
    }
}

async function runTests() {
    const replicateOk = await testReplicateConnection();
    const geminiOk = await testGeminiConnection();

    console.log('\n📊 Summary:');
    console.log(`  Replicate API: ${replicateOk ? '✅ Ready' : '❌ Not working'}`);
    console.log(`  Gemini API: ${geminiOk ? '✅ Ready' : '❌ Not working'}`);

    if (replicateOk && geminiOk) {
        console.log('\n🎉 All systems ready! You can now run the image recreation pipeline.\n');
    } else {
        console.log('\n⚠️  Some APIs are not working. Check the errors above.\n');
    }
}

runTests().catch(console.error);
