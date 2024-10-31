import { Router } from 'express';

import * as userController from '../controllers/user.controller.js';

export const router = Router();

// routes pour les utilisateurs
router.get('/users', userController.getAllUsers);
