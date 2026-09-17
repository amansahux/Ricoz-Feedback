import express from 'express';
import { surveyController } from '../controllers/survey.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', surveyController.createSurvey);
router.get('/', surveyController.getSurveys);
router.get('/:id', surveyController.getSurveyById);
router.patch('/:id', surveyController.updateSurvey);
router.delete('/:id', surveyController.deleteSurvey);
router.post('/:id/publish', surveyController.publishSurvey);

export default router;