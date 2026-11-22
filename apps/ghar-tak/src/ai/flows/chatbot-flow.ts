import { postAi } from './post-ai';

export type ChatTurn = { role: 'user' | 'assistant'; content: string };
/** `history` is the conversation so far, so the assistant can follow up on earlier answers. */
export type ChatbotInput = { message: string; history?: ChatTurn[] };
export type ChatbotOutput = { response: string };

export function getChatbotResponse(input: ChatbotInput): Promise<ChatbotOutput> {
  return postAi<ChatbotOutput>(
    '/api/ai/chatbot',
    { message: input.message, history: input.history ?? [] },
    'Please sign in to use the assistant.',
  );
}
