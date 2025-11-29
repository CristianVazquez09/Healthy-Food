// routes/categorias.routes.js
import { Router } from "express";
import {
  listarCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categoria.controller.js";
import { authRequired, requireRole } from "../middlewares/auth.js";

const router = Router();

// Públicos: listar y ver detalle (ó puedes ponerlos también detrás del login)
router.get("/", listarCategorias);
router.get("/:id", obtenerCategoria);

// Solo ADMIN puede crear/editar/eliminar
router.post("/", authRequired, requireRole("ADMIN"), crearCategoria);
router.patch("/:id", authRequired, requireRole("ADMIN"), actualizarCategoria);
router.delete("/:id", authRequired, requireRole("ADMIN"), eliminarCategoria);

export default router;
