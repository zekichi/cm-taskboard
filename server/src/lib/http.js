export function sendSuccess(res, data, status = 200) {
  return res.status(status).json({
    success: true,
    data,
  });
}

export function sendError(res, error, status = 500) {
  return res.status(status).json({
    success: false,
    error,
  });
}
