import { Router } from 'express';

import { router as treeRouterBackOffice } from './tree.router.js';
import { router as campaignRouterBackOffice } from './campaign.router.js';
import { router as userRouterBackOffice } from './user.router.js';
import { router as authentificationRouterBackOffice } from './auth.router.js';
import { router as orderRouterBackOffice } from './order.router.js';

// Router principal de l'API
export const router = Router();

// Brancher les routers secondaires :
router.use(treeRouterBackOffice);
router.use(campaignRouterBackOffice);
router.use(userRouterBackOffice);
router.use(authentificationRouterBackOffice);
router.use(orderRouterBackOffice);
router.use(authentificationRouterBackOffice);
