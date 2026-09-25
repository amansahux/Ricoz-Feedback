import { env } from "../config/env.js";

/**
 * Centralized error handling middleware.
 * All errors passed via next(err) will be caught here and a unified JSON response
 * will be sent to the client.
 * The response format follows the pattern used throughout the project:
 *   { success: boolean, message: string, error: string | null, data?: any }
 */
export const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err);

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  // If headers already sent, delegate to Express default handler
  if (res.headersSent) {
    return next(err);
  }

  res.status(status).json({
    success: false,
    message,
    error: err.message,
    stack: env.NODE_ENV === "development" ? err.stack : null,
    data: null
  });
};
