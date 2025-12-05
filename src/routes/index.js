// src/routes/index.js
import { Router } from "express";
import clientesRouter from "./clientes.routes.js";
import authRouter from "./auth.routes.js";
import categoriasRouter from "./categorias.routes.js";
import productosRouter from "./productos.routes.js";

import productosPublicRouter from "./productos-public.routes.js";
import carritoRouter from "./carrito.routes.js";
import pedidosRouter from "./pedidos.routes.js";

import { authRequired } from "../middlewares/auth.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ===== Autenticación =====
router.use("/auth", authRouter);

// ===== Admin / backoffice (como ya lo tenías) =====
router.use("/clientes", clientesRouter);
router.use("/categorias", categoriasRouter);
router.use("/productos", productosRouter);

// ===== Parte pública / cliente final =====
// Listado público de productos activos (no requiere login)
router.use("/public/productos", productosPublicRouter);

// Carrito del cliente (requiere login)
router.use("/carrito", authRequired, carritoRouter);

// Pedidos del cliente (requiere login)
router.use("/pedidos", authRequired, pedidosRouter);

export default router;
