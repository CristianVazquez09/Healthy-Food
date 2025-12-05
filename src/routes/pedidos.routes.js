// src/routes/pedidos.routes.js
import { Router } from "express";
import {
  crearPedidoDesdeCarrito,
  listarPedidosCliente,
  obtenerPedidoCliente
} from "../controllers/pedido.controller.js";

const router = Router();

// POST /api/mi/pedidos  -> confirma carrito y genera pedido
router.post("/", crearPedidoDesdeCarrito);

// GET /api/mi/pedidos   -> lista pedidos del cliente autenticado
router.get("/", listarPedidosCliente);

// GET /api/mi/pedidos/:id  -> detalle de un pedido del cliente
router.get("/:id", obtenerPedidoCliente);

export default router;
