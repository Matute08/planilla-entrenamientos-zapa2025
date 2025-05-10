import express from 'express'
import { getPayments, upsertPayment } from '../controllers/paymentsController.js'

const router = express.Router()

router.get('/', getPayments)
router.get('/pendings', getPendingPayments);
router.post('/', upsertPayment)

export default router
