import { Router } from 'express';

import * as userController from '../controllers/user.controller.js';
import verifyToken from '../middlewares/authentification.js';
export const router = Router();

// routes pour les utilisateurs
router.get('/users/:id', verifyToken, userController.getOneUser);

//todo à tester
router.patch('/users/:id', verifyToken, userController.updateUser);
router.delete('/users/:id', verifyToken, userController.deleteUser);

//route pour les reviewss utilisateurs
router.get('/reviews', userController.getAllReviews);

// route en post pour backoffice
// router.post('/users', userController.createUser);
//(besoin de moins de vérification)
// router.get('/users', userController.getAllUsers);
