import { supabase } from '../../services/supabaseClient.js';

export const getTrainingsF = async (req, res) => {
  const { month } = req.query;

  let query = supabase.from('trainings_femenino').select('*');
  if (month !== undefined) {
    // Filtrar por mes usando la fecha
    const currentYear = new Date().getFullYear()
    const startDate = new Date(currentYear, parseInt(month), 1).toISOString().split('T')[0]
    const endDate = new Date(currentYear, parseInt(month) + 1, 0).toISOString().split('T')[0]
    query = query.gte('date', startDate).lte('date', endDate)
  }

  const { data, error } = await query.order('date', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

export const createTrainingF = async (req, res) => {
  const { date, is_suspended = false } = req.body;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: "Fecha inválida (YYYY-MM-DD esperada)" });
  }

  const { data, error } = await supabase
    .from('trainings_femenino')
    .insert([{ date, is_suspended }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

export const deleteTrainingF = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('trainings_femenino')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Entrenamiento eliminado' });
};

export const toggleSuspensionF = async (req, res) => {
  const { id } = req.params;
  const { is_suspended } = req.body;

  const { data, error } = await supabase
    .from('trainings_femenino')
    .update({ is_suspended })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};
