import { Router, type IRouter, type Request, type Response } from "express";
import { db, addressesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "./auth";

const router: IRouter = Router();

function mapAddress(a: any) {
  return {
    id: a.id,
    label: a.label,
    line1: a.line1,
    city: a.city,
    phone: a.phone ?? null,
    instructions: a.instructions ?? null,
    isDefault: a.isDefault ?? false,
    createdAt: a.createdAt.toISOString(),
  };
}

// GET /api/addresses
router.get("/addresses", requireAuth, async (req: Request, res: Response) => {
  const clerkUserId = (req as any).clerkUserId as string;
  try {
    const rows = await db
      .select()
      .from(addressesTable)
      .where(eq(addressesTable.userId, clerkUserId));
    rows.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
    res.json(rows.map(mapAddress));
  } catch (err) {
    req.log.error({ err }, "GET /addresses error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/addresses
router.post("/addresses", requireAuth, async (req: Request, res: Response) => {
  const clerkUserId = (req as any).clerkUserId as string;
  const { label, line1, city, phone, instructions, isDefault } = req.body as {
    label?: string;
    line1: string;
    city: string;
    phone?: string;
    instructions?: string;
    isDefault?: boolean;
  };

  if (!line1 || !city) {
    res.status(400).json({ error: "line1 and city are required" });
    return;
  }

  try {
    if (isDefault) {
      await db
        .update(addressesTable)
        .set({ isDefault: false })
        .where(eq(addressesTable.userId, clerkUserId));
    }

    const [address] = await db
      .insert(addressesTable)
      .values({
        userId: clerkUserId,
        label: label?.trim() || "Home",
        line1,
        city,
        phone: phone ?? null,
        instructions: instructions ?? null,
        isDefault: isDefault ?? false,
      })
      .returning();

    res.status(201).json(mapAddress(address));
  } catch (err) {
    req.log.error({ err }, "POST /addresses error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/addresses/:addressId
router.patch("/addresses/:addressId", requireAuth, async (req: Request, res: Response) => {
  const clerkUserId = (req as any).clerkUserId as string;
  const { addressId } = req.params as Record<string, string>;
  const body = req.body as Partial<{
    label: string;
    line1: string;
    city: string;
    phone: string;
    instructions: string;
    isDefault: boolean;
  }>;

  try {
    const [existing] = await db
      .select()
      .from(addressesTable)
      .where(and(eq(addressesTable.id, addressId), eq(addressesTable.userId, clerkUserId)))
      .limit(1);

    if (!existing) {
      res.status(404).json({ error: "Address not found" });
      return;
    }

    if (body.isDefault) {
      await db
        .update(addressesTable)
        .set({ isDefault: false })
        .where(eq(addressesTable.userId, clerkUserId));
    }

    const [updated] = await db
      .update(addressesTable)
      .set({
        ...(body.label !== undefined ? { label: body.label } : {}),
        ...(body.line1 !== undefined ? { line1: body.line1 } : {}),
        ...(body.city !== undefined ? { city: body.city } : {}),
        ...(body.phone !== undefined ? { phone: body.phone } : {}),
        ...(body.instructions !== undefined ? { instructions: body.instructions } : {}),
        ...(body.isDefault !== undefined ? { isDefault: body.isDefault } : {}),
        updatedAt: new Date(),
      })
      .where(eq(addressesTable.id, addressId))
      .returning();

    res.json(mapAddress(updated));
  } catch (err) {
    req.log.error({ err }, "PATCH /addresses/:id error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/addresses/:addressId
router.delete("/addresses/:addressId", requireAuth, async (req: Request, res: Response) => {
  const clerkUserId = (req as any).clerkUserId as string;
  const { addressId } = req.params as Record<string, string>;

  try {
    const [existing] = await db
      .select({ id: addressesTable.id })
      .from(addressesTable)
      .where(and(eq(addressesTable.id, addressId), eq(addressesTable.userId, clerkUserId)))
      .limit(1);

    if (!existing) {
      res.status(404).json({ error: "Address not found" });
      return;
    }

    await db.delete(addressesTable).where(eq(addressesTable.id, addressId));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "DELETE /addresses/:id error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
