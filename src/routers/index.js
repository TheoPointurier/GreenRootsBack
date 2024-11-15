import { Router } from 'express';

import { router as treeRouter } from './tree.router.js';
import { router as campaignRouter } from './campaign.router.js';
import { router as userRouter } from './user.router.js';
import { router as authentificationRouter } from './authentification.router.js';
import { router as orderRouter } from './order.router.js';

// Router principal de l'API
export const router = Router();

// Brancher les routers secondaires :
router.use(treeRouter);
router.use(campaignRouter);
router.use(userRouter);
router.use(authentificationRouter);
router.use(orderRouter);
