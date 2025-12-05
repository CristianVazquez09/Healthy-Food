// src/controllers/producto.controller.js
import {
  ProductoCreateSchema,
  ProductoUpdateSchema,
} from "../models/producto.model.js";
import { productoService } from "../services/producto.service.js";

// GET /api/productos
export const listarProductos = async (req, res, next) => {
  try {
    // opcional: filtrar por categoría ?categoriaId=1
    const categoriaId = req.query.categoriaId
      ? Number(req.query.categoriaId)
      : undefined;

    const productos = await productoService.listar({ categoriaId });
    res.json({ data: productos });
  } catch (e) {
    next(e);
  }
};

// GET /api/productos/:id
export const obtenerProducto = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const producto = await productoService.obtener(id);
    res.json(producto);
  } catch (e) {
    next(e);
  }
};

// POST /api/productos
export const crearProducto = async (req, res, next) => {
  try {
    const payload = ProductoCreateSchema.parse(req.body);
    const nuevo = await productoService.crear(payload);
    res.status(201).json(nuevo);
  } catch (e) {
    next(e);
  }
};

// PATCH /api/productos/:id
export const actualizarProducto = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const payload = ProductoUpdateSchema.parse(req.body);
    const actualizado = await productoService.actualizar(id, payload);
    res.json(actualizado);
  } catch (e) {
    next(e);
  }
};

// DELETE /api/productos/:id
export const eliminarProducto = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await productoService.eliminar(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
