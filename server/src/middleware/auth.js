import jwt from "jsonwebtoken";

import env from "../config/env.js";
import { AppError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";

export async function authMiddleware(req, _res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return next(new AppError("Token no proporcionado", 401, "UNAUTHORIZED"));
  }

  const token = authHeader.slice(7).trim();

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch (_error) {
    return next(new AppError("Token invalido o expirado", 401, "UNAUTHORIZED"));
  }

  const userId = Number(payload.sub);
  if (!Number.isInteger(userId) || userId <= 0) {
    return next(new AppError("Token invalido o expirado", 401, "UNAUTHORIZED"));
  }

  // Revalidamos que el usuario siga existiendo aunque el JWT sea valido.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return next(new AppError("Usuario no encontrado", 401, "UNAUTHORIZED"));
  }

  req.user = user;
  return next();
}
