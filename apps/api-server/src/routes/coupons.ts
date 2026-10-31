import { Router, type IRouter, type Request, type Response } from "express";
import { db, couponsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "./auth";

const router: IRouter = Router();

export function computeDiscount(coupon: { type: string; value: string; maxDiscount: string | null }, subtotal: number) {
  const value = Number(coupon.value);
  let discount = coupon.type === "percent" ? (subtotal * value) / 100 : value;
  if (coupon.type === "percent" && coupon.maxDiscount) {
    discount = Math.min(discount, Number(coupon.maxDiscount));
  }
  return Math.min(Math.round(discount * 100) / 100, subtotal);
}

export async function resolveCoupon(code: string, subtotal: number) {
  const [coupon] = await db
    .select()
    .from(couponsTable)
    .where(eq(couponsTable.code, code.trim().toUpperCase()))
    .limit(1);

  if (!coupon || !coupon.active) return { valid: false as const, reason: "Invalid coupon code" };
  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
    return { valid: false as const, reason: "This coupon has expired" };
  }
  if (subtotal < Number(coupon.minOrder)) {
    return {
      valid: false as const,
      reason: `Minimum order of PKR ${Number(coupon.minOrder).toFixed(0)} required for this coupon`,
    };
  }
  return {
    valid: true as const,
    code: coupon.code,
    description: coupon.description ?? null,
    discount: computeDiscount(coupon, subtotal),
  };
}

// POST /api/coupons/validate
router.post("/coupons/validate", requireAuth, async (req: Request, res: Response) => {
  const { code, subtotal } = req.body as { code?: string; subtotal?: number };

  if (!code || typeof subtotal !== "number" || subtotal < 0) {
    res.status(400).json({ error: "code and subtotal are required" });
    return;
  }

  try {
    const result = await resolveCoupon(code, subtotal);
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "POST /coupons/validate error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
