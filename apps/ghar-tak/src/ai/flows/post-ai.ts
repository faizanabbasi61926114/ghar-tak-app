// The AI answers come from an outside service through the API. A request that never answers
// would leave the chat box, image search or "Just For You" spinning for ever, so it gives up
// after this long. The API's own limit on the AI service (30 s, one retry) fits inside it.
const AI_TIMEOUT_MS = 75_000;

/**
 * Posts to one of the API's AI routes. A failure is thrown as an Error whose message can be
 * shown to the customer as it is.
 */
export async function postAi<T>(path: string, body: unknown, signInMessage: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (res.status === 401) throw new Error(signInMessage);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(data?.error ?? `AI request failed: ${res.statusText}`);
    }
    return (await res.json()) as T;
  } catch (error) {
    if (controller.signal.aborted) throw new Error('This is taking too long. Please try again.');
    // fetch rejects with a TypeError when the request never reached the server.
    if (error instanceof TypeError) throw new Error("Can't reach Ghar Tak. Check your connection and try again.");
    if (error instanceof SyntaxError) throw new Error('Something went wrong. Please try again.');
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
