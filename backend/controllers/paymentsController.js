import { supabase } from '../services/supabaseClient.js'

// GET /api/payments?player_id=...&month=...&year=...
export const getPayments = async (req, res) => {
  const { player_id, month, year } = req.query

  let query = supabase.from('payments').select('*')

  if (player_id) query = query.eq('player_id', player_id)
  if (month) query = query.eq('month', parseInt(month))
  if (year) query = query.eq('year', parseInt(year))

  const { data, error } = await query

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// POST /api/payments
// body: { player_id, month, year, paid }
export const upsertPayment = async (req, res) => {
  const { player_id, month, year, paid } = req.body

  if (!player_id || month === undefined || year === undefined || paid === undefined) {
    return res.status(400).json({ error: 'Faltan datos para registrar el pago' })
  }

  const { data, error } = await supabase
    .from('payments')
    .upsert([{ player_id, month, year, paid }], { onConflict: ['player_id', 'month', 'year'] })

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Pago registrado/actualizado', data })
}
