// src/services/pedido.service.js
import { carritoRepository } from "../repositories/carrito.repository.js";
import { direccionRepository } from "../repositories/direccion.repository.js";
import { productoRepository } from "../repositories/producto.repository.js";
import { pedidoRepository } from "../repositories/pedido.repository.js";

export const pedidoService = {
  async crearDesdeCarrito(clienteId, { direccionEnvioId, metodoPago = "EFECTIVO", observaciones }) {
    const dir = await direccionRepository.findByIdAndCliente(direccionEnvioId, clienteId);
    if (!dir) {
      const err = new Error("Dirección de envío no válida");
      err.status = 400;
      throw err;
    }

    const { carrito, items } = await carritoRepository.getCartWithItemsByClienteId(clienteId);
    if (!carrito || items.length === 0) {
      const err = new Error("No hay carrito activo o está vacío");
      err.status = 400;
      throw err;
    }

    // Validar stock
    for (const item of items) {
      if (!item.productoActivo) {
        const err = new Error(`Producto '${item.productoNombre}' ya no está disponible`);
        err.status = 400;
        throw err;
      }
      if (item.cantidad > item.productoStock) {
        const err = new Error(`No hay stock suficiente para '${item.productoNombre}'`);
        err.status = 400;
        throw err;
      }
    }

    const enrichedItems = items.map(i => {
      const precio = parseFloat(i.precioUnitario ?? i.productoPrecio ?? 0);
      const subtotal = precio * i.cantidad;
      return {
        productoId: i.productoId,
        cantidad: i.cantidad,
        precioUnitario: precio.toFixed(2),
        subtotal: subtotal.toFixed(2),
        productoNombre: i.productoNombre,
        productoUrlImagen: i.productoUrlImagen
      };
    });

    const total = enrichedItems
      .reduce((acc, i) => acc + parseFloat(i.subtotal), 0)
      .toFixed(2);

    const pedidoId = await pedidoRepository.create({
      clienteId,
      direccionEnvioId,
      total,
      metodoPago,
      observaciones
    });

    await pedidoRepository.createItems(pedidoId, enrichedItems);

    for (const item of enrichedItems) {
      const ok = await productoRepository.descontarStock(item.productoId, item.cantidad);
      if (!ok) {
        console.warn(`No se pudo descontar stock para producto ${item.productoId}`);
      }
    }

    await carritoRepository.markInactive(carrito.id);

    const detalle = await pedidoRepository.findDetalleByIdAndCliente(pedidoId, clienteId);
    return detalle;
  },

  async listarPorCliente(clienteId) {
    return pedidoRepository.findByClienteId(clienteId);
  },

  async obtenerDetalle(clienteId, pedidoId) {
    const detalle = await pedidoRepository.findDetalleByIdAndCliente(pedidoId, clienteId);
    if (!detalle) {
      const err = new Error("Pedido no encontrado");
      err.status = 404;
      throw err;
    }
    return detalle;
  }
};
