import React from "react";
import { FaFutbol, FaBan } from "react-icons/fa";

function MonthlyAttendanceTable({
    players,
    trainingDates,
    selectedMonthIndex,
    months,
    suspendedDates,
    handleToggleSuspended,
    handleAttendanceChange,
    handlePaymentChange,
    handleDeletePlayer,
    handleUpdatePlayerName,
    isAuthenticated,
    isAuthorized,
    isGuest,
}) {
    const isEditor = isAuthenticated && isAuthorized && !isGuest;

    return (
        <>
            <h2 className="text-3xl font-semibold mb-4 text-center text-white">
                Registro de {months[selectedMonthIndex]}
            </h2>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                {players && players.length > 0 ? (
                    <table className="min-w-full divide-y divide-zinc-950 relative">
                        <thead className="bg-blue-300">
                            <tr>
                                {isEditor && (
                                    <th className="px-2 py-3 text-center text-xs font-bold text-black uppercase tracking-wider sticky top-0 left-0 bg-blue-300 z-30 align-bottom">
                                        Acciones
                                    </th>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider sticky top-0 bg-blue-300 z-30 align-bottom left-0">
                                    Jugador
                                </th>
                                {trainingDates.map((training, index) => (
                                    <th
                                        key={index}
                                        className="px-4 py-3 text-center text-xs font-bold text-stone-950 uppercase tracking-wider sticky top-0 z-20"
                                    >
                                        <div>
                                            {(() => {
                                                try {
                                                    return new Date(
                                                        training.date + "T00:00:00"
                                                    ).toLocaleDateString("es-AR", {
                                                        month: "short",
                                                        day: "numeric",
                                                    });
                                                } catch {
                                                    return training.date;
                                                }
                                            })()}
                                        </div>

                                        {isEditor && (
                                            <button
                                                onClick={() => handleToggleSuspended(index)}
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
                                                } ${!isEditor ? "opacity-50 cursor-not-allowed" : ""}`}
                                            >
                                                {suspendedDates[index] ? (
                                                    <FaFutbol size=".7em" />
                                                ) : (
                                                    <FaBan size=".7em" />
                                                )}
                                            </button>
                                        )}

                                        {!isEditor && suspendedDates[index] && (
                                            <FaBan
                                                size=".7em"
                                                className="text-gray-400 mx-auto mt-1"
                                                title="Suspendido"
                                            />
                                        )}
                                        {!isEditor && !suspendedDates[index] && (
                                            <FaFutbol
                                                size=".7em"
                                                className="text-gray-400 mx-auto mt-1"
                                                title="Activo"
                                            />
                                        )}
                                    </th>
                                ))}
                                <th className="px-6 py-3 text-center text-xs font-bold text-stone-950 uppercase tracking-wider sticky top-0 z-20">
                                    Pago ({months[selectedMonthIndex]})
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-zinc-400">
                            {players.map((player) => (
                                <tr key={player.id} className="hover:bg-gray-50">
                                    {isEditor && (
                                        <td className="px-2 py-4 whitespace-nowrap text-sm font-medium sticky left-0 bg-white hover:bg-gray-50 z-10">
                                            <div className="flex justify-center items-center space-x-1">
                                                <button
                                                    onClick={() =>
                                                        handleUpdatePlayerName(player.id, player.name)
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100"
                                                    title="Editar nombre"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeletePlayer(player.id, player.name)
                                                    }
                                                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                                                    title="Eliminar jugador"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky bg-white hover:bg-gray-50 z-10 left-0">
                                        {player.name}
                                    </td>

                                    {trainingDates.map((training, dateIndex) => {
                                        const isSuspended = training.is_suspended;
                                        const attendanceValue = player.attendance[dateIndex];

                                        return (
                                            <td
                                                key={dateIndex}
                                                className={`px-6 py-4 whitespace-nowrap text-sm text-center ${
                                                    isSuspended ? "bg-gray-200" : ""
                                                }`}
                                            >
                                                {isSuspended ? (
                                                    <span
                                                        className="text-gray-500 font-bold"
                                                        title="Entrenamiento suspendido"
                                                    >
                                                        S
                                                    </span>
                                                ) : (
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            typeof attendanceValue === "boolean"
                                                                ? attendanceValue
                                                                : false
                                                        }
                                                        onChange={() =>
                                                            handleAttendanceChange(
                                                                player.id,
                                                                dateIndex
                                                            )
                                                        }
                                                        disabled={!isEditor}
                                                        className={`form-checkbox h-5 w-5 text-blue-600 rounded cursor-pointer focus:ring-blue-500 ${
                                                            !isEditor
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                        }`}
                                                        aria-label={`Asistencia de ${player.name} para ${training.date}`}
                                                    />
                                                )}
                                            </td>
                                        );
                                    })}

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        <div className="flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={player.paid}
                                                onChange={() => handlePaymentChange(player.id)}
                                                disabled={!isEditor}
                                                className={`form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500 ${
                                                    !isEditor
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : "cursor-pointer"
                                                }`}
                                                aria-label={`Pago de ${player.name} para ${months[selectedMonthIndex]}`}
                                            />
                                            <span
                                                className={`ml-2 text-xs font-semibold ${
                                                    player.paid
                                                        ? "text-green-700"
                                                        : "text-red-700"
                                                }`}
                                            >
                                                {player.paid ? "Pagado" : "No Pago"}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="px-6 py-4 text-center font-medium text-lg text-stone-900">
                        {trainingDates && trainingDates.length > 0
                            ? `No hay jugadores registrados para ${months[selectedMonthIndex]}.`
                            : `En ${months[selectedMonthIndex]} no hubo entrenamientos registrados.`}
                    </div>
                )}
            </div>
        </>
    );
}

export default MonthlyAttendanceTable;
