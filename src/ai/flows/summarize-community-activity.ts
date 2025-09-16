'use server';
/**
 * @fileOverview An AI agent that summarizes community activity.
 *
 * - summarizeCommunityActivity - A function that summarizes recent posts.
 * - SummarizeCommunityActivityInput - The input type for the summarizeCommunityActivity function.
 * - SummarizeCommunityActivityOutput - The return type for the summarizeCommunityActivity function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PostSchema = z.object({
  id: z.number(),
  author: z.string(),
  title: z.string(),
  content: z.string(),
});

const SummarizeCommunityActivityInputSchema = z.object({
  posts: z.array(PostSchema).describe('An array of recent posts from the community forum.'),
});
export type SummarizeCommunityActivityInput = z.infer<typeof SummarizeCommunityActivityInputSchema>;

const SummarizeCommunityActivityOutputSchema = z.object({
  summary: z.string().describe('A brief, engaging summary of the most important topics and urgent alerts from the posts. Use markdown for formatting.'),
});
export type SummarizeCommunityActivityOutput = z.infer<typeof SummarizeCommunityActivityOutputSchema>;

export async function summarizeCommunityActivity(input: SummarizeCommunityActivityInput): Promise<SummarizeCommunityActivityOutput> {
  return summarizeCommunityActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCommunityActivityPrompt',
  input: { schema: SummarizeCommunityActivityInputSchema },
  output: { schema: SummarizeCommunityActivityOutputSchema },
  prompt: `You are a community manager for a tourist app. Your task is to write a "Daily Digest" summarizing recent forum posts for travelers in Darjeeling.

  Analyze the following posts:
  \`\`\`json
  {{{json posts}}}
  \`\`\`

  Create a brief, engaging summary. Highlight any urgent alerts (like landslides or road closures) first. Then, mention the most popular discussion topics (like best food spots or activity recommendations). The summary should be helpful for a tourist who wants a quick update on what's happening. Use markdown for lists.
  `,
});

const summarizeCommunityActivityFlow = ai.defineFlow(
  {
    name: 'summarizeCommunityActivityFlow',
    inputSchema: SummarizeCommunityActivityInputSchema,
    outputSchema: SummarizeCommunityActivityOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('The model failed to generate a summary.');
    }
    return output;
  }
);
