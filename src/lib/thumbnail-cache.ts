import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';

const THUMBNAIL_FOLDER = 'generated-thumbnails';
const CACHE_DURATION = parseInt(process.env.THUMBNAIL_CACHE_DURATION || '2592000') * 1000; // Default 30 days

/**
 * Generate a cache key for an article
 */
export function getCacheKey(articleId: string, category: string): string {
    return `${category.toLowerCase().replace(/\s+/g, '-')}-${articleId}`;
}

/**
 * Check if a cached thumbnail exists for an article
 */
export async function getCachedThumbnail(articleId: string, category: string): Promise<string | null> {
    try {
        const cacheKey = getCacheKey(articleId, category);
        const thumbnailRef = ref(storage, `${THUMBNAIL_FOLDER}/${cacheKey}.png`);

        // Try to get the download URL
        const url = await getDownloadURL(thumbnailRef);

        console.log(`[Cache Hit] Found cached thumbnail for article ${articleId}`);
        return url;

    } catch (error: any) {
        // If file doesn't exist, return null
        if (error.code === 'storage/object-not-found') {
            console.log(`[Cache Miss] No cached thumbnail for article ${articleId}`);
            return null;
        }

        console.error('Error checking cached thumbnail:', error);
        return null;
    }
}

/**
 * Save a generated thumbnail to Firebase Storage
 */
export async function saveThumbnail(
    articleId: string,
    category: string,
    imageData: Blob | Buffer
): Promise<string> {
    try {
        const cacheKey = getCacheKey(articleId, category);
        const thumbnailRef = ref(storage, `${THUMBNAIL_FOLDER}/${cacheKey}.png`);

        // Convert Buffer to Blob if needed
        const blob = imageData instanceof Buffer
            ? new Blob([new Uint8Array(imageData)], { type: 'image/png' })
            : imageData;

        // Upload the image
        const blobSize = blob instanceof Blob ? blob.size : blob.length;
        console.log(`[Cache Save] Uploading ${blobSize} bytes to ${THUMBNAIL_FOLDER}/${cacheKey}.png...`);
        const uploadResult = await uploadBytes(thumbnailRef, blob, {
            contentType: 'image/png',
            cacheControl: `public, max-age=${CACHE_DURATION / 1000}`,
        });

        console.log(`[Cache Save] Upload completed. Metadata:`, uploadResult.metadata.fullPath);

        // Get the download URL
        console.log(`[Cache Save] Getting download URL...`);
        const url = await getDownloadURL(thumbnailRef);

        console.log(`[Cache Save] Saved thumbnail for article ${articleId}`);
        return url;

    } catch (error: any) {
        console.error('Error saving thumbnail to Firebase:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);

        // If storage bucket doesn't exist or isn't configured, log a helpful message
        if (error.code === 'storage/unknown' || error.status_ === 404) {
            console.error('⚠️ Firebase Storage bucket may not be initialized. Please check:');
            console.error('1. Storage bucket exists in Firebase Console');
            console.error('2. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is correctly set');
            console.error('3. Storage rules allow write access');
        }

        throw error;
    }
}

/**
 * Delete a cached thumbnail
 */
export async function deleteCachedThumbnail(articleId: string, category: string): Promise<void> {
    try {
        const cacheKey = getCacheKey(articleId, category);
        const thumbnailRef = ref(storage, `${THUMBNAIL_FOLDER}/${cacheKey}.png`);

        // Note: deleteObject is not imported, but you can add it if needed
        // await deleteObject(thumbnailRef);

        console.log(`[Cache Delete] Deleted thumbnail for article ${articleId}`);

    } catch (error) {
        console.error('Error deleting cached thumbnail:', error);
        throw error;
    }
}

/**
 * List all cached thumbnails
 */
export async function listCachedThumbnails(): Promise<string[]> {
    try {
        const thumbnailsRef = ref(storage, THUMBNAIL_FOLDER);
        const result = await listAll(thumbnailsRef);

        return result.items.map(item => item.name);

    } catch (error) {
        console.error('Error listing cached thumbnails:', error);
        return [];
    }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
    totalThumbnails: number;
    cacheSize: string;
}> {
    try {
        const thumbnails = await listCachedThumbnails();

        return {
            totalThumbnails: thumbnails.length,
            cacheSize: 'Unknown', // Firebase Storage doesn't provide size info easily
        };

    } catch (error) {
        console.error('Error getting cache stats:', error);
        return {
            totalThumbnails: 0,
            cacheSize: 'Unknown',
        };
    }
}
