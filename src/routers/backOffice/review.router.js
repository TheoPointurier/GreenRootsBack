import { Router } from 'express';

import * as reviewControllerBackOffice from '../../controllers/backOffice/review.controller.js';

export const router = Router();

router.get('/reviews', reviewControllerBackOffice.getAllReviewsBackOffice);
router.patch('/reviews/:id', reviewControllerBackOffice.updateReviewBackOffice);
