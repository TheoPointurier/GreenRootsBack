import { Router } from 'express';

import * as treeController from '../controllers/tree.controller.js';

export const router = Router();

// routes pour les arbres
router.get('/trees', treeController.getAllTrees);
router.get('/trees/:id', treeController.getOneTree);

//Pour le back Office
// router.post('/trees', treeController.createTree);
// router.patch('/trees/:id', treeController.updateTree);
// router.delete('/trees/:id', treeController.deleteTree);
