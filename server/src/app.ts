import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { rateLimiter } from "./middleware/rateLimiter";
import { globalErrorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./utils/logger";
import reviewRoutes from "./routes/review.routes";

const app = express();

// ── Security ────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
    cors({
        origin: env.CORS_ORIGIN,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// ── Rate limiting ───────────────────────────────────────────────────────
app.set("trust proxy", 1); // Trust first proxy for correct client IP
app.use(rateLimiter);

// ── Body parsing (1 MB limit) ───────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));

// ── Logging ─────────────────────────────────────────────────────────────
app.use(requestLogger);

// ── Health check ────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Routes ──────────────────────────────────────────────────────────────
app.use("/api/review", reviewRoutes);

// ── Global error handler (must be last) ─────────────────────────────────
app.use(globalErrorHandler);

export default app;
