import { Router } from 'express';
import * as bizCtrl from '../controllers/business.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/', bizCtrl.list);
router.get('/zones', bizCtrl.listZones);
router.get('/categories', bizCtrl.listCategories);
router.get('/districts', bizCtrl.listDistricts);
router.get('/:id', bizCtrl.getById);
router.get('/:id/collections', bizCtrl.getCollectionsByBusiness);
router.post('/', validate([
  { field: 'name', type: 'string', required: true },
  { field: 'ownerName', type: 'string', required: true },
  { field: 'zoneId', type: 'string', required: true },
  { field: 'categoryId', type: 'string', required: true },
  { field: 'districtId', type: 'string', required: true },
]), bizCtrl.create);
router.put('/:id', bizCtrl.update);

export default router;
