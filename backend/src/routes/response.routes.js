import express from 'express';
import { responseController } from '../controllers/response.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public endpoint
router.post('/public/:organizationSlug/:surveySlug', responseController.createResponse);

// Protected endpoints
router.use(authMiddleware);
router.get('/', responseController.getResponses);
router.get('/:id', responseController.getResponseById);
router.patch('/:id', responseController.updateResponseStatus);

export default router;