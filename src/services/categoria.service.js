// services/categoria.service.js
import { categoriaRepository } from "../repositories/categoria.repository.js";

export const categoriaService = {
  async listar() {
    return categoriaRepository.findAll();
  },

  async obtener(id) {
    const cat = await categoriaRepository.findById(id);
    if (!cat) {
      const err = new Error("Categoría no encontrada");
      err.status = 404;
      throw err;
    }
    return cat;
  },

  async crear(data) {
    return categoriaRepository.create(data);
  },

  async actualizar(id, data) {
    const updated = await categoriaRepository.update(id, data);
    if (!updated) {
      const err = new Error("Categoría no encontrada");
      err.status = 404;
      throw err;
    }
    return updated;
  },

  async eliminar(id) {
    const ok = await categoriaRepository.remove(id);
    if (!ok) {
      const err = new Error("Categoría no encontrada");
      err.status = 404;
      throw err;
    }
  },
};
