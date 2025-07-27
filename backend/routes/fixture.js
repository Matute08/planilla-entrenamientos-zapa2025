// 2. RUTA: routes/fixture.js
import express from 'express';
import { getAllFixture, createFixtureItem, getFixtureSolapados, deleteFixtureByEtapas, deleteFixtureItem } from '../controllers/fixtureController.js';

const router = express.Router();

// Endpoint de prueba
router.get('/test', (req, res) => {
    res.json({ message: 'Fixture routes working correctly' });
});

router.get('/', getAllFixture);
router.post('/', createFixtureItem);
router.get('/solapados', getFixtureSolapados);
router.delete('/por-etapas', deleteFixtureByEtapas);
router.delete('/:id', deleteFixtureItem);
export default router;


