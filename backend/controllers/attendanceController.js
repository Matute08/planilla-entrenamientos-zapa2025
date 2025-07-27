import { supabase } from '../services/supabaseClient.js'

// GET /api/attendance?player_id=...&training_id=...
export const getAttendance = async (req, res) => {
  const { player_id, training_id } = req.query

  let query = supabase.from('attendance').select('*')

  if (player_id) query = query.eq('player_id', player_id)
  if (training_id) query = query.eq('training_id', training_id)

  const { data, error } = await query

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// POST /api/attendance
// body: { player_id, training_id, status } donde status puede ser 'absent', 'present', 'attended_no_trained'
export const upsertAttendance = async (req, res) => {
  const { player_id, training_id, status } = req.body

  // Validación más específica
  if (!player_id) {
    return res.status(400).json({ error: 'player_id es requerido' })
  }
  if (!training_id) {
    return res.status(400).json({ error: 'training_id es requerido' })
  }
  if (!status) {
    return res.status(400).json({ error: 'status es requerido' })
  }

  // Validar que el status sea válido
  const validStatuses = ['absent', 'present', 'attended_no_trained']
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Status inválido. Debe ser: absent, present, o attended_no_trained' })
  }

  const { data, error } = await supabase
    .from('attendance')
    .upsert([{ player_id, training_id, status }], { onConflict: ['player_id', 'training_id'] })

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Asistencia registrada', data })
}
