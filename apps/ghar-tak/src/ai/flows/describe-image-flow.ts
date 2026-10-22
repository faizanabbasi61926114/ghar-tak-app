export type DescribeImageInput = { imageDataUri: string };
export type DescribeImageOutput = { description: string };

export async function describeImage(input: DescribeImageInput): Promise<DescribeImageOutput> {
  const res = await fetch('/api/ai/describe-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageDataUri: input.imageDataUri }),
  });
  if (res.status === 401) throw new Error('Please sign in to analyze images.');
  if (!res.ok) {
    const body = await res.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error ?? `AI request failed: ${res.statusText}`);
  }
  return res.json() as Promise<DescribeImageOutput>;
}
