import { Router } from 'express';

import * as campaingController from '../../controllers/backOffice/campaign.controller.js';

export const router = Router();

// pour le back office:
// router.post('/campaigns', campaignController.createCampaign);
// router.patch('/campaigns/:id', campaignController.updateCampaign);
// router.delete('/campaigns/:id', campaignController.deleteCampaign);
