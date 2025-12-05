// src/services/productoPublic.service.js
import { productoRepository } from "../repositories/producto.repository.js";

export const productoPublicService = {
  async listar() {
    return productoRepository.findAllActivos();
  },

  async obtener(id) {
    const p = await productoRepository.findActivoById(id);
    if (!p) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      throw err;
    }
    return p;
  }
};
