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

// 1) Servir estáticos (frontend)
app.use(express.static(path.join(__dirname, "..", "public")));

// 2) Rutas API
app.use("/api", routes);

// Health solo de la API
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, msg: "API MotorTrust viva" });
});

// 3) Middlewares de API
app.use(notFound);
app.use(errorHandler);

export default app;
