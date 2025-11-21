import { Router } from "express";
import clientesRouter from "./clientes.routes.js";
// (si aún tienes sociosRouter, puedes dejarlo también)

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

router.use("/clientes", clientesRouter);

export default router;
