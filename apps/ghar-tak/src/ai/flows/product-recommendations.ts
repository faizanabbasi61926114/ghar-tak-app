import { postAi } from './post-ai';

export type PersonalizedProductRecommendationsInput = {
  userLocation?: { latitude: number; longitude: number };
  pastPurchases?: string[];
  nearbyStores?: Array<{ storeName: string; products: string[] }>;
};
export type PersonalizedProductRecommendationsOutput = { recommendedProducts: string[] };

export async function getPersonalizedProductRecommendations(
  input: PersonalizedProductRecommendationsInput
): Promise<PersonalizedProductRecommendationsOutput> {
  const data = await postAi<{ recommendations: string[] }>(
    '/api/ai/recommendations',
    input,
    'Please sign in to get personalized suggestions.',
  );
  return { recommendedProducts: data.recommendations };
}
