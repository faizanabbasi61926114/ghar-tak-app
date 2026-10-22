import { Router, type IRouter, type Request, type Response } from "express";
import { db, ordersTable, providersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "./auth";

const router: IRouter = Router();

function mapOrder(o: any) {
  return {
    id: o.id,
    customerId: o.customerId,
    customerName: o.customerName ?? null,
    providerId: o.providerId,
    providerName: o.providerName,
    status: o.status,
    total: Number(o.total),
    paymentMethod: o.paymentMethod,
    deliveryAddress: o.deliveryAddress ?? null,
    notes: o.notes ?? null,
    items: Array.isArray(o.items) ? o.items : [],
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  };
}

// GET /api/orders (customer's orders)
router.get("/orders", requireAuth, async (req: Request, res: Response) => {
  const clerkUserId = (req as any).clerkUserId as string;
  try {
    const rows = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.customerId, clerkUserId))
      .orderBy(ordersTable.createdAt);
    res.json(rows.map(mapOrder).reverse());
  } catch (err) {
    req.log.error({ err }, "GET /orders error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/orders
router.post("/orders", requireAuth, async (req: Request, res: Response) => {
  const clerkUserId = (req as any).clerkUserId as string;
  const body = req.body as any;

  try {
    const [provider] = await db
      .select({ id: providersTable.id, name: providersTable.name })
      .from(providersTable)
      .where(eq(providersTable.id, body.providerId))
      .limit(1);

    if (!provider) {
      res.status(404).json({ error: "Provider not found" });
      return;
    }

    const total = (body.items as any[]).reduce(
      (sum: number, item: any) => sum + item.quantity * item.unitPrice,
      0,
    );

    const [order] = await db
      .insert(ordersTable)
      .values({
        customerId: clerkUserId,
        providerId: body.providerId,
        providerName: provider.name,
        status: "pending",
        total: String(total),
        paymentMethod: body.paymentMethod ?? "cash_on_delivery",
        deliveryAddress: body.deliveryAddress ?? null,
        notes: body.notes ?? null,
        items: body.items,
      })
      .returning();

    res.status(201).json(mapOrder(order));
  } catch (err) {
    req.log.error({ err }, "POST /orders error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/orders/:orderId
router.get("/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
  const clerkUserId = (req as any).clerkUserId as string;
  const { orderId } = req.params as Record<string, string>;

  try {
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, orderId))
      .limit(1);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    // Must be the customer or the provider owner
    const [provider] = await db
      .select({ userId: providersTable.userId })
      .from(providersTable)
      .where(eq(providersTable.id, order.providerId))
      .limit(1);

    const isOwner = order.customerId === clerkUserId || provider?.userId === clerkUserId;
    if (!isOwner) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    res.json(mapOrder(order));
  } catch (err) {
    req.log.error({ err }, "GET /orders/:id error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/orders/:orderId
router.patch("/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
  const clerkUserId = (req as any).clerkUserId as string;
  const { orderId } = req.params as Record<string, string>;
  const { status } = req.body as { status: string };

  try {
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, orderId))
      .limit(1);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    // Provider can update any status; customer can only cancel
    const [provider] = await db
      .select({ userId: providersTable.userId })
      .from(providersTable)
      .where(eq(providersTable.id, order.providerId))
      .limit(1);

    const isProvider = provider?.userId === clerkUserId;
    const isCustomer = order.customerId === clerkUserId;

    if (!isProvider && !isCustomer) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (isCustomer && !isProvider && status !== "cancelled") {
      res.status(401).json({ error: "Customers can only cancel orders" });
      return;
    }

    const [updated] = await db
      .update(ordersTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(ordersTable.id, orderId))
      .returning();

    res.json(mapOrder(updated));
  } catch (err) {
    req.log.error({ err }, "PATCH /orders/:id error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/provider-orders (provider's incoming orders)
router.get("/provider-orders", requireAuth, async (req: Request, res: Response) => {
  const clerkUserId = (req as any).clerkUserId as string;

  try {
    const [provider] = await db
      .select({ id: providersTable.id })
      .from(providersTable)
      .where(eq(providersTable.userId, clerkUserId))
      .limit(1);

    if (!provider) {
      res.json([]);
      return;
    }

    const rows = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.providerId, provider.id))
      .orderBy(ordersTable.createdAt);

    res.json(rows.map(mapOrder).reverse());
  } catch (err) {
    req.log.error({ err }, "GET /provider-orders error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
