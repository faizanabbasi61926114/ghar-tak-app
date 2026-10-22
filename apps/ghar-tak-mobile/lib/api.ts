const getBaseUrl = () => {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}`;
  return "";
};

export async function getChatbotResponse(message: string): Promise<string> {
  const res = await fetch(`${getBaseUrl()}/api/ai/chatbot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("Chatbot request failed");
  const data = (await res.json()) as { response: string };
  return data.response;
}

export async function analyzeImageForSearch(imageDataUri: string): Promise<string> {
  const res = await fetch(`${getBaseUrl()}/api/ai/analyze-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageDataUri }),
  });
  if (!res.ok) throw new Error("Image analysis failed");
  const data = (await res.json()) as { searchQuery: string };
  return data.searchQuery;
}

export async function describeImage(imageDataUri: string): Promise<string> {
  const res = await fetch(`${getBaseUrl()}/api/ai/describe-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageDataUri }),
  });
  if (!res.ok) throw new Error("Image description failed");
  const data = (await res.json()) as { description: string };
  return data.description;
}

export async function getRecommendations(): Promise<string[]> {
  const res = await fetch(`${getBaseUrl()}/api/ai/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error("Recommendations request failed");
  const data = (await res.json()) as { recommendations: string[] };
  return data.recommendations ?? [];
}
