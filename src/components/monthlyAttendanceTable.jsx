import React from "react";
import { FaFutbol , FaBan  } from "react-icons/fa"; // Ejemplo con react-icons
// Componente para mostrar la tabla de asistencia mensual
function MonthlyAttendanceTable({
    players,
    trainingDates,
    selectedMonthIndex,
    months,
    suspendedDates,
    handleToggleSuspended,
    handleAttendanceChange, // Recibe la función para manejar el cambio
    handlePaymentChange, // Recibe la función para manejar el cambio
}) {
    return (
        <>
            {/* Título del mes */}
            <h2 className="text-3xl font-semibold mb-4 text-center text-white">
                {" "}
                Registro de {months[selectedMonthIndex]}{" "}
            </h2>
            {/* Tabla */}

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                {/* Mensaje si no hay jugadores */}
                {players.length === 0 ? (
                    <tr>
                        <td
                            colSpan={trainingDates.length + 2}
                            className="px-6 py-4 text-center fond-bold text-lg text-stone-900"
                        >
                            En {months[selectedMonthIndex]} no hubo
                            entrenamientos.
                        </td>
                    </tr>
                ) : (
                    <table className="min-w-full divide-y divide-zinc-950">
                        <thead className="bg-blue-300">
                            <tr >
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-stone-950 uppercase tracking-wider sticky left-0 top-0 bg-blue-300 z-30 "
                                >
                                    {" "}
                                    Jugador{" "}
                                </th>
                                {/* Mapea las fechas de entrenamiento para los encabezados */}
                                {trainingDates.map((date, index) => (
                                    <th
                                        key={index}
                                        scope="col"
                                        className="px-6 py-3 text-center text-xs font-bold text-stone-950 uppercase tracking-wider sticky top-0 z-20 "
                                    >
                                        <div>
                                            {/* Formatea la fecha */}
                                            {(() => {
                                                try {
                                                    return new Date(
                                                        date + "T00:00:00"
                                                    ).toLocaleDateString(
                                                        "es-AR",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                        }
                                                    );
                                                } catch {
                                                    return date;
                                                }
                                            })()}
                                        </div>
                                        {/* Botón Suspender/Reactivar */}
                                        <button
                                            onClick={() =>
                                                handleToggleSuspended(index)
                                            }
                                            title={
                                                suspendedDates[index]
                                                    ? "Reactivar entrenamiento"
                                                    : "Suspender entrenamiento"
                                            }
                                            className={`mt-1 px-1 py-0.5 text-xs rounded ${
                                                suspendedDates[index]
                                                    ? "bg-green-500 hover:bg-green-600 text-stone-900"
                                                    : "bg-red-500 hover:bg-red-600 text-white"
                                            }`}
                                        >
                                            {/* Puedes usar texto o iconos */}
                                            {/* {suspendedDates[index] ? 'Reactivar' : 'Suspender'} */}
                                            {/* Alternativa con iconos (requiere instalar react-icons): */}
                                            {suspendedDates[index] ? (
                                                <FaFutbol size=".7em" />
                                            ) : (
                                                <FaBan size=".7em" />
                                            )}
                                        </button>
                                    </th>
                                ))}
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-bold text-stone-950 uppercase tracking-wider sticky top-0 z-20 "
                                >
                                    {" "}
                                    Pago ({months[selectedMonthIndex]}){" "}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-zinc-400">
                            {/* Mapea los jugadores para las filas */}
                            {players.map((player) => (
                                <tr
                                    key={player.id}
                                    className="hover:bg-gray-50"
                                >
                                    {/* Celda Nombre */}
                                    <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium text-gray-900 sticky left-0 bg-white hover:bg-gray-50 z-10">
                                        {" "}
                                        {player.name}{" "}
                                    </td>
                                    {/* Celdas Asistencia */}
                                    {trainingDates.map((_, dateIndex) => {
                                        const isSuspended =
                                            suspendedDates[dateIndex];
                                        const attendanceValue =
                                            player.attendance[dateIndex]; // Puede ser true, false, o 'suspended'

                                        return (
                                            <td
                                                key={dateIndex}
                                                className={`px-6 py-4 whitespace-nowrap text-sm text-center ${
                                                    isSuspended
                                                        ? "bg-gray-200"
                                                        : "" // Fondo gris si está suspendido
                                                }`}
                                            >
                                                {isSuspended ? (
                                                    // Muestra 'S' o un icono si está suspendido
                                                    <span
                                                        className="text-gray-500 font-bold"
                                                        title="Entrenamiento suspendido"
                                                    >
                                                        S
                                                    </span>
                                                ) : (
                                                    // O un icono: <FaPause className="text-gray-400 mx-auto" />
                                                    // Muestra el checkbox normal si no está suspendido
                                                    <input
                                                        type="checkbox"
                                                        // Usa el valor booleano (true/false), ignora 'suspended' aquí
                                                        checked={
                                                            typeof attendanceValue ===
                                                            "boolean"
                                                                ? attendanceValue
                                                                : false
                                                        }
                                                        onChange={() =>
                                                            handleAttendanceChange(
                                                                player.id,
                                                                dateIndex
                                                            )
                                                        }
                                                        className="form-checkbox h-5 w-5 text-blue-600 rounded cursor-pointer focus:ring-blue-500"
                                                        aria-label={`Asistencia de ${player.name} para ${trainingDates[dateIndex]}`}
                                                        disabled={isSuspended} // Deshabilitado si está suspendido (aunque no se muestra)
                                                    />
                                                )}
                                            </td>
                                        );
                                    })}
                                    {/* Celda Pago */}
                                    <td className="flex items-center justify-center px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        <input
                                            type="checkbox"
                                            checked={player.paid}
                                            // Llama a la función pasada por props
                                            onChange={() =>
                                                handlePaymentChange(player.id)
                                            }
                                            className="form-checkbox h-5 w-5 text-green-600 rounded cursor-pointer focus:ring-green-500"
                                            aria-label={`Pago de ${player.name} para ${months[selectedMonthIndex]}`}
                                        />
                                        <span
                                            className={`ml-2 text-xs font-semibold ${
                                                player.paid
                                                    ? "text-green-700"
                                                    : "text-red-700"
                                            }`}
                                        >
                                            {" "}
                                            {player.paid
                                                ? "Pagado"
                                                : "No Pago"}{" "}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default MonthlyAttendanceTable;
