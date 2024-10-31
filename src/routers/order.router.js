import { Router } from 'express';

import * as orderController from '../controllers/order.controller.js';

export const router = Router();

// router.get('/orders', orderController.getAllOrders);
// router.get('/orders/:id', orderController.getOneOrder);
// router.post('/orders', orderController.createOrder);
router.patch('/orders/:id', orderController.updateOrder);
// router.delete('/orders/:id', orderController.deleteOrder);
