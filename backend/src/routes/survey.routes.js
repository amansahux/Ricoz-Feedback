import express from 'express';
import { surveyController } from '../controllers/survey.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', authMiddleware, surveyController.createSurvey);
router.get('/', authMiddleware, surveyController.getSurveys);
router.get('/:id', authMiddleware, surveyController.getSurveyById);
router.patch('/:id', authMiddleware, surveyController.updateSurvey);
router.delete('/:id', authMiddleware, surveyController.deleteSurvey);
router.post('/:id/publish', authMiddleware, surveyController.publishSurvey);

export default router;