import express from 'express';
import { responseController } from '../controllers/response.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { validateCreateResponse, validateUpdateResponseStatus } from '../validators/response.validator.js';

const router = express.Router();

// Public endpoint to submit survey response
router.post(
  '/public/surveys/:organizationSlug/:surveySlug',
  validate(validateCreateResponse),
  responseController.createResponse
);

// Protected endpoints
router.use(authMiddleware);
router.get('/', responseController.getResponses);
router.get('/:id', responseController.getResponseById);
router.patch('/:id', validate(validateUpdateResponseStatus), responseController.updateResponseStatus);

export default router;