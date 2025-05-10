import { supabase } from '../services/supabaseClient.js';

export const getRanking = async (req, res) => {
  try {
    // 1. Traer todos los jugadores
    const { data: players, error: errorPlayers } = await supabase
      .from('players')
      .select('id, name');
    if (errorPlayers) throw errorPlayers;

    // 2. Traer todas las asistencias
    const { data: attendance, error: errorAttendance } = await supabase
      .from('attendance')
      .select('player_id, present');
    if (errorAttendance) throw errorAttendance;

    // 3. Traer entrenamientos hasta hoy que no fueron suspendidos
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const { data: trainings, error: errorTrainings } = await supabase
      .from('trainings')
      .select('id, date, is_suspended')
      .lte('date', today)
      .eq('is_suspended', false);
    if (errorTrainings) throw errorTrainings;

    const totalTrainings = trainings.length;

    // 4. Armar ranking
    const ranking = players.map((player) => {
      const asistencias = attendance.filter((a) => a.player_id === player.id);
      const attended = asistencias.filter((a) => a.present).length;
      const missed = asistencias.filter((a) => a.present === false).length;

      return {
        name: player.name,
        attended,
        missed,
        totalTrainings
      };
    });

    ranking.sort((a, b) => b.attended - a.attended);

    res.json(ranking);
  } catch (err) {
    console.error('Error en ranking:', err.message);
    res.status(500).json({ error: err.message });
  }
};

