import { Router } from "express";
import { handleReview } from "../controllers/review.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { reviewRequestSchema } from "../types/review.types.js";

const router = Router();

router.post("/", validateRequest(reviewRequestSchema), handleReview);

export default router;
