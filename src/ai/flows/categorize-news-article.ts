'use server';

/**
 * @fileOverview A news article categorization AI agent.
 *
 * - categorizeNewsArticle - A function that categorizes news articles.
 * - CategorizeNewsArticleInput - The input type for the categorizeNewsArticle function.
 * - CategorizeNewsArticleOutput - The return type for the categorizeNewsArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeNewsArticleInputSchema = z.object({
  title: z.string().describe('The title of the news article.'),
  description: z.string().describe('A short description or summary of the news article.'),
});
export type CategorizeNewsArticleInput = z.infer<typeof CategorizeNewsArticleInputSchema>;

const CategorizeNewsArticleOutputSchema = z.object({
  category: z
    .enum([
      'Breaking News',
      'Politics',
      'Sports',
      'Entertainment',
      'Local News',
      'International',
    ])
    .describe('The category that best fits the news article.'),
});
export type CategorizeNewsArticleOutput = z.infer<typeof CategorizeNewsArticleOutputSchema>;

export async function categorizeNewsArticle(
  input: CategorizeNewsArticleInput
): Promise<CategorizeNewsArticleOutput> {
  return categorizeNewsArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeNewsArticlePrompt',
  input: {schema: CategorizeNewsArticleInputSchema},
  output: {schema: CategorizeNewsArticleOutputSchema},
  prompt: `You are a news categorization expert. Given the title and description of a news article, determine the most appropriate category for the article from the following list: Breaking News, Politics, Sports, Entertainment, Local News, International.\n\nTitle: {{{title}}}\nDescription: {{{description}}}\nCategory:`,
});

const categorizeNewsArticleFlow = ai.defineFlow(
  {
    name: 'categorizeNewsArticleFlow',
    inputSchema: CategorizeNewsArticleInputSchema,
    outputSchema: CategorizeNewsArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
