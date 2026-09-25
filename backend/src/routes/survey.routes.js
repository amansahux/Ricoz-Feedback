import express from 'express';
import { surveyController } from '../controllers/survey.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { validateCreateSurvey, validateUpdateSurvey } from '../validators/survey.validator.js';

const router = express.Router();

// Public endpoint to load survey for respondents
router.get('/public/:organizationSlug/:surveySlug', surveyController.getPublicSurvey);

// Protected endpoints
router.use(authMiddleware);

router.post('/', validate(validateCreateSurvey), surveyController.createSurvey);
router.get('/', surveyController.getSurveys);
router.get('/:id', surveyController.getSurveyById);
router.patch('/:id', validate(validateUpdateSurvey), surveyController.updateSurvey);
router.delete('/:id', surveyController.deleteSurvey);
router.post('/:id/publish', surveyController.publishSurvey);

export default router;