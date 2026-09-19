import express from 'express';
import {
  getVerificationActivities,
  updateVerification,
} from '../controllers/verificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/', getVerificationActivities);
router.put('/:id', updateVerification);

export default router;
