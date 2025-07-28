import './loadEnv.js' // 👈 Cargamos variables antes de cualquier otra cosa

import express from 'express'
import cors from 'cors'

// Importación de rutas para el equipo masculino
import playersRoutes from './routes/players.js'
import attendanceRoutes from './routes/attendance.js'
import trainingsRoutes from './routes/trainings.js'
import paymentsRoutes from './routes/payments.js'
import rankingRoutes from './routes/ranking.js';
// Importación de rutas para el equipo femenino
import playersFRoutes from './routes/femenino/playersF.js';
import trainingsFRoutes from './routes/femenino/trainingsF.js';
import attendanceFRoutes from './routes/femenino/attendanceF.js';
import paymentsFRoutes from './routes/femenino/paymentsF.js';
import rankingFRoutes from './routes/femenino/rankingF.js';
import fixtureRoutes from './routes/fixture.js';





const app = express()
app.use(cors())
app.use(express.json())


// Rutas para el equipo masculino
app.use('/api/players', playersRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/trainings', trainingsRoutes)
app.use('/api/payments', paymentsRoutes)
app.use('/api/ranking', rankingRoutes);

// Rutas para el equipo femenino
app.use('/api/femenino/players', playersFRoutes);
app.use('/api/femenino/trainings', trainingsFRoutes);
app.use('/api/femenino/attendance', attendanceFRoutes);
app.use('/api/femenino/payments', paymentsFRoutes);
app.use('/api/femenino/ranking', rankingFRoutes);

// Rutas para el fixture
app.use('/api/fixture', fixtureRoutes);

// Endpoint de ping para mantener el servidor activo
app.get('/api/ping', (req, res) => {
  res.status(200).json({ 
    message: 'pong', 
    timestamp: new Date().toISOString(),
    status: 'active'
  });
});

// Endpoint de health check más detallado
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
