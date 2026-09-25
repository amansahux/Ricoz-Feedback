import { env } from "../config/env.js";

/**
 * Centralized error handling middleware.
 * Formats all errors into a unified JSON response:
 * { success: false, message: string, error: string, errors: array, stack: string|null, data: null }
 */
export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal server error";
  let errors = err.errors || [];

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
    errors = Object.keys(err.errors).map((key) => ({ field: key, message: err.errors[key].message }));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with invalid id: ${err.value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired. Please log in again.';
  }

  // If headers already sent, delegate to Express default handler
  if (res.headersSent) {
    return next(err);
  }

  if (statusCode >= 500) {
    console.error("Server Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: message,
    errors,
    stack: env.NODE_ENV === "development" ? err.stack : null,
    data: null,
  });
};
