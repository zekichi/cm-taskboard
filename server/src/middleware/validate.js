import { ZodError } from "zod";

import { AppError } from "../lib/errors.js";

export function validateBody(schema) {
  return (req, _res, next) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new AppError(
            "Error de validación",
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
