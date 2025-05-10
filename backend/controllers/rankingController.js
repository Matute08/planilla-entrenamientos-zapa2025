import { supabase } from '../services/supabaseClient.js';

export const getRanking = async (req, res) => {
  try {
    // 1. Traer jugadores
    const { data: players, error: errorPlayers } = await supabase
      .from('players')
      .select('id, name');

    if (errorPlayers) throw errorPlayers;

    // 2. Traer todas las asistencias
    const { data: attendance, error: errorAttendance } = await supabase
      .from('attendance')
      .select('player_id, present');

    if (errorAttendance) throw errorAttendance;

    // 3. Agrupar por jugador
    const ranking = players.map((player) => {
      const asistencias = attendance.filter((a) => a.player_id === player.id);
      const attended = asistencias.filter((a) => a.present).length;
      const missed = asistencias.filter((a) => a.present === false).length;
      const totalTrainings = attended + missed;

      return {
        name: player.name,
        attended,
        missed,
        totalTrainings,
      };
    });

    // 4. Ordenar por más asistencias
    ranking.sort((a, b) => b.attended - a.attended);

    res.json(ranking);
  } catch (err) {
    console.error('Error generando ranking:', err.message);
    res.status(500).json({ error: err.message });
  }
};
