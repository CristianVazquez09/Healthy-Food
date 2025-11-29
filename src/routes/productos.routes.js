// routes/productos.routes.js
import { Router } from "express";
import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/producto.controller.js";
import { authRequired, requireRole } from "../middlewares/auth.js";

const router = Router();

// Públicos: ver productos
router.get("/", listarProductos);
router.get("/:id", obtenerProducto);

// Solo ADMIN puede modificar catálogo
router.post("/", authRequired, requireRole("ADMIN"), crearProducto);
router.patch("/:id", authRequired, requireRole("ADMIN"), actualizarProducto);
router.delete("/:id", authRequired, requireRole("ADMIN"), eliminarProducto);

export default router;
