import { Router } from 'express';

import * as orderControllerBackOffice from '../../controllers/backOffice/order.controller.js';

export const router = Router();

//Route pour le back office

router.get('/orders', orderControllerBackOffice.getAllOrdersBackOffice);
router.patch('/orders/:id', orderControllerBackOffice.updateOrderBackOffice);
router.delete('/orders/:id', orderControllerBackOffice.deleteOrderBackOffice);

//todo voir si dispo pour user ou admin
// router.get('/orders/:id', orderController.getOneOrder);
