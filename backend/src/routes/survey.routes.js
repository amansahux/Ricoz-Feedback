import express from 'express';
import { surveyController } from '../controllers/survey.controller.js';
import { authMiddleware, requirePermission } from '../middlewares/auth.middleware.js';
import { PERMISSIONS } from '../config/roles.js';
import { validate } from '../middlewares/validate.middleware.js';
import { validateCreateSurvey, validateUpdateSurvey } from '../validators/survey.validator.js';

const router = express.Router();

// Public endpoint to load survey for respondents
router.get('/public/:organizationSlug/:surveySlug', surveyController.getPublicSurvey);

// Protected endpoints
router.use(authMiddleware);

router.post('/', requirePermission(PERMISSIONS.SURVEY_CREATE), validate(validateCreateSurvey), surveyController.createSurvey);
router.get('/', requirePermission(PERMISSIONS.SURVEY_VIEW), surveyController.getSurveys);
router.get('/:id', requirePermission(PERMISSIONS.SURVEY_VIEW), surveyController.getSurveyById);
router.patch('/:id', requirePermission(PERMISSIONS.SURVEY_UPDATE), validate(validateUpdateSurvey), surveyController.updateSurvey);
router.delete('/:id', requirePermission(PERMISSIONS.SURVEY_DELETE), surveyController.deleteSurvey);
router.post('/:id/publish', requirePermission(PERMISSIONS.SURVEY_PUBLISH), surveyController.publishSurvey);

export default router;