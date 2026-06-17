import { Router } from 'express';
import * as analyticsCtrl from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/dashboard', analyticsCtrl.dashboard);
router.get('/revenue-trends', analyticsCtrl.revenueTrends);
router.get('/category-breakdown', analyticsCtrl.categoryBreakdown);
router.get('/financial-summary', analyticsCtrl.financialSummary);
router.get('/cash-flow', analyticsCtrl.cashFlow);
router.get('/activity', analyticsCtrl.activity);

export default router;
