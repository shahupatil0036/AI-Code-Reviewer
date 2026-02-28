import { Router } from "express";
import { handleReview } from "../controllers/review.controller";
import { validateRequest } from "../middleware/validateRequest";
import { reviewRequestSchema } from "../types/review.types";

const router = Router();

router.post("/", validateRequest(reviewRequestSchema), handleReview);

export default router;
