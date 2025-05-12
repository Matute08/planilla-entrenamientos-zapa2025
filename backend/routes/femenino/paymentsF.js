import express from 'express';
import {
  getPaymentsF,
  upsertPaymentF,
  getPendingPaymentsF
} from '../../controllers/femenino/paymentsFController.js';

const router = express.Router();

router.get('/', getPaymentsF);
router.post('/', upsertPaymentF);
router.get('/pendings', getPendingPaymentsF);

export default router;
