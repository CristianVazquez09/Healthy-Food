// src/models/pedido.model.js
import { z } from "zod";

export const PedidoCreateSchema = z.object({
  direccionEnvioId: z.number({
    required_error: "direccionEnvioId es requerido",
    invalid_type_error: "direccionEnvioId debe ser numérico"
  }).int().positive(),
  metodoPago: z.enum(["EFECTIVO", "TARJETA", "TRANSFERENCIA", "OTRO"]).optional(),
  observaciones: z.string().max(255).optional()
});
