// src/controllers/carrito.controller.js
import { carritoService } from "../services/carrito.service.js";
import {
  CarritoAddItemSchema,
  CarritoUpdateItemSchema,
} from "../models/carrito.model.js";

export const obtenerCarrito = async (req, res, next) => {
  try {
    const clienteId = req.user?.id;
    const result = await carritoService.obtenerCarrito(clienteId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const agregarItemCarrito = async (req, res, next) => {
  try {
    const clienteId = req.user?.id;
    const payload = CarritoAddItemSchema.parse(req.body);

    const result = await carritoService.agregarItem(clienteId, payload);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const actualizarItemCarrito = async (req, res, next) => {
  try {
    const clienteId = req.user?.id;
    const itemId = Number(req.params.itemId);
    if (Number.isNaN(itemId)) {
      return res.status(400).json({ message: "ID de item inválido" });
    }

    const payload = CarritoUpdateItemSchema.parse(req.body);
    const result = await carritoService.actualizarItem(
      clienteId,
      itemId,
      payload
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const eliminarItemCarrito = async (req, res, next) => {
  try {
    const clienteId = req.user?.id;
    const itemId = Number(req.params.itemId);
    if (Number.isNaN(itemId)) {
      return res.status(400).json({ message: "ID de item inválido" });
    }

    const result = await carritoService.eliminarItem(clienteId, itemId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const vaciarCarrito = async (req, res, next) => {
  try {
    const clienteId = req.user?.id;
    const result = await carritoService.vaciar(clienteId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
