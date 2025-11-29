// services/auth.service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { clienteRepository } from "../repositories/cliente.repository.js";

const { JWT_SECRET, JWT_EXPIRES_IN = "1h" } = process.env;

if (!JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en variables de entorno");
}

export const authService = {
  async login({ email, password }) {
    const cliente = await clienteRepository.findByEmail(email);
    if (!cliente) {
      const err = new Error("Credenciales inválidas");
      err.status = 401;
      throw err;
    }

    const { id, password_hash, activo } = cliente;

    if (!activo) {
      const err = new Error("Cuenta inactiva");
      err.status = 403;
      throw err;
    }

    const ok = await bcrypt.compare(password, password_hash);
    if (!ok) {
      const err = new Error("Credenciales inválidas");
      err.status = 401;
      throw err;
    }

    // 🔹 roles del cliente
    let roles = await clienteRepository.findRolesByClienteId(id);
    if (!roles || roles.length === 0) {
      roles = ["CLIENTE"];
    }

    const payload = { sub: id, email, roles };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return {
      token,
      user: {
        id,
        nombre: cliente.nombre,
        email: cliente.email,
        roles,
      },
    };
  },
};
