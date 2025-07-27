import { supabase } from '../services/supabaseClient.js'

const ALL_MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];


// GET /api/payments?player_id=...&month=...&year=...
export const getPayments = async (req, res) => {
  const { player_id, month, year } = req.query

  let query = supabase.from('payments').select('*')

  if (player_id) query = query.eq('player_id', player_id)
  if (month) query = query.eq('month', parseInt(month))
  if (year) query = query.eq('year', parseInt(year))

  const { data, error } = await query

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// POST /api/payments
// body: { player_id, month, year, paid }
export const upsertPayment = async (req, res) => {
  const { player_id, month, year, paid } = req.body

  if (!player_id || month === undefined || year === undefined || paid === undefined) {
    return res.status(400).json({ error: 'Faltan datos para registrar el pago' })
  }

  const { data, error } = await supabase
    .from('payments')
    .upsert([{ player_id, month, year, paid }], { onConflict: ['player_id', 'month', 'year'] })

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Pago registrado/actualizado', data })
}

// GET /api/payments/pendings
export const getPendingPayments = async (req, res) => {
  const year = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  try {
    // 1. Traer todos los jugadores
    const { data: players, error: errorPlayers } = await supabase
      .from('players')
      .select('id, name');
    if (errorPlayers) throw errorPlayers;

    // 2. Traer todos los pagos del año actual
    const { data: payments, error: errorPayments } = await supabase
      .from('payments')
      .select('player_id, month, paid')
      .eq('year', year);
    if (errorPayments) throw errorPayments;

    // 3. Generar lista de meses del semestre (Julio a Noviembre)
    // Julio = 6, Agosto = 7, Septiembre = 8, Octubre = 9, Noviembre = 10
    const julyIndex = 6;
    const novemberIndex = 10;
    
    // Solo considerar meses desde julio hasta el mes actual (o noviembre si estamos después)
    const endMonth = Math.min(currentMonth, novemberIndex);
    const monthsToCheck = [];
    
    for (let i = julyIndex; i <= endMonth; i++) {
      monthsToCheck.push(i);
    }

    // 4. Calcular deudas por jugador
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
    console.error("Error en pagos pendientes:", err.message);
    res.status(500).json({ error: err.message });
  }
};

