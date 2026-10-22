import { Router, type IRouter, type Request, type Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { requireAuth } from "./auth";

const router: IRouter = Router();

/**
 * Wraps an AI route handler: OpenAI SDK errors (e.g. rejected images) no longer
 * fall through to Express's default handler with a bare status code. Client
 * 4xx errors from the AI service map to a friendly 400; everything else to 502.
 */
function safe(
  handler: (req: Request, res: Response) => Promise<void>,
  invalidInputMessage: string,
) {
  return async (req: Request, res: Response) => {
    try {
      await handler(req, res);
    } catch (err) {
      req.log.error({ err }, "AI route error");
      if (res.headersSent) return;
      const status = (err as { status?: number })?.status;
      if (typeof status === "number" && status >= 400 && status < 500) {
        res.status(400).json({ error: invalidInputMessage });
      } else {
        res.status(502).json({ error: "The AI service is temporarily unavailable. Please try again in a moment." });
      }
    }
  };
}

router.post("/ai/analyze-image", requireAuth, safe(async (req, res) => {
  const { imageDataUri } = req.body as { imageDataUri?: string };

  if (!imageDataUri || typeof imageDataUri !== "string") {
    res.status(400).json({ error: "imageDataUri is required" });
    return;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-5.4",
    max_completion_tokens: 256,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are an expert AI at analyzing images to generate relevant search queries for an e-commerce and local services app called Ghar Tak.
Identify the primary subject(s) in the uploaded image and describe them in a short, effective search query (2-5 words).
Focus on what a user would search for to find this item, similar items, or related services.
Generate ONLY the search query (e.g. "red running shoe", "plumber sink repair"). If you cannot determine a useful query, output an empty string.`,
          },
          {
            type: "image_url",
            image_url: { url: imageDataUri },
          },
        ],
      },
    ],
  });

  const searchQuery = (completion.choices[0]?.message?.content ?? "").trim();
  res.json({ searchQuery });
}, "That image couldn't be processed. Please try a clear JPEG or PNG photo."));

router.post("/ai/describe-image", requireAuth, safe(async (req, res) => {
  const { imageDataUri } = req.body as { imageDataUri?: string };

  if (!imageDataUri || typeof imageDataUri !== "string") {
    res.status(400).json({ error: "imageDataUri is required" });
    return;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-5.4",
    max_completion_tokens: 512,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are an expert image analyst for an application called "Ghar Tak". Look at the image provided and describe what you see in a clear, concise, and helpful paragraph.
Include: the main subject(s), the setting or background, notable colors/styles/textures, any actions or activities, and the likely context or purpose.`,
          },
          {
            type: "image_url",
            image_url: { url: imageDataUri },
          },
        ],
      },
    ],
  });

  const description = (completion.choices[0]?.message?.content ?? "").trim();
  res.json({ description });
}, "That image couldn't be processed. Please try a clear JPEG or PNG photo."));

router.post("/ai/chatbot", requireAuth, safe(async (req, res) => {
  const { message } = req.body as { message?: string };

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "message is required" });
    return;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-5.4",
    max_completion_tokens: 512,
    messages: [
      {
        role: "system",
        content: `You are the "Ghar Tak Assistant," a friendly and helpful AI chatbot for a hyperlocal delivery and services app called "Ghar Tak."
Your primary goal is to assist users by answering their questions about the app, its features, and how to use it. Be conversational, polite, and concise.

Key features of Ghar Tak:
- It connects users to local stores for product delivery (groceries, electronics, etc.) and to local service professionals (plumbers, cleaners, mechanics, etc.).
- It has AI-powered search, image search, QR code scanning, and a provider dashboard for sellers.
- The app operates across many cities.

If a user asks something outside your scope, politely explain you are the Ghar Tak assistant.`,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  const response = (completion.choices[0]?.message?.content ?? "").trim();
  res.json({ response });
}, "The assistant couldn't process that message. Please rephrase and try again."));

router.post("/ai/recommendations", requireAuth, safe(async (req, res) => {
  const { userLocation, pastPurchases, nearbyStores } = req.body as {
    userLocation?: { latitude: number; longitude: number };
    pastPurchases?: string[];
    nearbyStores?: Array<{ storeName: string; products: string[] }>;
  };

  const context = [
    pastPurchases?.length
      ? `Past purchases: ${pastPurchases.join(", ")}`
      : "No past purchase history.",
    nearbyStores?.length
      ? `Nearby stores and their products:\n${nearbyStores.map((s) => `- ${s.storeName}: ${s.products.join(", ")}`).join("\n")}`
      : "No nearby store information.",
    userLocation
      ? `User location: lat ${userLocation.latitude}, lon ${userLocation.longitude}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-5.4",
    max_completion_tokens: 256,
    messages: [
      {
        role: "user",
        content: `You are a personal shopping assistant for "Ghar Tak". Based on the following context, suggest up to 5 product names the user might be interested in. Reply with ONLY a JSON array of product name strings, e.g. ["milk", "bread", "eggs"]. No explanation.

${context}`,
      },
    ],
  });

  let recommendations: string[] = [];
  try {
    const raw = (completion.choices[0]?.message?.content ?? "").trim();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      recommendations = parsed.filter((x): x is string => typeof x === "string");
    }
  } catch {
    recommendations = [];
  }

  res.json({ recommendations });
}, "Couldn't generate suggestions right now. Please try again later."));

export default router;
