import React from "react";
import { FaFutbol, FaBan } from "react-icons/fa"; // Ejemplo con react-icons
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
    handleDeletePlayer,
    handleUpdatePlayerName,
    isEditor,
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
                            <tr>
                                {isEditor && (
                                    <th
                                        scope="col"
                                        className="px-2 py-3 text-center text-xs font-bold text-stone-950 uppercase tracking-wider sticky top-0 left-0 bg-blue-300 z-30"
                                    >
                                        {" "}
                                        Acciones
                                    </th>
                                )}
                                <th
                                    scope="col"
                                    className={`px-6 py-3 text-xs font-bold text-stone-950 uppercase tracking-wider sticky left-0 top-0 bg-blue-300 z-30 ${
                                        isEditor
                                            ? "left-[calc(3rem+1px)]"
                                            : "left-0"
                                    }`}
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
                                            disabled={!isEditor}
                                            className={`mt-1 px-1 py-0.5 text-xs rounded ${
                                                suspendedDates[index]
                                                    ? "bg-green-500 hover:bg-green-600 text-stone-900"
                                                    : "bg-red-500 hover:bg-red-600 text-white"
                                            }${
                                                !isEditor
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                        >
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
                                    {isEditor && (
                                        <td className="px-2 py-4 whitespace-nowrap text-sm font-medium sticky left-0 bg-white hover:bg-gray-50 z-10">
                                            <div className="flex justify-center items-center space-x-1">
                                                {/* Botón Editar */}
                                                <button
                                                    onClick={() =>
                                                        handleUpdatePlayerName(
                                                            player.id,
                                                            player.name
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100"
                                                    title="Editar nombre"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                    >
                                                        {" "}
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                        />{" "}
                                                    </svg>
                                                </button>
                                                {/* Botón Eliminar: Llama al handler pasado por props */}
                                                <button
                                                    onClick={() =>
                                                        handleDeletePlayer(
                                                            player.id,
                                                            player.name
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100" // Añadido padding/hover bg
                                                    title="Eliminar jugador"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                    >
                                                        {" "}
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />{" "}
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    )}

                                    {/* Celda Nombre */}
                                    <td className={`px-6 py-4 whitespace-nowrap  text-sm font-medium text-gray-900 sticky left-0 bg-white hover:bg-gray-50 z-10 ${isEditor ? 'left-[calc(3rem+1px)]' : 'left-0'}`}>
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
                                                        disabled={!isEditor} // Deshabilitado si no es editor
                                                        className={`form-checkbox h-5 w-5 text-blue-600 rounded cursor-pointer focus:ring-blue-500 ${!isEditor ? 'opacity-50 cursor-not-allowed' : ''}`}

                                                        aria-label={`Asistencia de ${player.name} para ${trainingDates[dateIndex]}`}
                                                        
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
                                            disabled={!isEditor} // Deshabilitado si no es editor
                                            className={`form-checkbox h-5 w-5 text-green-600 rounded cursor-pointer focus:ring-green-500 ${!isEditor ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            
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
