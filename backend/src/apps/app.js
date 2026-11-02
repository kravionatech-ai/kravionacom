import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import healthRouter from '../routes/health.routes.js';
import Router from '../routes/router.routes.js';
import plannerRoutes from '../routes/plannerRoutes.js';
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from 'cloudinary';
import config from '../config/config.js';

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: config.CORS_ORIGINS,
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure local uploads directories exist
const uploadsPath = path.resolve(__dirname, "../../public/uploads");
try {
  fs.mkdirSync(path.join(uploadsPath, "images"), { recursive: true });
  fs.mkdirSync(path.join(uploadsPath, "media"), { recursive: true });
} catch (dirErr) {
  console.error("Failed to initialize uploads directory:", dirErr.message);
}

const staticUploadsMiddleware = express.static(uploadsPath, {
  maxAge: "30d",
  immutable: true,
});

app.use(["/uploads", "/api/v1/uploads"], (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use("/uploads", staticUploadsMiddleware);
app.use("/api/v1/uploads", staticUploadsMiddleware);

// Parse JSON once and retain the raw request buffer on req.rawBody for cryptographic
// signature verification (e.g., Svix / Resend webhooks).
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true }));

// Requests without a parsed payload should behave like an empty object rather
// than causing destructuring errors inside controllers.
app.use((req, _res, next) => {
  if (req.body === null || req.body === undefined) req.body = {};
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

app.get('/api-docs', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/docsapi.html'));
});

app.get('/health', healthRouter);

app.use('/api/planner', plannerRoutes);
app.use('/api/v1/planner', plannerRoutes);
app.use('/api/v1', Router);

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ success: false, message: "Invalid JSON body" });
  }

  if (error?.name === "MulterError") {
    return res.status(400).json({ success: false, message: error.message });
  }

  console.error("Unhandled request error:", error);
  return res.status(500).json({ success: false, message: "Internal server error" });
});

export default app;
