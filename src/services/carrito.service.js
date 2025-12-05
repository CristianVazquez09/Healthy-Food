// src/services/carrito.service.js
import { carritoRepository } from "../repositories/carrito.repository.js";
import { productoRepository } from "../repositories/producto.repository.js";

function calcularTotal(items) {
  return items.reduce((acc, item) => {
    const precio = parseFloat(item.precioUnitario ?? item.productoPrecio ?? 0);
    return acc + precio * item.cantidad;
  }, 0);
}

export const carritoService = {
  async obtenerResumen(clienteId) {
    const { carrito, items } = await carritoRepository.getCartWithItemsByClienteId(clienteId);
    const total = carrito ? calcularTotal(items) : 0;

    return {
      carrito,
      items: items.map(i => ({
        ...i,
        subtotal: (parseFloat(i.precioUnitario) * i.cantidad).toFixed(2)
      })),
      total: total.toFixed(2)
    };
  },

  async agregarItem(clienteId, { productoId, cantidad }) {
    const producto = await productoRepository.findActivoById(productoId);
    if (!producto) {
      const err = new Error("Producto no disponible");
      err.status = 404;
      throw err;
    }

    if (producto.stock <= 0) {
      const err = new Error("Producto sin stock disponible");
      err.status = 400;
      throw err;
    }

    let carrito = await carritoRepository.findActiveByClienteId(clienteId);
    if (!carrito) {
      carrito = await carritoRepository.create(clienteId);
    }

    const existingItem = await carritoRepository.findItemByCarritoAndProducto(carrito.id, productoId);
    const precioUnitario = producto.precio;

    if (!existingItem) {
      if (cantidad > producto.stock) {
        const err = new Error("No hay stock suficiente");
        err.status = 400;
        throw err;
      }
      await carritoRepository.createItem({
        carritoId: carrito.id,
        productoId,
        cantidad,
        precioUnitario
      });
    } else {
      const nuevaCantidad = existingItem.cantidad + cantidad;
      if (nuevaCantidad > producto.stock) {
        const err = new Error("No hay stock suficiente");
        err.status = 400;
        throw err;
      }
      await carritoRepository.updateItemCantidad(existingItem.id, nuevaCantidad);
    }

    return this.obtenerResumen(clienteId);
  },

  async actualizarItem(clienteId, itemId, { cantidad }) {
    const item = await carritoRepository.findItemByIdAndCliente(itemId, clienteId);
    if (!item) {
      const err = new Error("Item de carrito no encontrado");
      err.status = 404;
      throw err;
    }

    const producto = await productoRepository.findActivoById(item.productoId);
    if (!producto) {
      const err = new Error("Producto no disponible");
      err.status = 400;
      throw err;
    }

    if (cantidad > producto.stock) {
      const err = new Error("No hay stock suficiente");
      err.status = 400;
      throw err;
    }

    await carritoRepository.updateItemCantidad(itemId, cantidad);
    return this.obtenerResumen(clienteId);
  },

  async eliminarItem(clienteId, itemId) {
    const item = await carritoRepository.findItemByIdAndCliente(itemId, clienteId);
    if (!item) {
      const err = new Error("Item de carrito no encontrado");
      err.status = 404;
      throw err;
    }
    await carritoRepository.removeItem(itemId);
    return this.obtenerResumen(clienteId);
  },

  async vaciar(clienteId) {
    await carritoRepository.clearByClienteId(clienteId);
    return this.obtenerResumen(clienteId);
  }
};
