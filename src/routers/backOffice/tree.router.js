import { Router } from 'express';

import * as treeControllerBackOffice from '../../controllers/backOffice/tree.controller.js';

export const router = Router();

router.get('/trees', treeControllerBackOffice.getAllTreesBackOffice);
router.post('/trees', treeControllerBackOffice.createTreeBackOffice);
router.patch('/trees/:id', treeControllerBackOffice.updateTreeBackOffice);
// router.delete('/trees/:id', treeController.deleteTree);
