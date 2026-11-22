import { postAi } from './post-ai';

export type AnalyzeImageInput = { imageDataUri: string };
export type AnalyzeImageOutput = { searchQuery: string };

export function analyzeImageForSearch(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return postAi<AnalyzeImageOutput>(
    '/api/ai/analyze-image',
    { imageDataUri: input.imageDataUri },
    'Please sign in to use image search.',
  );
}
