// src/repositories/carrito.repository.js
import { pool } from "../utils/db.js";

export const carritoRepository = {
  async findActiveByClienteId(clienteId) {
    const [rows] = await pool.query(
      `SELECT
         id,
         cliente_id AS clienteId,
         activo,
         created_at AS createdAt,
         updated_at AS updatedAt
       FROM carritos
       WHERE cliente_id = ? AND activo = 1
       ORDER BY created_at DESC
       LIMIT 1`,
      [clienteId]
    );
    return rows[0] ?? null;
  },

  async create(clienteId) {
    const [result] = await pool.query(
      `INSERT INTO carritos (cliente_id, activo)
       VALUES (?, 1)`,
      [clienteId]
    );
    const [rows] = await pool.query(
      `SELECT
         id,
         cliente_id AS clienteId,
         activo,
         created_at AS createdAt,
         updated_at AS updatedAt
       FROM carritos
       WHERE id = ?`,
      [result.insertId]
    );
    return rows[0];
  },

  async findItemByCarritoAndProducto(carritoId, productoId) {
    const [rows] = await pool.query(
      `SELECT
         id,
         carrito_id       AS carritoId,
         producto_id      AS productoId,
         cantidad,
         precio_unitario  AS precioUnitario,
         created_at       AS createdAt,
         updated_at       AS updatedAt
       FROM carrito_items
       WHERE carrito_id = ? AND producto_id = ?
       LIMIT 1`,
      [carritoId, productoId]
    );
    return rows[0] ?? null;
  },

  async createItem({ carritoId, productoId, cantidad, precioUnitario }) {
    const [result] = await pool.query(
      `INSERT INTO carrito_items
         (carrito_id, producto_id, cantidad, precio_unitario)
       VALUES (?, ?, ?, ?)`,
      [carritoId, productoId, cantidad, precioUnitario]
    );
    const [rows] = await pool.query(
      `SELECT
         id,
         carrito_id       AS carritoId,
         producto_id      AS productoId,
         cantidad,
         precio_unitario  AS precioUnitario,
         created_at       AS createdAt,
         updated_at       AS updatedAt
       FROM carrito_items
       WHERE id = ?`,
      [result.insertId]
    );
    return rows[0];
  },

  async updateItemCantidad(itemId, cantidad) {
    const [result] = await pool.query(
      `UPDATE carrito_items
       SET cantidad = ?
       WHERE id = ?`,
      [cantidad, itemId]
    );
    return result.affectedRows > 0;
  },

  async findItemByIdAndCliente(itemId, clienteId) {
    const [rows] = await pool.query(
      `SELECT
         ci.id,
         ci.carrito_id      AS carritoId,
         ci.producto_id     AS productoId,
         ci.cantidad,
         ci.precio_unitario AS precioUnitario,
         ci.created_at      AS createdAt,
         ci.updated_at      AS updatedAt
       FROM carrito_items ci
       JOIN carritos c ON c.id = ci.carrito_id
       WHERE ci.id = ? AND c.cliente_id = ? AND c.activo = 1
       LIMIT 1`,
      [itemId, clienteId]
    );
    return rows[0] ?? null;
  },

  async removeItem(itemId) {
    const [result] = await pool.query(
      `DELETE FROM carrito_items WHERE id = ?`,
      [itemId]
    );
    return result.affectedRows > 0;
  },

  async clearByClienteId(clienteId) {
    const carrito = await this.findActiveByClienteId(clienteId);
    if (!carrito) return false;
    await pool.query(
      `DELETE FROM carrito_items WHERE carrito_id = ?`,
      [carrito.id]
    );
    return true;
  },

  async markInactive(carritoId) {
    const [result] = await pool.query(
      `UPDATE carritos SET activo = 0 WHERE id = ?`,
      [carritoId]
    );
    return result.affectedRows > 0;
  },

  async getCartWithItemsByClienteId(clienteId) {
    const carrito = await this.findActiveByClienteId(clienteId);
    if (!carrito) {
      return { carrito: null, items: [] };
    }

    const [rows] = await pool.query(
      `SELECT
         ci.id,
         ci.carrito_id      AS carritoId,
         ci.producto_id     AS productoId,
         ci.cantidad,
         ci.precio_unitario AS precioUnitario,
         p.nombre           AS productoNombre,
         p.precio           AS productoPrecio,
         p.url_imagen       AS productoUrlImagen,
         p.stock            AS productoStock,
         p.activo           AS productoActivo
       FROM carrito_items ci
       JOIN productos p ON p.id = ci.producto_id
       WHERE ci.carrito_id = ?`,
      [carrito.id]
    );

    return { carrito, items: rows };
  }
};
