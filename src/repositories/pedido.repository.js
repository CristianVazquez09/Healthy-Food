// src/repositories/pedido.repository.js
import { pool } from "../utils/db.js";

export const pedidoRepository = {
  async create({ clienteId, direccionEnvioId, total, metodoPago, observaciones }) {
    const [result] = await pool.query(
      `INSERT INTO pedidos
         (cliente_id, direccion_envio_id, total, metodo_pago, observaciones)
       VALUES (?, ?, ?, ?, ?)`,
      [clienteId, direccionEnvioId, total, metodoPago, observaciones ?? null]
    );
    return result.insertId;
  },

  async createItems(pedidoId, items) {
    if (!items.length) return;

    const values = items.map(i => [
      pedidoId,
      i.productoId,
      i.cantidad,
      i.precioUnitario,
      i.subtotal
    ]);

    await pool.query(
      `INSERT INTO pedido_items
         (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
       VALUES ?`,
      [values]
    );
  },

  async findByClienteId(clienteId) {
    const [rows] = await pool.query(
      `SELECT
         id,
         cliente_id         AS clienteId,
         direccion_envio_id AS direccionEnvioId,
         estado,
         total,
         metodo_pago        AS metodoPago,
         observaciones,
         created_at         AS createdAt,
         updated_at         AS updatedAt
       FROM pedidos
       WHERE cliente_id = ?
       ORDER BY created_at DESC`,
      [clienteId]
    );
    return rows;
  },

  async findDetalleByIdAndCliente(id, clienteId) {
    const [pedidos] = await pool.query(
      `SELECT
         id,
         cliente_id         AS clienteId,
         direccion_envio_id AS direccionEnvioId,
         estado,
         total,
         metodo_pago        AS metodoPago,
         observaciones,
         created_at         AS createdAt,
         updated_at         AS updatedAt
       FROM pedidos
       WHERE id = ? AND cliente_id = ?
       LIMIT 1`,
      [id, clienteId]
    );
    const pedido = pedidos[0];
    if (!pedido) return null;

    const [items] = await pool.query(
      `SELECT
         pi.id,
         pi.pedido_id       AS pedidoId,
         pi.producto_id     AS productoId,
         pi.cantidad,
         pi.precio_unitario AS precioUnitario,
         pi.subtotal,
         p.nombre           AS productoNombre,
         p.url_imagen       AS productoUrlImagen
       FROM pedido_items pi
       JOIN productos p ON p.id = pi.producto_id
       WHERE pi.pedido_id = ?`,
      [pedido.id]
    );

    return { pedido, items };
  }
};
