
'use server';
/**
 * @fileOverview A conversational AI agent for the Ghar Tak chatbot.
 *
 * - getChatbotResponse - A function that handles generating a response for the chatbot.
 * - ChatbotInput - The input type for the getChatbotResponse function.
 * - ChatbotOutput - The return type for the getChatbotResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotInputSchema = z.object({
  message: z.string().describe("The user's message to the chatbot."),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe("The AI-generated response to the user's message."),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function getChatbotResponse(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  prompt: `You are the "Ghar Tak Assistant," a friendly and helpful AI chatbot for a hyperlocal delivery and services app called "Ghar Tak."

Your primary goal is to assist users by answering their questions about the app, its features, and how to use it. Be conversational, polite, and concise.

Key features of Ghar Tak you should know about:
- It connects users to local stores for product delivery (like groceries, electronics) and to local service professionals (like plumbers, cleaners, mechanics).
- It has features like AI-powered search, image search, QR code scanning, and a provider dashboard for sellers.
- The app operates across many cities.

Your persona:
- Friendly and approachable.
- Knowledgeable about the app.
- Patient and helpful.

If a user asks something you cannot answer or is outside your scope (e.g., personal opinions, complex non-app related topics), politely state that you are an assistant for the Ghar Tak app and can only help with app-related inquiries. If the user sends an image or asks about media, state that you can only process text for now.

User's message: {{{message}}}
`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
