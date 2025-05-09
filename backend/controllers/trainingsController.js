import { supabase } from '../services/supabaseClient.js'

// GET /api/trainings?month=4&year=2025
export const getTrainings = async (req, res) => {
  const { month, year } = req.query
  let query = supabase.from('trainings').select('*')

  if (month) query = query.eq('month', parseInt(month))
  // podrías agregar filtro por año si lo almacenás (de momento usamos solo mes)

  const { data, error } = await query.order('date', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// POST /api/trainings
// body: { date, is_suspended (opcional) }
export const createTraining = async (req, res) => {
  const { date, is_suspended = false } = req.body

  if (!date) return res.status(400).json({ error: 'La fecha es obligatoria' })

  const { data, error } = await supabase
    .from('trainings')
    .insert([{ date, is_suspended }])
    .select()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json({ message: 'Entrenamiento creado', data })
}

export const toggleSuspension = async (req, res) => {
  const { id } = req.params
  const { is_suspended } = req.body

  if (typeof is_suspended !== 'boolean') {
    return res.status(400).json({ error: 'Debes enviar is_suspended como booleano' })
  }

  const { data, error } = await supabase
    .from('trainings')
    .update({ is_suspended })
    .eq('id', id)
    .select()

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Estado actualizado', data })
}
