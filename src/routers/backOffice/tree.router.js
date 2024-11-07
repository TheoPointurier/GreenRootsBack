import { Router } from 'express';

import * as treeController from '../../controllers/backOffice/tree.controller.js';

export const router = Router();

router.get('/trees', treeController.getAllTreesBackOffice);
// router.post('/trees', treeController.createTree);
// router.patch('/trees/:id', treeController.updateTree);
// router.delete('/trees/:id', treeController.deleteTree);
