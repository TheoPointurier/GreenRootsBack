import { Router } from 'express';
import verifyToken from '../middlewares/authentification.js';
import * as orderController from '../controllers/order.controller.js';

export const router = Router();

router.get('/orders', verifyToken, orderController.getAllOrdersByUser);
router.get('/orders/:id', orderController.getOneOrder);
router.post('/orders', verifyToken, orderController.createOrder);

//Route pour le back office
router.patch('/orders/:id', orderController.updateOrder);
router.delete('/orders/:id', orderController.deleteOrder);
