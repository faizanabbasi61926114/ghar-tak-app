import { Router, type IRouter, type Response } from "express";

const router: IRouter = Router();

const CATEGORIES = [
  { id: "plumber", name: "Plumber", icon: "Wrench", type: "service", description: "Pipe & leak repairs" },
  { id: "electrician", name: "Electrician", icon: "Zap", type: "service", description: "Electrical work" },
  { id: "cleaner", name: "Cleaner", icon: "Sparkles", type: "service", description: "Home cleaning" },
  { id: "mechanic", name: "Mechanic", icon: "Settings", type: "service", description: "Vehicle repair" },
  { id: "painter", name: "Painter", icon: "PaintBucket", type: "service", description: "Painting services" },
  { id: "carpenter", name: "Carpenter", icon: "Hammer", type: "service", description: "Woodwork & furniture" },
  { id: "tutor", name: "Tutor", icon: "BookOpen", type: "service", description: "Private tuition" },
  { id: "driver", name: "Driver", icon: "Car", type: "service", description: "Personal driver" },
  { id: "groceries", name: "Groceries", icon: "ShoppingBasket", type: "product", description: "Daily groceries" },
  { id: "electronics", name: "Electronics", icon: "Cpu", type: "product", description: "Gadgets & devices" },
  { id: "pharmacy", name: "Pharmacy", icon: "Pill", type: "product", description: "Medicine & health" },
  { id: "restaurant", name: "Restaurant", icon: "Utensils", type: "both", description: "Food delivery" },
  { id: "bakery", name: "Bakery", icon: "Cake", type: "both", description: "Baked goods" },
  { id: "clothing", name: "Clothing", icon: "Shirt", type: "product", description: "Apparel & fashion" },
];

// GET /api/categories
router.get("/categories", (_req, res: Response) => {
  res.json(CATEGORIES);
});

export default router;
