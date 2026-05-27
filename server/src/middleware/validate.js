import { ZodError } from "zod";

import { AppError } from "../lib/errors.js";

export function validateBody(schema) {
  return (req, _res, next) => {
    try {
      // Dejamos el body normalizado para que los controllers no repitan parseos.
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new AppError(
            "Error de validacion",
            400,
            "VALIDATION_ERROR",
            error.flatten()
          )
        );
      }
      return next(error);
    }
  };
}
