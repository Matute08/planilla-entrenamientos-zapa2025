import express from 'express'
import { getTrainings, createTraining, toggleSuspension } from '../controllers/trainingsController.js'

const router = express.Router()

router.get('/', getTrainings)
router.post('/', createTraining)
router.patch('/:id/suspend', toggleSuspension)

export default router
