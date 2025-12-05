// src/models/carrito.model.js
import { z } from "zod";

export const CarritoAddItemSchema = z.object({
  productoId: z.number({
    required_error: "productoId es requerido",
    invalid_type_error: "productoId debe ser numérico"
  }).int().positive(),
  cantidad: z.number({
    required_error: "cantidad es requerida",
    invalid_type_error: "cantidad debe ser numérica"
  })
    .int()
    .min(1, "Mínimo 1 unidad")
    .max(100, "Máximo 100 unidades por producto")
});

export const CarritoUpdateItemSchema = z.object({
  cantidad: z.number({
    required_error: "cantidad es requerida",
    invalid_type_error: "cantidad debe ser numérica"
  })
    .int()
    .min(1, "Mínimo 1 unidad")
    .max(100, "Máximo 100 unidades por producto")
});
