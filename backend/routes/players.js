import express from 'express'
import { getAllPlayers } from '../controllers/playersController.js'

const router = express.Router()

router.get('/', getAllPlayers)

export default router
