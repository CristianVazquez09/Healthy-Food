// repositories/producto.repository.js
import { pool } from "../utils/db.js";

export const productoRepository = {
  async findAll({ categoriaId } = {}) {
    let sql = `
      SELECT p.id, p.categoria_id AS categoriaId, p.nombre, p.descripcion,
             p.precio, p.stock, p.url_imagen AS urlImagen, p.activo,
             p.calorias, p.proteinas, p.carbohidratos, p.grasas,
             p.es_vegano AS esVegano, p.es_sin_gluten AS esSinGluten,
             p.created_at AS createdAt, p.updated_at AS updatedAt,
             c.nombre AS categoriaNombre
      FROM productos p
      JOIN categorias c ON c.id = p.categoria_id
    `;
    const params = [];
    if (categoriaId) {
      sql += " WHERE p.categoria_id = ?";
      params.push(categoriaId);
    }
    sql += " ORDER BY p.nombre ASC";

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT p.id, p.categoria_id AS categoriaId, p.nombre, p.descripcion,
              p.precio, p.stock, p.url_imagen AS urlImagen, p.activo,
              p.calorias, p.proteinas, p.carbohidratos, p.grasas,
              p.es_vegano AS esVegano, p.es_sin_gluten AS esSinGluten,
              p.created_at AS createdAt, p.updated_at AS updatedAt,
              c.nombre AS categoriaNombre
       FROM productos p
       JOIN categorias c ON c.id = p.categoria_id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0] ?? null;
  },

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO productos
         (categoria_id, nombre, descripcion, precio, stock, url_imagen,
          activo, calorias, proteinas, carbohidratos, grasas,
          es_vegano, es_sin_gluten)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.categoriaId,
        data.nombre,
        data.descripcion ?? null,
        data.precio,
        data.stock ?? 0,
        data.urlImagen ?? null,
        data.activo ?? 1,
        data.calorias ?? null,
        data.proteinas ?? null,
        data.carbohidratos ?? null,
        data.grasas ?? null,
        data.esVegano ? 1 : 0,
        data.esSinGluten ? 1 : 0,
      ]
    );
    return this.findById(result.insertId);
  },

  async update(id, data) {
    const fields = [];
    const values = [];

    if (data.categoriaId !== undefined) {
      fields.push("categoria_id = ?");
      values.push(data.categoriaId);
    }
    if (data.nombre !== undefined) {
      fields.push("nombre = ?");
      values.push(data.nombre);
    }
    if (data.descripcion !== undefined) {
      fields.push("descripcion = ?");
      values.push(data.descripcion);
    }
    if (data.precio !== undefined) {
      fields.push("precio = ?");
      values.push(data.precio);
    }
    if (data.stock !== undefined) {
      fields.push("stock = ?");
      values.push(data.stock);
    }
    if (data.urlImagen !== undefined) {
      fields.push("url_imagen = ?");
      values.push(data.urlImagen);
    }
    if (data.activo !== undefined) {
      fields.push("activo = ?");
      values.push(data.activo ? 1 : 0);
    }
    if (data.calorias !== undefined) {
      fields.push("calorias = ?");
      values.push(data.calorias);
    }
    if (data.proteinas !== undefined) {
      fields.push("proteinas = ?");
      values.push(data.proteinas);
    }
    if (data.carbohidratos !== undefined) {
      fields.push("carbohidratos = ?");
      values.push(data.carbohidratos);
    }
    if (data.grasas !== undefined) {
      fields.push("grasas = ?");
      values.push(data.grasas);
    }
    if (data.esVegano !== undefined) {
      fields.push("es_vegano = ?");
      values.push(data.esVegano ? 1 : 0);
    }
    if (data.esSinGluten !== undefined) {
      fields.push("es_sin_gluten = ?");
      values.push(data.esSinGluten ? 1 : 0);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const [result] = await pool.query(
      `UPDATE productos SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  },

  async remove(id) {
    const [result] = await pool.query(`DELETE FROM productos WHERE id = ?`, [
      id,
    ]);
    return result.affectedRows > 0;
  },
};
