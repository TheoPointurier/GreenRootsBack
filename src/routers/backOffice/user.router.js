import { Router } from 'express';

import * as userControllerBackOffice from '../../controllers/backOffice/user.controller.js';

export const router = Router();

router.get('/users', userControllerBackOffice.getAllUsersBackOffice);
router.post('/users', userControllerBackOffice.createUserBackOffice);
//(besoin de moins de vérification)
// router.get('/users', userController.getAllUsers);
