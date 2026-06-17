import { Router } from 'express';
import authRoutes from './auth.routes.js';
import businessRoutes from './business.routes.js';
import collectionRoutes from './collection.routes.js';
import agentRoutes from './agent.routes.js';
import analyticsRoutes from './analytics.routes.js';
import managementRoutes from './management.routes.js';
import resourceRoutes from './resource.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/businesses', businessRoutes);
router.use('/collections', collectionRoutes);
router.use('/agents', agentRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/management', managementRoutes);
router.use('/resources', resourceRoutes);

export default router;
