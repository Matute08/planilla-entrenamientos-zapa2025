// 1. CONTROLADOR: controllers/fixtureController.js
import { supabase } from '../services/supabaseClient.js';

export const getAllFixture = async (req, res) => {
  const { data, error } = await supabase.from('fixture').select('*').order('fecha').order('hora_inicio');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const createFixtureItem = async (req, res) => {
  const { equipo, etapa, hora_inicio, cancha, rival, observaciones } = req.body;

  const { data, error } = await supabase
    .from('fixture')
    .insert([{ equipo, etapa, hora_inicio, cancha, rival, observaciones }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

export const getFixtureSolapados = async (req, res) => {
  const query = `
    select
      f1.id as partido1_id,
      f1.equipo as equipo1,
      f1.fecha,
      f1.hora_inicio as inicio1,
      f1.rival as rival1,
      f2.id as partido2_id,
      f2.equipo as equipo2,
      f2.hora_inicio as inicio2,
      f2.rival as rival2
    from fixture f1
    join fixture f2 on
      f1.fecha = f2.fecha
      and f1.equipo != f2.equipo
      and (
        (f1.equipo = 'masculino' and f1.hora_inicio < f2.hora_inicio + interval '1 hour')
        or
        (f1.equipo = 'femenino' and f1.hora_inicio < f2.hora_inicio + interval '1 hour 30 minutes')
      )
      and (
        (f2.equipo = 'masculino' and f2.hora_inicio < f1.hora_inicio + interval '1 hour 30 minutes')
        or
        (f2.equipo = 'femenino' and f2.hora_inicio < f1.hora_inicio + interval '1 hour')
      );
  `;
  const { data, error } = await supabase.rpc('execute_sql', { query });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

