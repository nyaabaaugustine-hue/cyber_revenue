import { Router } from 'express';
import * as colCtrl from '../controllers/collection.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/', colCtrl.list);
router.get('/my', colCtrl.listMyCollections);
router.post('/', validate([
  { field: 'businessId', type: 'string', required: true },
  { field: 'amount', type: 'number', required: true },
  { field: 'paymentMethod', type: 'string', required: true },
]), colCtrl.create);
router.post('/visits', validate([
  { field: 'businessId', type: 'string', required: true },
]), colCtrl.createVisit);
router.get('/visits', colCtrl.listVisits);
router.get('/due', colCtrl.listDue);
router.get('/levy-bills', colCtrl.listLevyBills);
router.get('/arrears', colCtrl.listArrears);
router.get('/zone/:zoneId', colCtrl.getZoneBusinesses);

export default router;
