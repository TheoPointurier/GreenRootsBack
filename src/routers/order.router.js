import { Router } from 'express';
import verifyToken from '../middlewares/authentification.js';
import * as orderController from '../controllers/order.controller.js';

export const router = Router();

router.get('/orders', verifyToken, orderController.getAllOrdersByUser);
router.post('/orders', verifyToken, orderController.createOrder);
