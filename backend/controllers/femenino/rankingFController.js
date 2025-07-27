import { supabase } from '../../services/supabaseClient.js';

export const getRankingF = async (req, res) => {
  try {
    const { data: players, error: e1 } = await supabase.from('players_femenino').select('id, name');
    if (e1) throw e1;

    const { data: attendance, error: e2 } = await supabase.from('attendance_femenino').select('player_id, status');
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
      const trained = asistencias.filter((a) => a.status === 'present').length;
      const attendedNoTrained = asistencias.filter((a) => a.status === 'attended_no_trained').length;
      const missed = asistencias.filter((a) => a.status === 'absent').length;
      const totalAttended = trained + attendedNoTrained;

      return {
        name: player.name,
        trained, // Asistencias con entrenamiento
        attendedNoTrained, // Asistencias sin entrenamiento
        totalAttended, // Total de asistencias
        missed, // Faltas
        totalTrainings // Total de entrenamientos realizados
      };
    });

    // Ordenamiento sofisticado:
    // 1. Por total de asistencias descendente
    // 2. Si empatan, priorizar a los que entrenaron más (más 'trained')
    // 3. Si aún empatan, priorizar a los que asistieron pero no entrenaron menos (menos 'attendedNoTrained')
    ranking.sort((a, b) => {
      // Primer criterio: total de asistencias
      if (b.totalAttended !== a.totalAttended) {
        return b.totalAttended - a.totalAttended;
      }
      
      // Segundo criterio: si tienen el mismo total, priorizar a los que entrenaron más
      if (b.trained !== a.trained) {
        return b.trained - a.trained;
      }
      
      // Tercer criterio: si aún empatan, priorizar a los que asistieron pero no entrenaron menos
      return a.attendedNoTrained - b.attendedNoTrained;
    });

    res.json(ranking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
