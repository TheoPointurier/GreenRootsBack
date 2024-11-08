import { Router } from 'express';

import * as orderControllerBackOffice from '../../controllers/backOffice/order.controller.js';

export const router = Router();

//Route pour le back office

router.get('/orders', orderControllerBackOffice.getAllOrdersBackOffice);
router.patch('/orders/:id', orderControllerBackOffice.updateOrderBackOffice);

//todo voir si dispo pour user ou admin
// router.get('/orders/:id', orderController.getOneOrder);

//Route pour le back office
// router.patch('/orders/:id', orderController.updateOrder);
// router.delete('/orders/:id', orderController.deleteOrder);
