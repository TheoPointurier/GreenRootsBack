import { Router } from 'express';

import * as authController from '../controllers/auth.controller.js';

export const router = Router();

// routes pour l'authentification
router.post('/login', authController.login);
router.post('/register', authController.register);
