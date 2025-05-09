import { supabase } from "../services/supabaseClient.js";

export const getAllPlayers = async (req, res) => {
  const { data, error } = await supabase.from("players").select("*");
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
