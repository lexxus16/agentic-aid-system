// SummarizeIncident story implementation.

'use server';

/**
 * @fileOverview A Genkit flow to summarize incidents from Reddit posts using the Gemini API.
 *
 * - summarizeIncident - A function that summarizes an incident.
 * - SummarizeIncidentInput - The input type for the summarizeIncident function.
 * - SummarizeIncidentOutput - The return type for the summarizeIncident function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeIncidentInputSchema = z.object({
  redditPostContent: z
    .string()
    .describe('The content of the Reddit post to summarize.'),
});
export type SummarizeIncidentInput = z.infer<typeof SummarizeIncidentInputSchema>;

const SummarizeIncidentOutputSchema = z.object({
  summary: z.string().describe('A short, professional summary of the incident.'),
});
export type SummarizeIncidentOutput = z.infer<typeof SummarizeIncidentOutputSchema>;

export async function summarizeIncident(input: SummarizeIncidentInput): Promise<SummarizeIncidentOutput> {
  return summarizeIncidentFlow(input);
}

const summarizeIncidentPrompt = ai.definePrompt({
  name: 'summarizeIncidentPrompt',
  input: {schema: SummarizeIncidentInputSchema},
  output: {schema: SummarizeIncidentOutputSchema},
  prompt: `You are an expert summarizer, skilled at extracting key information from text and providing concise, professional summaries.

  Please summarize the following incident report from Reddit:

  {{redditPostContent}}`,
});

const summarizeIncidentFlow = ai.defineFlow(
  {
    name: 'summarizeIncidentFlow',
    inputSchema: SummarizeIncidentInputSchema,
    outputSchema: SummarizeIncidentOutputSchema,
  },
  async input => {
    const {output} = await summarizeIncidentPrompt(input);
    return output!;
  }
);
