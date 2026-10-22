export type AnalyzeImageInput = { imageDataUri: string };
export type AnalyzeImageOutput = { searchQuery: string };

export async function analyzeImageForSearch(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  const res = await fetch('/api/ai/analyze-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageDataUri: input.imageDataUri }),
  });
  if (res.status === 401) throw new Error('Please sign in to use image search.');
  if (!res.ok) {
    const body = await res.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error ?? `AI request failed: ${res.statusText}`);
  }
  return res.json() as Promise<AnalyzeImageOutput>;
}
