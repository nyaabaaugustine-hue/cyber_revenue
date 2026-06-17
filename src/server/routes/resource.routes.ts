import { Router } from 'express';
import * as resCtrl from '../controllers/resource.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/users', resCtrl.listUsers);
router.get('/invoices', resCtrl.listInvoices);
router.get('/remittances', resCtrl.listRemittances);
router.put('/remittances/:id', resCtrl.updateRemittance);
router.get('/assets', resCtrl.listAssets);
router.get('/notifications', resCtrl.listNotifications);
router.put('/notifications/:id/read', resCtrl.markNotificationRead);
router.get('/ledger', resCtrl.listLedgerEntries);
router.get('/budgets', resCtrl.listBudgets);

export default router;
