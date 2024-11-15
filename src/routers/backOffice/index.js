import { Router } from 'express';

import { router as treeRouterBackOffice } from './tree.router.js';
import { router as campaignRouterBackOffice } from './campaign.router.js';
import { router as userRouterBackOffice } from './user.router.js';
import { router as authentificationRouterBackOffice } from './auth.router.js';
import { router as orderRouterBackOffice } from './order.router.js';
import { router as reviewRouterBackOffice } from './review.router.js';
import verifyTokenAdmin from '../../middlewares/authentificationAdmin.js';

// Router principal de l'API
export const router = Router();

// Brancher les routers secondaires :
router.use(authentificationRouterBackOffice);
router.use(verifyTokenAdmin, treeRouterBackOffice);
router.use(verifyTokenAdmin, campaignRouterBackOffice);
router.use(verifyTokenAdmin, userRouterBackOffice);
router.use(verifyTokenAdmin, orderRouterBackOffice);
router.use(verifyTokenAdmin, reviewRouterBackOffice);
