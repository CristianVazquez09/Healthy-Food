import { socioRepository } from "../repositories/socio.repository.js";

export const socioService = {
  async listar(pagination = {}) {
    return socioRepository.findAll(pagination);
  },

  async obtener(id) {
    const socio = await socioRepository.findById(id);
    if (!socio) {
      const err = new Error("Socio no encontrado");
      err.status = 404;
      throw err;
    }
    return socio;
  },

  async crear(payload) {
    try {
      return await socioRepository.create(payload);
    } catch (e) {
      // MySQL dup key
      if (e?.code === "ER_DUP_ENTRY" || e?.errno === 1062) {
        const err = new Error("Email ya está registrado");
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },

  async actualizar(id, payload) {
    try {
      const updated = await socioRepository.update(id, payload);
      if (!updated) {
        const err = new Error("Socio no encontrado");
        err.status = 404;
        throw err;
      }
      return updated;
    } catch (e) {
      if (e?.code === "ER_DUP_ENTRY" || e?.errno === 1062) {
        const err = new Error("Email ya está registrado");
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },

  async eliminar(id) {
    const ok = await socioRepository.remove(id);
    if (!ok) {
      const err = new Error("Socio no encontrado");
      err.status = 404;
      throw err;
    }
  }
};
