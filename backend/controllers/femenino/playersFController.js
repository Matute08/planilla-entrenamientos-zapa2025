import { supabase } from '../../services/supabaseClient.js';

export const getAllPlayersF = async (req, res) => {
  const { data, error } = await supabase.from('players_femenino').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const createPlayerF = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Nombre requerido' });

  const { data, error } = await supabase
    .from('players_femenino')
    .insert([{ name }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

export const updatePlayerF = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const { data, error } = await supabase
    .from('players_femenino')
    .update({ name })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};

export const deletePlayerF = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('players_femenino')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Jugador/a eliminad@' });
};
