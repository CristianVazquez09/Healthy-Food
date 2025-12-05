// src/controllers/productoPublic.controller.js
import { productoPublicService } from "../services/productoPublic.service.js";

export const listarProductosPublic = async (req, res, next) => {
  try {
    const productos = await productoPublicService.listar();
    res.json(productos);
  } catch (e) {
    next(e);
  }
};

export const obtenerProductoPublic = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const producto = await productoPublicService.obtener(id);
    res.json(producto);
  } catch (e) {
    next(e);
  }
};
