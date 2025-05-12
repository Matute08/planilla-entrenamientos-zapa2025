import express from 'express';
import {
  getAllPlayersF,
  createPlayerF,
  updatePlayerF,
  deletePlayerF,
} from '../../controllers/femenino/playersFController.js';

const router = express.Router();

router.get('/', getAllPlayersF);
router.post('/', createPlayerF);
router.patch('/:id', updatePlayerF);
router.delete('/:id', deletePlayerF);

export default router;
