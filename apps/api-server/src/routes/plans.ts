import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    interval: "monthly",
    features: [
      "Up to 10 products",
      "Up to 5 services",
      "Basic analytics",
      "Community support",
      "Ghar Tak listing",
    ],
    productLimit: 10,
    serviceLimit: 5,
    isPopular: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: 1999,
    interval: "monthly",
    features: [
      "Up to 100 products",
      "Up to 30 services",
      "Advanced analytics",
      "Priority support",
      "Featured listing",
      "Order management",
      "Customer reviews",
    ],
    productLimit: 100,
    serviceLimit: 30,
    isPopular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 4999,
    interval: "monthly",
    features: [
      "Unlimited products",
      "Unlimited services",
      "Full analytics dashboard",
      "Dedicated support",
      "Top featured listing",
      "Advanced order management",
      "Customer reviews & replies",
      "Custom branding",
      "API access",
    ],
    productLimit: 999999,
    serviceLimit: 999999,
    isPopular: false,
  },
];

// GET /api/plans
router.get("/plans", (_req, res: Response) => {
  res.json(PLANS);
});

export default router;
