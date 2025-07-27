import React from "react";
import { FaFutbol, FaBan, FaPlus } from "react-icons/fa";
import AttendanceStatusButton from "./attendanceStatusButton.jsx";

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
    handleDeleteTraining,
    handleAddTraining,
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

            {/* Leyenda de estados */}
            <div className="mb-4 p-3 bg-white rounded-lg shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Leyenda de Estados:
                </h3>
                <div className="flex flex-wrap gap-4 text-xs justify-center">
                    <div className="flex items-center gap-2">
                        <AttendanceStatusButton
                            status="present"
                            onStatusChange={() => {}}
                            disabled={true}
                        />
                        <span>Entrenó</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <AttendanceStatusButton
                            status="attended_no_trained"
                            onStatusChange={() => {}}
                            disabled={true}
                        />
                        <span>No entrenó</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <AttendanceStatusButton
                            status="absent"
                            onStatusChange={() => {}}
                            disabled={true}
                        />
                        <span>No asistió</span>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                {players && players.length > 0 ? (
                    <table className="min-w-full divide-y divide-zinc-950 relative">
                        <thead className="bg-blue-300">
                            <tr>
                                {isEditor && (
                                    <th className="px-3 py-3 text-center text-xs font-bold text-black uppercase tracking-wider sticky top-0 left-0 bg-blue-300 z-10 align-bottom w-16">
                                        Acciones
                                    </th>
                                )}
                                <th
                                    className={`${
                                        isEditor ? "pl-5 pr-5" : "pl-5 pr-5"
                                    } py-3 text-left text-xs font-bold text-black uppercase tracking-wider sticky top-0 bg-blue-300 z-30 align-bottom left-0`}
                                >
                                    Jugador
                                </th>
                                {trainingDates.map((training, index) => (
                                    <th
                                        key={index}
                                        className="px-4 py-3 text-center text-xs font-bold text-stone-950 uppercase tracking-wider sticky top-0 z-20"
                                    >
                                        <div className="flex flex-col items-center space-y-1">
                                            {/* Fecha */}
                                            <span>
                                                {(() => {
                                                    try {
                                                        return new Date(
                                                            training.date +
                                                                "T00:00:00"
                                                        ).toLocaleDateString(
                                                            "es-AR",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                            }
                                                        );
                                                    } catch {
                                                        return training.date;
                                                    }
                                                })()}
                                            </span>

                                            {/* Botones en fila */}
                                            {isEditor && (
                                                <div className="flex flex-row items-center space-x-3">
                                                    <button
                                                        onClick={() =>
                                                            handleToggleSuspended(
                                                                index
                                                            )
                                                        }
                                                        title={
                                                            suspendedDates[
                                                                index
                                                            ]
                                                                ? "Reactivar entrenamiento"
                                                                : "Suspender entrenamiento"
                                                        }
                                                        disabled={!isEditor}
                                                        className={`px-1 py-0.5 text-xs rounded ${
                                                            suspendedDates[
                                                                index
                                                            ]
                                                                ? "bg-green-500 hover:bg-green-600 text-stone-900"
                                                                : "bg-red-500 hover:bg-red-600 text-white"
                                                        } ${
                                                            !isEditor
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                        }`}
                                                    >
                                                        {suspendedDates[
                                                            index
                                                        ] ? (
                                                            <FaFutbol size=".7em" />
                                                        ) : (
                                                            <FaBan size=".7em" />
                                                        )}
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDeleteTraining(
                                                                training.id,
                                                                training.date
                                                            )
                                                        }
                                                        title="Eliminar entrenamiento"
                                                        className="text-red-600 text-sm hover:text-red-800"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                ))}
                                <th className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider sticky top-0 bg-blue-300 z-30">
                                    PAGO (
                                    {months[selectedMonthIndex].toUpperCase()})
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {players.map((player, playerIndex) => (
                                <tr
                                    key={player.id}
                                    className="hover:bg-gray-50"
                                >
                                    {isEditor && (
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 sticky left-0 bg-white z-10 w-16">
                                            <div className="flex flex-col space-y-1">
                                                <button
                                                    onClick={() =>
                                                        handleUpdatePlayerName(
                                                            player.id,
                                                            player.name
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100"
                                                    title="Editar nombre del jugador"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeletePlayer(
                                                            player.id,
                                                            player.name
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                                                    title="Eliminar jugador"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                    <td
                                        className={`${
                                            isEditor ? "pl-5 pr-5" : "pl-5 pr-5"
                                        } py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky bg-white hover:bg-gray-50 z-20 left-0`}
                                    >
                                        {player.name}
                                    </td>

                                    {trainingDates.map(
                                        (training, dateIndex) => {
                                            const isSuspended =
                                                training.is_suspended;
                                            const attendanceValue =
                                                player.attendance[dateIndex];

                                            return (
                                                <td
                                                    key={dateIndex}
                                                    className={`px-6 py-4 whitespace-nowrap text-sm text-center ${
                                                        isSuspended
                                                            ? "bg-gray-200"
                                                            : ""
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
                                                        <AttendanceStatusButton
                                                            status={
                                                                attendanceValue ||
                                                                "absent"
                                                            }
                                                            onStatusChange={(
                                                                newStatus
                                                            ) =>
                                                                handleAttendanceChange(
                                                                    player.id,
                                                                    dateIndex,
                                                                    newStatus
                                                                )
                                                            }
                                                            disabled={!isEditor}
                                                        />
                                                    )}
                                                </td>
                                            );
                                        }
                                    )}

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        <div className="flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={player.paid}
                                                onChange={() =>
                                                    handlePaymentChange(
                                                        player.id
                                                    )
                                                }
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
                                                {player.paid
                                                    ? "Pagado"
                                                    : "No Pago"}
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
