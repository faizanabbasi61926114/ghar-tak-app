import { Router, type IRouter, type Request, type Response } from "express";
import { db, reviewsTable, providersTable } from "@workspace/db";
import { eq, avg, count } from "drizzle-orm";
import { requireAuth } from "./auth";

const router: IRouter = Router();

function mapReview(r: any) {
  return {
    id: r.id,
    providerId: r.providerId,
    customerId: r.customerId,
    customerName: r.customerName ?? null,
    customerAvatarUrl: r.customerAvatarUrl ?? null,
    rating: r.rating,
    comment: r.comment ?? null,
    reply: r.reply ?? null,
    createdAt: r.createdAt.toISOString(),
  };
}

// GET /api/providers/:providerId/reviews
router.get("/providers/:providerId/reviews", async (req: Request, res: Response) => {
  const { providerId } = req.params as Record<string, string>;
  try {
    const rows = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.providerId, providerId))
      .orderBy(reviewsTable.createdAt);
    res.json(rows.map(mapReview).reverse());
  } catch (err) {
    req.log.error({ err }, "GET /providers/:id/reviews error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/providers/:providerId/reviews
router.post("/providers/:providerId/reviews", requireAuth, async (req: Request, res: Response) => {
  const clerkUserId = (req as any).clerkUserId as string;
  const { providerId } = req.params as Record<string, string>;
  const { rating, comment } = req.body as { rating: number; comment?: string };

  try {
    const [review] = await db
      .insert(reviewsTable)
      .values({
        providerId,
        customerId: clerkUserId,
        customerName: null,
        rating,
        comment: comment ?? null,
      })
      .returning();

    // Update provider avg rating
    const [stats] = await db
      .select({ avg: avg(reviewsTable.rating), count: count() })
      .from(reviewsTable)
      .where(eq(reviewsTable.providerId, providerId));

    if (stats) {
      await db
        .update(providersTable)
        .set({
          rating: String(Number(stats.avg ?? 0).toFixed(2)),
          reviewCount: Number(stats.count),
          updatedAt: new Date(),
        })
        .where(eq(providersTable.id, providerId));
    }

    res.status(201).json(mapReview(review));
  } catch (err) {
    req.log.error({ err }, "POST /providers/:id/reviews error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
