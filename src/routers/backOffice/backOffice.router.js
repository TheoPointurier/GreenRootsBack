import { Router } from 'express';

import * as backOfficeController from '../../controllers/backOffice/backOffice-controller.js';
import verifyTokenAdmin from '../../middlewares/authentificationAdmin.js';

export const router = Router();

router.get('/', backOfficeController.loginPage);
router.post('/', backOfficeController.loginVerify);

router.get('/home', verifyTokenAdmin, backOfficeController.adminPage);

router.post('/home', backOfficeController.logout);

// pour le back office:
// router.post('/campaigns', campaignController.createCampaign);
// router.patch('/campaigns/:id', campaignController.updateCampaign);
// router.delete('/campaigns/:id', campaignController.deleteCampaign);

//Route pour le back office ?
//todo voir si dispo pour user ou admin
// router.get('/orders/:id', orderController.getOneOrder);

//Route pour le back office
// router.patch('/orders/:id', orderController.updateOrder);
// router.delete('/orders/:id', orderController.deleteOrder);

//Pour le back Office
// router.post('/trees', treeController.createTree);
// router.patch('/trees/:id', treeController.updateTree);
// router.delete('/trees/:id', treeController.deleteTree);

// route en post pour backoffice
// router.post('/users', userController.createUser);
//(besoin de moins de vérification)
// router.get('/users', userController.getAllUsers);
