import { supabase } from '../../services/supabaseClient.js';

const ALL_MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const getPaymentsF = async (req, res) => {
  const { player_id, month, year } = req.query;

  let query = supabase.from('payments_femenino').select('*');
  if (player_id) query = query.eq('player_id', player_id);
  if (month) query = query.eq('month', parseInt(month));
  if (year) query = query.eq('year', parseInt(year));

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

export const upsertPaymentF = async (req, res) => {
  const { player_id, month, year, paid } = req.body;

  const { data, error } = await supabase
    .from('payments_femenino')
    .upsert([{ player_id, month, year, paid }], { onConflict: ['player_id', 'month', 'year'] });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Pago registrado', data });
};

export const getPendingPaymentsF = async (req, res) => {
  const year = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  try {
    const { data: players, error: e1 } = await supabase.from('players_femenino').select('id, name');
    if (e1) return res.status(500).json({ error: e1.message });

    const { data: payments, error: e2 } = await supabase
      .from('payments_femenino')
      .select('player_id, month, paid')
      .eq('year', year);
    if (e2) return res.status(500).json({ error: e2.message });

    // Generar lista de meses del semestre (Julio a Noviembre)
    // Julio = 6, Agosto = 7, Septiembre = 8, Octubre = 9, Noviembre = 10
    const julyIndex = 6;
    const novemberIndex = 10;
    
    // Solo considerar meses desde julio hasta el mes actual (o noviembre si estamos después)
    const endMonth = Math.min(currentMonth, novemberIndex);
    const monthsToCheck = [];
    
    for (let i = julyIndex; i <= endMonth; i++) {
      monthsToCheck.push(i);
    }

    const resultados = players.map(player => {
      const pagosJugador = payments.filter(p => p.player_id === player.id);
      const owedMonths = monthsToCheck.filter(m => {
        const pago = pagosJugador.find(p => p.month === m);
        return !pago || !pago.paid;
      });

      return {
        name: player.name,
        owedCount: owedMonths.length,
        owedMonths: owedMonths.map(i => ALL_MONTH_NAMES[i])
      };
    });

    res.json(resultados.filter(r => r.owedCount > 0));
  } catch (err) {
    console.error("Error en pagos pendientes femenino:", err.message);
    res.status(500).json({ error: err.message });
  }
};
