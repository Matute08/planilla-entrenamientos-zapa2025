import './loadEnv.js' // 👈 Cargamos variables antes de cualquier otra cosa

import express from 'express'
import cors from 'cors'

import playersRoutes from './routes/players.js'
import attendanceRoutes from './routes/attendance.js'
import trainingsRoutes from './routes/trainings.js'
import paymentsRoutes from './routes/payments.js'



const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/players', playersRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/trainings', trainingsRoutes)
app.use('/api/payments', paymentsRoutes)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
