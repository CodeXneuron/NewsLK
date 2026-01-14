'use server';
/**
 * @fileOverview A flow that summarizes a news article for a push notification.
 *
 * - summarizeArticleForNotification - A function that takes a news article URL and returns a summary.
 * - SummarizeArticleForNotificationInput - The input type for the summarizeArticleForNotification function.
 * - SummarizeArticleForNotificationOutput - The return type for the summarizeArticleForNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeArticleForNotificationInputSchema = z.object({
  articleUrl: z.string().url().describe('The URL of the news article to summarize.'),
});
export type SummarizeArticleForNotificationInput = z.infer<typeof SummarizeArticleForNotificationInputSchema>;

const SummarizeArticleForNotificationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the news article, suitable for a push notification.'),
});
export type SummarizeArticleForNotificationOutput = z.infer<typeof SummarizeArticleForNotificationOutputSchema>;

export async function summarizeArticleForNotification(input: SummarizeArticleForNotificationInput): Promise<SummarizeArticleForNotificationOutput> {
  return summarizeArticleForNotificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeArticleForNotificationPrompt',
  input: {schema: SummarizeArticleForNotificationInputSchema},
  output: {schema: SummarizeArticleForNotificationOutputSchema},
  prompt: `You are an expert news summarizer.  You will be provided the URL of a news article.
Your job is to summarize the article in a concise manner suitable for a push notification.

Article URL: {{{articleUrl}}}

Summary: `,
});

const summarizeArticleForNotificationFlow = ai.defineFlow(
  {
    name: 'summarizeArticleForNotificationFlow',
    inputSchema: SummarizeArticleForNotificationInputSchema,
    outputSchema: SummarizeArticleForNotificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
