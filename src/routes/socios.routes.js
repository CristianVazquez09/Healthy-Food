import { Router } from "express";
import { listar } from "../controllers/socio.controller.js";

const router = Router();

// Convención REST: listar en "/"
router.get("/", listar);

// Si QUIERES usar "/listar", agrega también esta línea:
// router.get("/listar", listar);

export default router;
