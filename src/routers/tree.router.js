import { Router } from 'express';

import { treeController } from "../controllers/tree.controller.js";

export const router = Router();


// routes pour les arbres
router.get('/trees', treeController.getAllTrees);