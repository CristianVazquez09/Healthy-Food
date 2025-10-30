import { pool } from "../utils/db.js";

export const socioRepository = {
  async findAll({ limit = 50, offset = 0 } = {}) {
    const [rows] = await pool.query(
      `SELECT id, nombre, email, activo, created_at AS createdAt, updated_at AS updatedAt
       FROM socios
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [Number(limit), Number(offset)]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, nombre, email, activo, created_at AS createdAt, updated_at AS updatedAt
       FROM socios WHERE id = ?`,
      [id]
    );
    return rows[0] ?? null;
  },

  async create({ nombre, email, activo = true }) {
    const [result] = await pool.query(
      `INSERT INTO socios (nombre, email, activo) VALUES (?, ?, ?)`,
      [nombre, email, activo ? 1 : 0]
    );
    const insertId = result.insertId;
    const [rows] = await pool.query(
      `SELECT id, nombre, email, activo, created_at AS createdAt, updated_at AS updatedAt
       FROM socios WHERE id = ?`,
      [insertId]
    );
    return rows[0];
  },

  async update(id, data) {
    // construye SET dinámico seguro
    const fields = [];
    const values = [];

    if (data.nombre !== undefined) { fields.push("nombre = ?"); values.push(data.nombre); }
    if (data.email !== undefined)  { fields.push("email = ?");  values.push(data.email); }
    if (data.activo !== undefined) { fields.push("activo = ?"); values.push(data.activo ? 1 : 0); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);

    const [result] = await pool.query(
      `UPDATE socios SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    if (result.affectedRows === 0) return null;

    return this.findById(id);
  },

  async remove(id) {
    const [result] = await pool.query(`DELETE FROM socios WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }
};
