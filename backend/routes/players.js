import express from 'express'
import { getAllPlayers, createPlayer, updatePlayerName, deletePlayer } from '../controllers/playersController.js'

const router = express.Router()

router.get('/', getAllPlayers)
router.post('/', createPlayer);
router.patch('/:id', updatePlayerName);
router.delete('/:id', deletePlayer);


export default router
