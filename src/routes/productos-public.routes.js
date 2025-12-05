// src/routes/productos-public.routes.js
import { Router } from "express";
import {
  listarProductosPublic,
  obtenerProductoPublic
} from "../controllers/productoPublic.controller.js";

const router = Router();

// Catálogo público
router.get("/", listarProductosPublic);
router.get("/:id", obtenerProductoPublic);

export default router;
