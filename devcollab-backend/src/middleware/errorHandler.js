/**
 * Global Express error handler.
 * Catches anything passed via next(err) in controllers.
 */
export function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // OpenAI API errors
  if (err?.status && err?.error) {
    return res.status(err.status).json({
      error: err.error?.message ?? "OpenAI API error",
    });
  }

  res.status(500).json({
    error: err.message ?? "Internal server error",
  });
}
