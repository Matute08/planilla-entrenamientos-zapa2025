import express from 'express';
import { getRankingF } from '../../controllers/femenino/rankingFController.js';

const router = express.Router();
router.get('/', getRankingF);

export default router;
