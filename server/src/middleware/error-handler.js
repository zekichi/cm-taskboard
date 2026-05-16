import { AppError } from "../lib/errors.js";
import { sendError } from "../lib/http.js";

export function errorHandler(error, _req, res, _next) {
  const isAppError = error instanceof AppError;
  const status = isAppError ? error.status : 500;
  const code = isAppError ? error.code : "INTERNAL_ERROR";
  const message = isAppError
    ? error.message
    : "Ocurrió un error interno inesperado";
  const details = isAppError ? error.details : null;

  if (!isAppError) {
    console.error(error);
  }

  return sendError(
    res,
    {
      code,
      message,
      ...(details ? { details } : {}),
    },
    status
  );
}
