import express from 'express'
import { getAttendance, upsertAttendance } from '../controllers/attendanceController.js'

const router = express.Router()

router.get('/', getAttendance)
router.post('/', upsertAttendance)

export default router
