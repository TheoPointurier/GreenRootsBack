import { Router } from 'express';

import * as backOfficeController from '../../controllers/backOffice/auth.controller.js';
import verifyTokenAdmin from '../../middlewares/authentificationAdmin.js';

export const router = Router();

router.get('/', backOfficeController.loginPage);
router.post('/', backOfficeController.loginVerify);
router.get('/home', verifyTokenAdmin, backOfficeController.adminPage);
router.post('/logout', backOfficeController.logout);
