import { supabase } from '../../services/supabaseClient.js';

export const getRankingF = async (req, res) => {
  try {
    const { data: players, error: e1 } = await supabase.from('players_femenino').select('id, name');
    if (e1) throw e1;

    const { data: attendance, error: e2 } = await supabase.from('attendance_femenino').select('player_id, present');
    if (e2) throw e2;

    const { data: trainings, error: e3 } = await supabase
      .from('trainings_femenino')
      .select('id, date, is_suspended')
      .lte('date', new Date().toISOString().split('T')[0])
      .eq('is_suspended', false);
    if (e3) throw e3;

    const totalTrainings = trainings.length;

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
    res.status(500).json({ error: err.message });
  }
};
