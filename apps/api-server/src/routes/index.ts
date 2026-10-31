import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import aiRouter from "./ai";
import providersRouter from "./providers";
import productsRouter from "./products";
import servicesRouter from "./services";
import ordersRouter from "./orders";
import reviewsRouter from "./reviews";
import plansRouter from "./plans";
import categoriesRouter from "./categories";
import searchRouter from "./search";
import messagesRouter from "./messages";
import addressesRouter from "./addresses";
import couponsRouter from "./coupons";
import bookingsRouter from "./bookings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(aiRouter);
router.use(providersRouter);
router.use(productsRouter);
router.use(servicesRouter);
router.use(ordersRouter);
router.use(reviewsRouter);
router.use(plansRouter);
router.use(categoriesRouter);
router.use(searchRouter);
router.use(messagesRouter);
router.use(addressesRouter);
router.use(couponsRouter);
router.use(bookingsRouter);

export default router;
