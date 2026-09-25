/**
 * Global wrapper for async express route handlers and middlewares
 * Automatically catches any thrown error or rejected promise and passes to next()
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
