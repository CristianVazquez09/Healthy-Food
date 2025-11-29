// repositories/categoria.repository.js
import { pool } from "../utils/db.js";

export const categoriaRepository = {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT id, nombre, descripcion, activa,
              created_at AS createdAt, updated_at AS updatedAt
       FROM categorias
       ORDER BY nombre ASC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, nombre, descripcion, activa,
              created_at AS createdAt, updated_at AS updatedAt
       FROM categorias
       WHERE id = ?`,
      [id]
    );
    return rows[0] ?? null;
  },

  async create({ nombre, descripcion, activa = true }) {
    const [result] = await pool.query(
      `INSERT INTO categorias (nombre, descripcion, activa)
       VALUES (?, ?, ?)`,
      [nombre, descripcion ?? null, activa ? 1 : 0]
    );
    return this.findById(result.insertId);
  },

  async update(id, data) {
    const fields = [];
    const values = [];

    if (data.nombre !== undefined) {
      fields.push("nombre = ?");
      values.push(data.nombre);
    }
    if (data.descripcion !== undefined) {
      fields.push("descripcion = ?");
      values.push(data.descripcion);
    }
    if (data.activa !== undefined) {
      fields.push("activa = ?");
      values.push(data.activa ? 1 : 0);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const [result] = await pool.query(
      `UPDATE categorias SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  },

  async remove(id) {
    const [result] = await pool.query(
      `DELETE FROM categorias WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  },
};
