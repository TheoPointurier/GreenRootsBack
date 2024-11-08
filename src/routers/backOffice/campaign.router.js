import { Router } from 'express';

import * as campaignControllerBackOffice from '../../controllers/backOffice/campaign.controller.js';

export const router = Router();

// pour le back office:

router.get('/campaigns', campaignControllerBackOffice.getAllCampaignBackofice);
router.post(
  '/campaigns',
  campaignControllerBackOffice.createCampaignBackoffice,
);
router.patch(
  '/campaigns/:id',
  campaignControllerBackOffice.updateCampaignBackOffice,
);
router.delete(
  '/campaigns/:id',
  campaignControllerBackOffice.deleteCampaignBackOffice,
);
