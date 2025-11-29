// models/producto.model.js
import { z } from "zod";

export const ProductoCreateSchema = z.object({
  categoriaId: z.number().int().positive(),
  nombre: z.string().min(1).trim(),
  descripcion: z.string().trim().optional(),
  precio: z.number().positive(),
  stock: z.number().int().nonnegative().optional(),
  urlImagen: z.string().url().optional(),
  activo: z.boolean().optional(),
  calorias: z.number().int().nonnegative().optional(),
  proteinas: z.number().int().nonnegative().optional(),
  carbohidratos: z.number().int().nonnegative().optional(),
  grasas: z.number().int().nonnegative().optional(),
  esVegano: z.boolean().optional(),
  esSinGluten: z.boolean().optional(),
});

export const ProductoUpdateSchema = ProductoCreateSchema.partial();
