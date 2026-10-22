
'use server';
/**
 * @fileOverview An image description AI agent.
 *
 * - describeImage - A function that handles the image description process.
 * - DescribeImageInput - The input type for the describeImage function.
 * - DescribeImageOutput - The return type for the describeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DescribeImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DescribeImageInput = z.infer<typeof DescribeImageInputSchema>;

const DescribeImageOutputSchema = z.object({
  description: z.string().describe('A detailed text description of the image content, suitable for display to a user. It should identify objects, setting, colors, and potential activities.'),
});
export type DescribeImageOutput = z.infer<typeof DescribeImageOutputSchema>;

export async function describeImage(input: DescribeImageInput): Promise<DescribeImageOutput> {
  return describeImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'describeImagePrompt',
  input: {schema: DescribeImageInputSchema},
  output: {schema: DescribeImageOutputSchema},
  prompt: `You are an expert image analyst for an application called "Ghar Tak". Your task is to look at an image provided by a user and describe what you see in a clear, concise, and helpful paragraph.

Your description should include:
- The main subject(s) of the image (e.g., a person, an animal, an object).
- The setting or background (e.g., indoors, outdoors, a kitchen, a city street).
- Any notable colors, styles, or textures.
- Any actions or activities taking place.
- If possible, infer the context or purpose of the image. For example, is it a product photo, a scenic view, or a person asking for help with a repair?

Analyze the following image:
Image: {{media url=imageDataUri}}

Generate a user-friendly description.`,
});

const describeImageFlow = ai.defineFlow(
  {
    name: 'describeImageFlow',
    inputSchema: DescribeImageInputSchema,
    outputSchema: DescribeImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output?.description || output.description.trim() === "") {
        console.warn("AI did not return a valid description for the image.");
        return { description: "The AI could not generate a description for this image." };
    }
    return output;
  }
);
