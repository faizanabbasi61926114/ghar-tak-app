
'use server';

/**
 * @fileOverview A personalized product recommendation AI agent.
 *
 * - getPersonalizedProductRecommendations - A function that handles the product recommendation process.
 * - PersonalizedProductRecommendationsInput - The input type for the getPersonalizedProductRecommendations function.
 * - PersonalizedProductRecommendationsOutput - The return type for the getPersonalizedProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedProductRecommendationsInputSchema = z.object({
  userLocation: z
    .object({
      latitude: z.number().describe('The latitude of the user.'),
      longitude: z.number().describe('The longitude of the user.'),
    })
    .describe('The current location of the user.'),
  pastPurchases: z
    .array(z.string())
    .describe('A list of product names the user has purchased in the past.'),
  nearbyStores: z
    .array(
      z.object({
        storeName: z.string().describe('The name of the store.'),
        products: z.array(z.string()).describe('A list of product names the store sells.'),
      })
    )
    .describe('A list of nearby stores and the products they sell.'),
});
export type PersonalizedProductRecommendationsInput = z.infer<typeof PersonalizedProductRecommendationsInputSchema>;

const PersonalizedProductRecommendationsOutputSchema = z.object({
  recommendedProducts: z
    .array(z.string())
    .describe('A list of product names recommended to the user based on their location and past purchases.'),
});
export type PersonalizedProductRecommendationsOutput = z.infer<typeof PersonalizedProductRecommendationsOutputSchema>;

export async function getPersonalizedProductRecommendations(
  input: PersonalizedProductRecommendationsInput
): Promise<PersonalizedProductRecommendationsOutput> {
  return personalizedProductRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedProductRecommendationsPrompt',
  input: {schema: PersonalizedProductRecommendationsInputSchema},
  output: {schema: PersonalizedProductRecommendationsOutputSchema},
  prompt: `You are a personal shopping assistant for a hyperlocal delivery app called "Ghar Tak". Your goal is to provide relevant product recommendations.

You are given the user's current location, a list of their past purchases, and a list of nearby stores along with some products they offer.

Based on this information, suggest up to 5 product names that the user might be interested in.
- Prioritize items that are commonly needed or popular.
- If past purchases exist, try to find complementary items or items from similar categories available in nearby stores.
- Consider the types of products typically sold in the nearby stores.
- Do not suggest products that are not likely to be available in the provided nearby stores.

User Location: Latitude: {{{userLocation.latitude}}}, Longitude: {{{userLocation.longitude}}}
Past Purchases:
{{#if pastPurchases}}
  {{#each pastPurchases}}- {{{this}}}\n  {{/each}}
{{else}}
  None
{{/if}}
Nearby Stores:
{{#if nearbyStores}}
  {{#each nearbyStores}}
- Store Name: {{{storeName}}}, Products: {{#each products}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}\n  {{/each}}
{{else}}
  No nearby stores found.
{{/if}}

Recommend products that would be genuinely useful or appealing. If no relevant products can be determined from the context (e.g., no nearby stores or products, and no past purchases to go by), return an empty array for recommendedProducts.
`,
});

const personalizedProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedProductRecommendationsFlow',
    inputSchema: PersonalizedProductRecommendationsInputSchema,
    outputSchema: PersonalizedProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return { recommendedProducts: output?.recommendedProducts || [] };
  }
);
