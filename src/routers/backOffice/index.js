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

// Route racine
// Evolutions possibles : Ajouter une page doc Swagger
// router.use('/', (req, res) => {
//   res.send("<h1>Bienvenue sur l'API de GreenRoots</h1>");
// });

// Brancher les routers secondaires :
router.use(authentificationRouterBackOffice);

router.use(verifyTokenAdmin, treeRouterBackOffice);
router.use(verifyTokenAdmin, campaignRouterBackOffice);
router.use(verifyTokenAdmin, userRouterBackOffice);
router.use(verifyTokenAdmin, orderRouterBackOffice);
router.use(verifyTokenAdmin, reviewRouterBackOffice);
