// services/producto.service.js
import { productoRepository } from "../repositories/producto.repository.js";

export const productoService = {
  async listar(filtros = {}) {
    return productoRepository.findAll(filtros);
  },

  async obtener(id) {
    const p = await productoRepository.findById(id);
    if (!p) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      throw err;
    }
    return p;
  },

  async crear(data) {
    return productoRepository.create(data);
  },

  async actualizar(id, data) {
    const updated = await productoRepository.update(id, data);
    if (!updated) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      throw err;
    }
    return updated;
  },

  async eliminar(id) {
    const ok = await productoRepository.remove(id);
    if (!ok) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      throw err;
    }
  },
};
