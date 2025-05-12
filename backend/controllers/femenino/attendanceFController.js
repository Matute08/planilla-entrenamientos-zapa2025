import { supabase } from '../../services/supabaseClient.js';

export const getAttendanceF = async (req, res) => {
  const { player_id, training_id } = req.query;

  let query = supabase.from('attendance_femenino').select('*');
  if (player_id) query = query.eq('player_id', player_id);
  if (training_id) query = query.eq('training_id', training_id);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

export const upsertAttendanceF = async (req, res) => {
  const { player_id, training_id, present } = req.body;

  const { data, error } = await supabase
    .from('attendance_femenino')
    .upsert([{ player_id, training_id, present }], { onConflict: ['player_id', 'training_id'] });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Asistencia registrada', data });
};
