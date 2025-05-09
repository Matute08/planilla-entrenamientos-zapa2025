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
// body: { player_id, training_id, present }
export const upsertAttendance = async (req, res) => {
  const { player_id, training_id, present } = req.body

  if (!player_id || !training_id || present === undefined) {
    return res.status(400).json({ error: 'Datos incompletos' })
  }

  const { data, error } = await supabase
    .from('attendance')
    .upsert([{ player_id, training_id, present }], { onConflict: ['player_id', 'training_id'] })

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Asistencia registrada', data })
}
