import { Router } from 'express';
import * as agentCtrl from '../controllers/agent.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/dashboard', agentCtrl.dashboard);
router.get('/locations', agentCtrl.getAllLocations);
router.post('/location', validate([
  { field: 'lat', type: 'number', required: true },
  { field: 'lng', type: 'number', required: true },
]), agentCtrl.updateLocation);
router.get('/', agentCtrl.list);
router.get('/:id', agentCtrl.getById);
router.put('/:id', agentCtrl.update);

export default router;
