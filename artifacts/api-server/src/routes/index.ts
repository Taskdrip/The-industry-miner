import { Router, type IRouter } from "express";
import healthRouter from "./health";
import coursesRouter from "./courses";
import categoriesRouter from "./categories";
import testimonialsRouter from "./testimonials";
import statsRouter from "./stats";
import authRouter from "./auth";
import adminRouter from "./admin";
import ordersRouter from "./orders";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(coursesRouter);
router.use(categoriesRouter);
router.use(testimonialsRouter);
router.use(statsRouter);
router.use(adminRouter);
router.use(ordersRouter);

export default router;
