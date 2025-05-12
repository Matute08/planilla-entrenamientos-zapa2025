// 1. CONTROLADOR: controllers/fixtureController.js
import { supabase } from "../services/supabaseClient.js";

export const getAllFixture = async (req, res) => {
  const { data, error } = await supabase
    .from('fixture')
    .select('*')
    .order('etapa')
    .order('hora_inicio');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};


export const createFixtureItem = async (req, res) => {
  const { equipo, etapa, hora_inicio, cancha, rival, observaciones } = req.body;

  const { data, error } = await supabase
    .from("fixture")
    .insert([{ equipo, etapa, hora_inicio, cancha, rival, observaciones }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

export const getFixtureSolapados = async (req, res) => {
  const { data, error } = await supabase.rpc('fixture_solapados_logicos');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};


