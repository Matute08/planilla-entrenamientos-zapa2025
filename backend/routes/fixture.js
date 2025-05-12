// 2. RUTA: routes/fixture.js
import express from 'express';
import { getAllFixture, createFixtureItem, getFixtureSolapados } from '../controllers/fixtureController.js';

const router = express.Router();
router.get('/', getAllFixture);
router.post('/', createFixtureItem);
router.get('/solapados', getFixtureSolapados);
export default router;

