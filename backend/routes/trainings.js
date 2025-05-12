import express from 'express'
import { getTrainings, createTraining, toggleSuspension, deleteTraining} from '../controllers/trainingsController.js'

const router = express.Router()

router.get('/', getTrainings)
router.post('/', createTraining)
router.patch('/:id/suspend', toggleSuspension)
router.delete('/:id', deleteTraining);


export default router
