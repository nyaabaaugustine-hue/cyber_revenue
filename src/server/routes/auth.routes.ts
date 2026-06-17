import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

router.post('/login', validate([
  { field: 'email', type: 'email', required: true },
  { field: 'password', type: 'string', required: true, min: 6 },
]), authCtrl.login);

router.get('/me', authenticate, authCtrl.me);
router.post('/refresh', authCtrl.refresh);

export default router;
