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
      .select('player_id, status');
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
      const trained = asistencias.filter((a) => a.status === 'present').length;
      const attendedNoTrained = asistencias.filter((a) => a.status === 'attended_no_trained').length;
      const totalAttended = trained + attendedNoTrained;
      
      // Calcular ausencias: total de entrenamientos - total de asistencias
      // Esto incluye tanto ausencias registradas como ausencias por defecto
      const missed = totalTrainings - totalAttended;

      return {
        name: player.name,
        trained, // Asistencias con entrenamiento
        attendedNoTrained, // Asistencias sin entrenamiento
        totalAttended, // Total de asistencias
        missed, // Faltas (incluye ausencias por defecto)
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
    console.error('Error en ranking:', err.message);
    res.status(500).json({ error: err.message });
  }
};

