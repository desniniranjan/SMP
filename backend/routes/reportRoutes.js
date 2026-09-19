import express from 'express';
import {
  getDepartmentSummary,
  getPortalSummary,
} from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/department-summary', getDepartmentSummary);
router.get('/portal-summary', getPortalSummary);

export default router;
