import express from 'express';
import {
  getTrainingsF,
  createTrainingF,
  deleteTrainingF,
  toggleSuspensionF
} from '../../controllers/femenino/trainingsFController.js';

const router = express.Router();

router.get('/', getTrainingsF);
router.post('/', createTrainingF);
router.delete('/:id', deleteTrainingF);
router.patch('/:id/suspend', toggleSuspensionF);

export default router;
