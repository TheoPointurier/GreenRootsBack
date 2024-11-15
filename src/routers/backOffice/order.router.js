import { Router } from 'express';

import * as orderControllerBackOffice from '../../controllers/backOffice/order.controller.js';

export const router = Router();

router.get('/orders', orderControllerBackOffice.getAllOrdersBackOffice);
router.patch('/orders/:id', orderControllerBackOffice.updateOrderBackOffice);
router.delete('/orders/:id', orderControllerBackOffice.deleteOrderBackOffice);
