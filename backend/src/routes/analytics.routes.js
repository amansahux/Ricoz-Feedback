import express from 'express';
import { analyticsController } from '../controllers/analytics.controller.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';
import { ROLES } from '../config/roles.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/overview', requireRole([ROLES.OWNER, ROLES.ADMIN]), analyticsController.getOverview);
router.get('/trends', requireRole(ROLES.OWNER), analyticsController.getTrends);

export default router;