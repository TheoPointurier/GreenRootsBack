import { Router } from 'express';

import * as campaignControllerBackOffice from '../../controllers/backOffice/campaign.controller.js';

export const router = Router();

// pour le back office:

router.get('/campaigns', campaignControllerBackOffice.getAllCampaignBackofice);
router.post('/campaigns', campaignControllerBackOffice.createCampaignBackofice);
// router.patch('/campaigns/:id', campaignController.updateCampaign);
// router.delete('/campaigns/:id', campaignController.deleteCampaign);
