import { Router } from 'express';

import * as backOfficeController from '../../controllers/backOffice/backOffice-controller.js';

export const router = Router();

router.get('/', backOfficeController.homeLogin);
router.post('/', backOfficeController.loginVerify);

router.get('/home', backOfficeController.adminPage);
