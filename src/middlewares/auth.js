// middlewares/auth.js
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

export const authRequired = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ error: "UNAUTHORIZED", message: "Token requerido" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles || [],
    };
    next();
  } catch (e) {
    return res
      .status(401)
      .json({ error: "UNAUTHORIZED", message: "Token inválido o expirado" });
  }
};

// Requiere que el usuario tenga cierto rol (ej: ADMIN)
export const requireRole = (role) => (req, res, next) => {
  const roles = req.user?.roles || [];
  if (!roles.includes(role)) {
    return res
      .status(403)
      .json({ error: "FORBIDDEN", message: "Permisos insuficientes" });
  }
  next();
};
