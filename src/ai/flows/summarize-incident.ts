
'use server';

/**
 * @fileOverview A Genkit flow to summarize and categorize incidents from Reddit posts using the Gemini API.
 *
 * - summarizeIncident - A function that summarizes and categorizes an incident.
 * - SummarizeIncidentInput - The input type for the summarizeIncident function.
 * - SummarizeIncidentOutput - The return type for the summarizeIncident function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeIncidentInputSchema = z.object({
  redditPostContent: z
    .string()
    .describe('The content of the Reddit post to summarize and categorize.'),
});
export type SummarizeIncidentInput = z.infer<typeof SummarizeIncidentInputSchema>;

const SummarizeIncidentOutputSchema = z.object({
  summary: z.string().describe('A short, professional summary of the incident.'),
  category: z.string().describe('A category for the incident, e.g., "Traffic", "Utility Outage", "Public Safety", "Protest", "Fire", "Crime", "Other".'),
});
export type SummarizeIncidentOutput = z.infer<typeof SummarizeIncidentOutputSchema>;

export async function summarizeIncident(input: SummarizeIncidentInput): Promise<SummarizeIncidentOutput> {
  return summarizeIncidentFlow(input);
}

const summarizeIncidentPrompt = ai.definePrompt({
  name: 'summarizeIncidentPrompt',
  input: {schema: SummarizeIncidentInputSchema},
  output: {schema: SummarizeIncidentOutputSchema},
  prompt: `You are an expert incident analyst. Your task is to analyze the provided text, which is from a social media post about an incident in Karachi.

  First, provide a concise, professional summary of the incident.
  Second, categorize the incident. Use one of the following categories: "Traffic", "Utility Outage", "Public Safety", "Protest", "Fire", "Crime", "Other". If unsure, use "Other".

  Reddit Post Content:
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
