
'use server';
/**
 * @fileOverview An image analysis AI agent for generating search queries.
 *
 * - analyzeImageForSearch - A function that handles the image analysis process.
 * - AnalyzeImageInput - The input type for the analyzeImageForSearch function.
 * - AnalyzeImageOutput - The return type for the analyzeImageForSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

const AnalyzeImageOutputSchema = z.object({
  searchQuery: z.string().describe('A concise search query based on the image content, suitable for a product/service search engine. Should be 2-5 words, or empty if analysis is inconclusive.'),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeImageForSearch(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImagePrompt',
  input: {schema: AnalyzeImageInputSchema},
  output: {schema: AnalyzeImageOutputSchema},
  prompt: `You are an expert AI at analyzing images to generate relevant search queries for an e-commerce and local services app called Ghar Tak.
Your goal is to identify the primary subject(s) in the uploaded image and describe them in a short, effective search query (2-5 words).
Consider the following:
- What is the most prominent object, person, animal, or activity in the image?
- What would a user typically search for if they wanted to find this item, a similar item, or a related service?
- If the background or setting provides important context (e.g., a "beach umbrella" vs. just "umbrella", or "wedding photographer" based on a wedding scene), incorporate it if it makes the query more specific and useful for finding products to buy or services to book.
- Focus on nouns and descriptive adjectives. Avoid questions or full sentences.

Image: {{media url=imageDataUri}}

Generate ONLY the search query. For example, if the image is of a red running shoe, output: "red running shoe". If it's a plumber fixing a sink, output: "plumber sink repair". If you cannot confidently determine a useful query, output an empty string.`,
});

const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output?.searchQuery || output.searchQuery.trim() === "") {
        console.warn("AI did not return a valid search query for the image or returned an empty one. Returning empty query.");
        return { searchQuery: "" }; 
    }
    return output;
  }
);
