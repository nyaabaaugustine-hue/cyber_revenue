import { Router } from 'express';
import * as mgmtCtrl from '../controllers/management.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/anomalies', mgmtCtrl.listAnomalies);
router.put('/anomalies/:id/resolve', mgmtCtrl.resolveAnomaly);
router.get('/disputes', mgmtCtrl.listDisputes);
router.put('/disputes/:id', mgmtCtrl.updateDispute);
router.get('/compliance', mgmtCtrl.listComplianceChecks);
router.get('/reconciliation', mgmtCtrl.listReconciliation);
router.get('/commissions', mgmtCtrl.listCommissions);
router.get('/alerts', mgmtCtrl.listAlerts);

export default router;
