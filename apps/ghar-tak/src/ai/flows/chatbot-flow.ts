export type ChatbotInput = { message: string };
export type ChatbotOutput = { response: string };

export async function getChatbotResponse(input: ChatbotInput): Promise<ChatbotOutput> {
  const res = await fetch('/api/ai/chatbot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: input.message }),
  });
  if (res.status === 401) throw new Error('Please sign in to use the assistant.');
  if (!res.ok) {
    const body = await res.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error ?? `AI request failed: ${res.statusText}`);
  }
  return res.json() as Promise<ChatbotOutput>;
}
