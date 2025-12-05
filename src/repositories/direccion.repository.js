// src/repositories/direccion.repository.js
import { pool } from "../utils/db.js";

export const direccionRepository = {
  async findByIdAndCliente(id, clienteId) {
    const [rows] = await pool.query(
      `SELECT
         id,
         cliente_id AS clienteId,
         alias,
         calle,
         numero_ext   AS numeroExt,
         numero_int   AS numeroInt,
         colonia,
         ciudad,
         estado,
         cp,
         referencia,
         es_principal AS esPrincipal,
         created_at   AS createdAt,
         updated_at   AS updatedAt
       FROM direcciones
       WHERE id = ? AND cliente_id = ?
       LIMIT 1`,
      [id, clienteId]
    );
    return rows[0] ?? null;
  }
};
