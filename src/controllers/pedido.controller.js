// src/controllers/pedido.controller.js
import { PedidoCreateSchema } from "../models/pedido.model.js";
import { pedidoService } from "../services/pedido.service.js";

export const crearPedidoDesdeCarrito = async (req, res, next) => {
  try {
    const clienteId = req.user.id;
    const payload = PedidoCreateSchema.parse(req.body);
    const detalle = await pedidoService.crearDesdeCarrito(clienteId, payload);
    res.status(201).json(detalle);
  } catch (e) {
    next(e);
  }
};

export const listarPedidosCliente = async (req, res, next) => {
  try {
    const clienteId = req.user.id;
    const pedidos = await pedidoService.listarPorCliente(clienteId);
    res.json(pedidos);
  } catch (e) {
    next(e);
  }
};

export const obtenerPedidoCliente = async (req, res, next) => {
  try {
    const clienteId = req.user.id;
    const pedidoId = Number(req.params.id);
    const detalle = await pedidoService.obtenerDetalle(clienteId, pedidoId);
    res.json(detalle);
  } catch (e) {
    next(e);
  }
};
