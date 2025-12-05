// src/routes/carrito.routes.js
import { Router } from "express";
import {
  obtenerCarrito,
  agregarItemCarrito,
  actualizarItemCarrito,
  eliminarItemCarrito,
  vaciarCarrito
} from "../controllers/carrito.controller.js";

const router = Router();

// GET /api/mi/carrito  -> resumen de carrito actual
router.get("/", obtenerCarrito);

// POST /api/mi/carrito/items  -> agregar producto al carrito
router.post("/items", agregarItemCarrito);

// PATCH /api/mi/carrito/items/:itemId  -> cambiar cantidad
router.patch("/items/:itemId", actualizarItemCarrito);

// DELETE /api/mi/carrito/items/:itemId  -> borrar item
router.delete("/items/:itemId", eliminarItemCarrito);

// DELETE /api/mi/carrito  -> vaciar carrito
router.delete("/", vaciarCarrito);

export default router;
