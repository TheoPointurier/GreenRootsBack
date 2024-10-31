import { Router } from 'express';

import * as userController from '../controllers/user.controller.js';

export const router = Router();

// routes pour les utilisateurs
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getOneUser);
router.post('/users', userController.createUser);
router.patch('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// une route post user qui renvoi un jwt et un id
