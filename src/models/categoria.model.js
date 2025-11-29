// models/categoria.model.js
import { z } from "zod";

export const CategoriaCreateSchema = z.object({
  nombre: z.string().min(1, "nombre requerido").trim(),
  descripcion: z.string().trim().optional(),
  activa: z.boolean().optional(),
});

export const CategoriaUpdateSchema = z.object({
  nombre: z.string().min(1).trim().optional(),
  descripcion: z.string().trim().optional(),
  activa: z.boolean().optional(),
});
