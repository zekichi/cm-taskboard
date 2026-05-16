import { sendError } from "../lib/http.js";

export function notFoundHandler(req, res) {
  sendError(
    res,
    {
      code: "NOT_FOUND",
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    },
    404
  );
}
