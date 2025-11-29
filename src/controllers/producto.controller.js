// controllers/producto.controller.js
import {
  ProductoCreateSchema,
  ProductoUpdateSchema,
} from "../models/producto.model.js";
import { productoService } from "../services/producto.service.js";

export const listarProductos = async (req, res, next) => {
  try {
    const categoriaId = req.query.categoriaId
      ? Number(req.query.categoriaId)
      : undefined;
    const data = await productoService.listar({ categoriaId });
    res.json({ data, count: data.length });
  } catch (e) {
    next(e);
  }
};

export const obtenerProducto = async (req, res, next) => {
  try {
    const p = await productoService.obtener(req.params.id);
    res.json(p);
  } catch (e) {
    next(e);
  }
};

export const crearProducto = async (req, res, next) => {
  try {
    const payload = ProductoCreateSchema.parse({
      ...req.body,
      categoriaId: Number(req.body.categoriaId),
      precio: Number(req.body.precio),
      stock: req.body.stock !== undefined ? Number(req.body.stock) : undefined,
      calorias:
        req.body.calorias !== undefined ? Number(req.body.calorias) : undefined,
      proteinas:
        req.body.proteinas !== undefined
          ? Number(req.body.proteinas)
          : undefined,
      carbohidratos:
        req.body.carbohidratos !== undefined
          ? Number(req.body.carbohidratos)
          : undefined,
      grasas:
        req.body.grasas !== undefined ? Number(req.body.grasas) : undefined,
    });
    const p = await productoService.crear(payload);
    res.status(201).json(p);
  } catch (e) {
    next(e);
  }
};

export const actualizarProducto = async (req, res, next) => {
  try {
    const payload = ProductoUpdateSchema.parse({
      ...req.body,
      categoriaId:
        req.body.categoriaId !== undefined
          ? Number(req.body.categoriaId)
          : undefined,
      precio:
        req.body.precio !== undefined ? Number(req.body.precio) : undefined,
      stock:
        req.body.stock !== undefined ? Number(req.body.stock) : undefined,
      calorias:
        req.body.calorias !== undefined ? Number(req.body.calorias) : undefined,
      proteinas:
        req.body.proteinas !== undefined
          ? Number(req.body.proteinas)
          : undefined,
      carbohidratos:
        req.body.carbohidratos !== undefined
          ? Number(req.body.carbohidratos)
          : undefined,
      grasas:
        req.body.grasas !== undefined ? Number(req.body.grasas) : undefined,
    });
    const p = await productoService.actualizar(req.params.id, payload);
    res.json(p);
  } catch (e) {
    next(e);
  }
};

export const eliminarProducto = async (req, res, next) => {
  try {
    await productoService.eliminar(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
