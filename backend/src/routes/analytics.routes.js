import express from 'express';
import { analyticsController } from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/overview', analyticsController.getOverview);
router.get('/trends', analyticsController.getTrends);

export default router;