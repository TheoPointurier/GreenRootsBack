import { Router } from 'express';

import * as userControllerBackOffice from '../../controllers/backOffice/user.controller.js';

export const router = Router();

router.get('/users', userControllerBackOffice.getAllUsersBackOffice);
router.post('/users', userControllerBackOffice.createUserBackOffice);
router.patch('/users/:id', userControllerBackOffice.updateUserBackOffice);
