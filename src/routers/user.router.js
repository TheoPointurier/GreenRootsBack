import { Router } from 'express';

import * as userController from '../controllers/user.controller.js';
import verifyToken from '../middlewares/authentification.js';
export const router = Router();

// routes pour les utilisateurs
router.get('/users', userController.getAllUsers);
router.get('/users/:id', verifyToken, userController.getOneUser);
router.patch('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// route en post pour backoffice
router.post('/users', userController.createUser);
//(besoin de moins de vérification)
