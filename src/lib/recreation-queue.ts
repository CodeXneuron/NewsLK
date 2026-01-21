import type { NewsCategory } from '@/types';
import { recreateImage } from './image-recreator';

/**
 * Background image recreation service
 * Recreates images asynchronously without blocking the main request
 */

interface RecreationJob {
    articleId: string;
    originalImageUrl: string;
    title: string;
    category: NewsCategory;
}

// In-memory queue for recreation jobs (in production, use Redis or a proper queue)
const recreationQueue: RecreationJob[] = [];
const processingJobs = new Set<string>();

/**
 * Add an image to the recreation queue
 */
export function queueImageRecreation(
    articleId: string,
    originalImageUrl: string,
    title: string,
    category: NewsCategory
): void {
    // Don't queue if already processing or queued
    if (processingJobs.has(articleId)) {
        return;
    }

    // Check if already in queue
    const existsInQueue = recreationQueue.some(job => job.articleId === articleId);
    if (existsInQueue) {
        return;
    }

    recreationQueue.push({
        articleId,
        originalImageUrl,
        title,
        category,
    });

    console.log(`[Recreation Queue] Added article ${articleId} to queue (${recreationQueue.length} jobs pending)`);

    // Start processing if not already running
    processQueue();
}

/**
 * Process the recreation queue
 */
async function processQueue(): Promise<void> {
    // Only process one job at a time to avoid overwhelming the API
    if (processingJobs.size > 0) {
        return;
    }

    const job = recreationQueue.shift();
    if (!job) {
        return;
    }

    processingJobs.add(job.articleId);

    try {
        console.log(`[Recreation Queue] Processing article ${job.articleId}...`);

        const startTime = Date.now();
        const recreatedUrl = await recreateImage(
            job.originalImageUrl,
            job.articleId,
            job.title,
            job.category
        );

        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        if (recreatedUrl) {
            console.log(`[Recreation Queue] ✅ Completed article ${job.articleId} in ${duration}s`);
        } else {
            console.log(`[Recreation Queue] ❌ Failed article ${job.articleId}`);
        }
    } catch (error) {
        console.error(`[Recreation Queue] Error processing article ${job.articleId}:`, error);
    } finally {
        processingJobs.delete(job.articleId);

        // Process next job after a short delay
        setTimeout(() => {
            if (recreationQueue.length > 0) {
                processQueue();
            }
        }, 1000); // 1 second delay between jobs
    }
}

/**
 * Get queue status
 */
export function getQueueStatus(): {
    pending: number;
    processing: number;
} {
    return {
        pending: recreationQueue.length,
        processing: processingJobs.size,
    };
}

/**
 * Check if an article is being processed or queued
 */
export function isArticleQueued(articleId: string): boolean {
    return processingJobs.has(articleId) ||
        recreationQueue.some(job => job.articleId === articleId);
}
