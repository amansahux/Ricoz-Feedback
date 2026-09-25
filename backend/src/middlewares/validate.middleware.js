import { ApiError } from '../utils/ApiError.js';

/**
 * Higher-order middleware to run validator schemas against req.body, req.query, or req.params.
 * @param {Function} validatorFn - Function receiving req that returns an array of error messages or { errors }
 */
export const validate = (validatorFn) => (req, res, next) => {
  try {
    const errors = validatorFn(req);
    if (errors && errors.length > 0) {
      return next(new ApiError(400, errors[0].message || errors[0], errors));
    }
    next();
  } catch (error) {
    next(error);
  }
};
