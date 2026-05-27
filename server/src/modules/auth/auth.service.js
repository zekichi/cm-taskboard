import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import env from "../../config/env.js";
import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";

function normalizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function loginWithEmailPassword({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Mismo mensaje para usuario/password incorrectos: evita filtrar cuentas validas.
  if (!user) {
    throw new AppError("Credenciales invalidas", 401, "INVALID_CREDENTIALS");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError("Credenciales invalidas", 401, "INVALID_CREDENTIALS");
  }

  const token = jwt.sign({ email: user.email }, env.JWT_SECRET, {
    // Guardamos el id en "sub" para respetar el uso estandar de JWT.
    subject: String(user.id),
    expiresIn: env.JWT_EXPIRES_IN,
  });

  return {
    token,
    user: normalizeUser(user),
  };
}
