import express from 'express';
import {
  getAttendanceF,
  upsertAttendanceF
} from '../../controllers/femenino/attendanceFController.js';

const router = express.Router();

router.get('/', getAttendanceF);
router.post('/', upsertAttendanceF);

export default router;
