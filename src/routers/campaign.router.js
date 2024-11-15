import { Router } from 'express';

import * as campaignController from '../controllers/campaign.controller.js';

export const router = Router();

router.get('/campaigns', campaignController.getAllCampaign);
router.get('/campaigns/:id', campaignController.getCampaign);
