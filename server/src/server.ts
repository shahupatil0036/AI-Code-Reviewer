import "dotenv/config"; // Must be first — loads .env before any module reads process.env
import app from "./app";
import { env } from "./config/env";

const PORT = env.PORT;

const server = app.listen(PORT, () => {
    console.log(`🚀 AI Code Reviewer server running on port ${PORT}`);
    console.log(`   Environment : ${env.NODE_ENV}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
});

// ── Graceful shutdown on unhandled errors ─────────────────────────────

function gracefulShutdown(reason: string, error: unknown): void {
    console.error(`❌ ${reason}:`, error);
    server.close(() => process.exit(1));
    // Force exit after 5 seconds if server hasn't closed
    setTimeout(() => process.exit(1), 5_000).unref();
}

process.on("unhandledRejection", (reason) => {
    gracefulShutdown("Unhandled Rejection", reason);
});

process.on("uncaughtException", (error) => {
    gracefulShutdown("Uncaught Exception", error);
});

process.on("SIGTERM", () => {
    console.log("👋 SIGTERM received. Shutting down gracefully...");
    server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
    console.log("👋 SIGINT received. Shutting down gracefully...");
    server.close(() => process.exit(0));
});
