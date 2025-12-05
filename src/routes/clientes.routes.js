// src/routes/clientes.routes.js
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

// 🔒 Solo ADMIN puede listar todos los clientes
router.get("/", authRequired, requireRole("ADMIN"), listarClientes);

// 🔒 Solo ADMIN puede ver detalle de un cliente por id
router.get("/:id", authRequired, requireRole("ADMIN"), obtenerCliente);

// ✅ Registro público (NO requiere token)
// Se usa para crear cuentas desde el formulario de registro
router.post("/", crearCliente);

// 🔒 Solo ADMIN puede actualizar clientes
router.patch("/:id", authRequired, requireRole("ADMIN"), actualizarCliente);

// 🔒 Solo ADMIN puede eliminar clientes
router.delete("/:id", authRequired, requireRole("ADMIN"), eliminarCliente);

export default router;
