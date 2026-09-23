import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import todoRouter from "./routes/todo.routes";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  // Security: Helmet sets secure HTTP headers
  app.use(helmet());

  // Security: CORS — permissive in development, configurable via env var
  app.use(
    cors({
      origin: process.env["CORS_ORIGIN"] ?? "*",
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Body parsing (size limited to 10kb)
  app.use(express.json({ limit: "10kb" }));

  // Rate limiting on /api routes: 100 req / 15 min per IP
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests, please try again later.",
      },
    },
  });

  // Health check (not rate-limited)
  app.get("/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok" } });
  });

  // API routes (rate-limited)
  app.use("/api/todos", apiLimiter, todoRouter);

  // 404 catch-all for unmatched routes
  app.use(notFound);

  // Error handler must be last
  app.use(errorHandler);

  return app;
}

export const app = createApp();
