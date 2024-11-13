import { Router } from 'express';

import * as userController from '../controllers/user.controller.js';
import verifyToken from '../middlewares/authentification.js';
export const router = Router();

router.get('/users/:id', verifyToken, userController.getOneUser);
router.patch('/users/:id', verifyToken, userController.updateUser);
router.delete('/users/:id', verifyToken, userController.deleteUser);

router.get('/reviews', userController.getAllReviews);
