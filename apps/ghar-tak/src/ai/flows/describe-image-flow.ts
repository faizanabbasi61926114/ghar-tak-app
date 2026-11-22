import { postAi } from './post-ai';

export type DescribeImageInput = { imageDataUri: string };
export type DescribeImageOutput = { description: string };

export function describeImage(input: DescribeImageInput): Promise<DescribeImageOutput> {
  return postAi<DescribeImageOutput>(
    '/api/ai/describe-image',
    { imageDataUri: input.imageDataUri },
    'Please sign in to analyze images.',
  );
}
