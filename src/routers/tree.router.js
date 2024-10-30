import { Router } from 'express';

import * as treeController from "../controllers/tree.controller.js"

export const router = Router();


// routes pour les arbres
router.get('/trees', treeController.getAllTrees);
router.get('/trees/:id', treeController.getOneTree);