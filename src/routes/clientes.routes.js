// routes/clientes.routes.js
import { Router } from "express";
import {
  listarClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from "../controllers/cliente.controller.js";
import { authRequired, requireRole } from "../middlewares/auth.js";

const router = Router();

// Todas las rutas de clientes requieren autenticación y rol ADMIN
router.use(authRequired, requireRole("ADMIN"));

router.get("/", listarClientes);
router.get("/:id", obtenerCliente);
router.post("/", crearCliente);
router.patch("/:id", actualizarCliente);
router.delete("/:id", eliminarCliente);

export default router;
