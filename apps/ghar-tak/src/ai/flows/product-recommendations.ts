export type PersonalizedProductRecommendationsInput = {
  userLocation?: { latitude: number; longitude: number };
  pastPurchases?: string[];
  nearbyStores?: Array<{ storeName: string; products: string[] }>;
};
export type PersonalizedProductRecommendationsOutput = { recommendedProducts: string[] };

export async function getPersonalizedProductRecommendations(
  input: PersonalizedProductRecommendationsInput
): Promise<PersonalizedProductRecommendationsOutput> {
  const res = await fetch('/api/ai/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (res.status === 401) throw new Error('Please sign in to get personalized suggestions.');
  if (!res.ok) {
    const body = await res.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error ?? `AI request failed: ${res.statusText}`);
  }
  const data = await res.json() as { recommendations: string[] };
  return { recommendedProducts: data.recommendations };
}
