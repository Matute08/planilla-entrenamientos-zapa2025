import { supabase } from "../services/supabaseClient.js";

// GET /api/players
// Devuelve todos los jugadores
export const getAllPlayers = async (req, res) => {
  const { data, error } = await supabase.from("players").select("*");
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/players
// Crea un nuevo jugador
export const createPlayer = async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Nombre inválido' });
  }

  const { data, error } = await supabase
    .from('players')
    .insert([{ name }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

// Actualiza el nombre de un jugador
// PATCH /api/players/:id
export const updatePlayerName = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Nombre inválido' });
  }

  const { data, error } = await supabase
    .from('players')
    .update({ name })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};

// Elimina un jugador
// DELETE /api/players/:id
export const deletePlayer = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Jugador eliminado' });
};

