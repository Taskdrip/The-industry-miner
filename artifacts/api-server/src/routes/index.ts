import { Router, type IRouter } from "express";
import healthRouter from "./health";
import coursesRouter from "./courses";
import categoriesRouter from "./categories";
import testimonialsRouter from "./testimonials";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(coursesRouter);
router.use(categoriesRouter);
router.use(testimonialsRouter);
router.use(statsRouter);

export default router;
