// src/app.js
import express from "express";
import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

import routes from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// 1) Front login en / (ya lo tienes)
app.use(express.static(path.join(__dirname, "..", "public")));

// 2) API
app.use("/api", routes);

// 3) Página admin (http://localhost:3000/admin)
app.get("/admin", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin.html"));
});

// Health
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, msg: "API HealthyFood viva" });
});

// 4) Middlewares de error
app.use(notFound);
app.use(errorHandler);

export default app;
