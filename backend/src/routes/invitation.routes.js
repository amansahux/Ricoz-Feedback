import express from 'express';
import { teamController } from '../controllers/team.controller.js';

const router = express.Router();

// Public invitation validation and acceptance endpoints
router.get('/:token', teamController.getInvitationByToken);
router.post('/:token/accept', teamController.acceptInvitation);

export default router;
