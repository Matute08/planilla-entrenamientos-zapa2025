import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "./navbar";

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbygckn2NLCu0z7XvSbi1HtqOWdfdxX7QzhkwypKc20FEP4rr4Tcj9rvugrZHQTBpfQ2/exec"; // Pega tu URL /exec aquí

// Meses del año en español (debe coincidir con Apps Script y nombres de hojas)
const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    //'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Componente principal de la aplicación
function PlanillaMasculino() {
    // --- Estados ---
    const [players, setPlayers] = useState([]); // Inicia vacío, se cargará desde el script
    const [trainingDates, setTrainingDates] = useState([]); // Inicia vacío
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(
        new Date().getMonth()
    ); // Inicia con el mes actual
    const [loading, setLoading] = useState(false); // Estado de carga
    const [error, setError] = useState(null); // Estado de error
    const [message, setMessage] = useState(""); // Mensajes de feedback

    // --- Función para obtener datos del mes ---
    const fetchData = useCallback(async (monthIndex) => {
        if (!SCRIPT_URL || SCRIPT_URL === "URL_DE_TU_APPS_SCRIPT_AQUI") {
            setError(
                "Error: La URL de Google Apps Script no está configurada en el código React."
            );
            setLoading(false);
            setPlayers([]);
            setTrainingDates([]);
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(""); // Limpiar mensajes anteriores
        setPlayers([]); // Limpiar datos mientras carga
        setTrainingDates([]);

        try {
            // Construye la URL con el parámetro monthIndex
            const url = `${SCRIPT_URL}?monthIndex=${monthIndex}`;
            const response = await fetch(url);

            if (!response.ok) {
                let errorMsg = `Error ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg; // Usa el mensaje del script si existe
                } catch {
                    // No se pudo parsear el error json, usa el statusText
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(
                    data.message || "Error desconocido desde Apps Script."
                );
            }

            // Verifica que los datos recibidos tengan la estructura esperada
            if (
                data &&
                Array.isArray(data.players) &&
                Array.isArray(data.trainingDates)
            ) {
                setPlayers(data.players);
                setTrainingDates(data.trainingDates);
            } else {
                console.error("Respuesta inesperada del script:", data);
                throw new Error(
                    "Formato de datos inesperado recibido del servidor."
                );
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(`En el mes ${months[monthIndex]} no hubo entrenamientos`);
            setPlayers([]); // Asegurar que no queden datos viejos en caso de error
            setTrainingDates([]);
        } finally {
            setLoading(false);
        }
    }, []); // useCallback sin dependencias externas directas (SCRIPT_URL es constante)

    // --- Efecto para cargar datos al inicio y al cambiar mes ---
    useEffect(() => {
        fetchData(selectedMonthIndex);
    }, [selectedMonthIndex, fetchData]); // Depende de selectedMonthIndex y la función fetchData

    // --- Función genérica para enviar actualizaciones al script ---
    const updateData = async (payload) => {
        if (!SCRIPT_URL || SCRIPT_URL === "URL_DE_TU_APPS_SCRIPT_AQUI") {
            setError(
                "Error: La URL de Google Apps Script no está configurada."
            );
            return false; // Indica que no se pudo enviar
        }
        setMessage("Guardando..."); // Mensaje de guardando
        setError(null); // Limpiar error anterior

        try {
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                // Apps Script espera los datos como string en e.postData.contents
                // No se usa 'Content-Type': 'application/json' directamente con el redirect
                // body: JSON.stringify(payload) // Esto puede no funcionar con el modo de implementación estándar
                // Alternativa: Crear un objeto FormData (más compatible con Apps Script doPost simple)
                redirect: "follow", // Necesario para que Apps Script maneje POST correctamente
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "text/plain;charset=utf-8", // Apps Script prefiere text/plain para postData.contents
                },
            });

            if (!response.ok) {
                let errorMsg = `Error ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch {
                    // No se pudo parsear el error JSON, se usa el statusText.
                }
                throw new Error(errorMsg);
            }

            const result = await response.json();

            if (result.error) {
                throw new Error(
                    result.message || "Error desconocido al guardar."
                );
            }

            showMessage("Cambio guardado con éxito.");
            return true; // Éxito
        } catch (err) {
            console.error("Error updating data:", err);
            setError(`Error al guardar: ${err.message}`);
            showMessage(""); // Limpiar mensaje de "Guardando..."
            return false; // Falla
        }
    };

    // --- Manejadores de cambios (ahora llaman a updateData) ---

    const handleAttendanceChange = async (playerId, dateIndex) => {
        // 1. Actualización optimista (opcional pero mejora UX)
        const originalPlayers = [...players]; // Copia por si falla la actualización
        setPlayers((prevPlayers) =>
            prevPlayers.map((player) => {
                if (player.id === playerId) {
                    const newAttendance = [...player.attendance];
                    newAttendance[dateIndex] = !newAttendance[dateIndex];
                    return { ...player, attendance: newAttendance };
                }
                return player;
            })
        );

        // 2. Enviar actualización al backend
        const player = originalPlayers.find((p) => p.id === playerId);
        if (!player) return; // Seguridad
        const newValue = !player.attendance[dateIndex]; // El nuevo valor que se quiere guardar

        const success = await updateData({
            action: "attendance",
            playerId: playerId,
            monthIndex: selectedMonthIndex,
            dateIndex: dateIndex, // Índice basado en 0 del array de fechas
            value: newValue,
        });

        // 3. Revertir si falla (si se hizo actualización optimista)
        if (!success) {
            showMessage("Error al guardar, revirtiendo cambio local.");
            setPlayers(originalPlayers); // Restaura el estado original
        }
    };

    const handlePaymentChange = async (playerId) => {
        // 1. Actualización optimista
        const originalPlayers = [...players];
        setPlayers((prevPlayers) =>
            prevPlayers.map((player) => {
                if (player.id === playerId) {
                    return { ...player, paid: !player.paid };
                }
                return player;
            })
        );

        // 2. Enviar actualización al backend
        const player = originalPlayers.find((p) => p.id === playerId);
        if (!player) return;
        const newValue = !player.paid;

        const success = await updateData({
            action: "payment",
            playerId: playerId,
            monthIndex: selectedMonthIndex,
            value: newValue,
            // dateIndex no es necesario para 'payment'
        });

        // 3. Revertir si falla
        if (!success) {
            showMessage("Error al guardar, revirtiendo cambio local.");
            setPlayers(originalPlayers);
        }
    };

    // Manejar cambio en el selector de mes
    const handleMonthChange = (event) => {
        const newMonthIndex = parseInt(event.target.value, 10);
        setSelectedMonthIndex(newMonthIndex);
        // fetchData se llamará automáticamente por el useEffect
    };

    // Función para mostrar mensajes temporales
    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            // Solo limpia si el mensaje sigue siendo el mismo (evita sobreescribir mensajes nuevos)
            setMessage((prev) => (prev === msg ? "" : prev));
        }, 3000);
    };

    // --- Renderizado del componente ---
    return (
        <div className="flex flex-col h-screen fondo font-sans ">
            <header className="text-white py-3 flex flex-col items-center px-4">
                <div className="bg-black text-white text-start py-2 w-full">
                    <Navbar></Navbar>
                </div>
                <h1 className="text-3xl font-bold text-center mt-4 ">
                    Asistencias Masculino
                </h1>
            </header>

            <main className="flex-grow overflow-auto p-4">
                {/* Selector de Mes */}
                <div className="mb-6 flex justify-center items-center space-x-2">
                    <label
                        htmlFor="month-select"
                        className="text-xl font-medium text-white"
                    >
                        Mes:
                    </label>
                    <select
                        id="month-select"
                        value={selectedMonthIndex}
                        onChange={handleMonthChange}
                        disabled={loading}
                        className="text-lg mt-1 block w-auto pl-3 pr-10 py-2 border-gray-600 focus:outline-none focus:border-blue-500 sm:text-lg rounded-md shadow-sm disabled:bg-gray-200 text-black bg-white"
                    >
                        {months.map((month, index) => (
                            <option key={index} value={index}>
                                {month}
                            </option>
                        ))}
                    </select>
                    <span className="text-xl font-semibold text-white">
                        {new Date().getFullYear()}
                    </span>
                </div>

                {/* Indicador de Carga */}
                {loading && (
                    <div className="text-center p-4 text-xl text-white">
                        <svg
                            className="animate-spin h-6 w-6 inline-block mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Cargando datos de {months[selectedMonthIndex]}...
                    </div>
                )}

                {/* Mensaje de Error */}
                {error && (
                    <div className="mb-4 p-3 rounded-md bg-red-100 text-white text-center shadow">
                        <strong>{error}</strong>
                    </div>
                )}

                {/* Mensaje de Feedback */}
                {message && !error && (
                    <div className="mb-4 p-3 rounded-md bg-green-100 text-green-700 text-center shadow transition-opacity duration-300">
                        {message}
                    </div>
                )}

                {/* Título dinámico indicando el mes */}
                {!loading && !error && (
                    <h2 className="text-3xl font-semibold mb-4 text-center text-white">
                        Registro de {months[selectedMonthIndex]}
                    </h2>
                )}

                {/* Tabla de asistencias */}
                {!loading && !error && (
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3  text-xs font-bold text-black  uppercase tracking-wider sticky left-0 bg-gray-50 z-10"
                                    >
                                         Jugador
                                    </th>
                                    {trainingDates.map((date, index) => (
                                        <th
                                            key={index}
                                            scope="col"
                                            className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider "
                                        >
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
                                        </th>
                                    ))}
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider"
                                    >
                                        Pago ({months[selectedMonthIndex]})
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-700">
                                {players.map((player) => (
                                    <tr
                                        key={player.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white hover:bg-gray-50 z-10">
                                            {player.name}
                                        </td>
                                        {trainingDates.map((_, dateIndex) => (
                                            <td
                                                key={dateIndex}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        player.attendance[
                                                            dateIndex
                                                        ] || false
                                                    }
                                                    onChange={() =>
                                                        handleAttendanceChange(
                                                            player.id,
                                                            dateIndex
                                                        )
                                                    }
                                                    className="form-checkbox h-5 w-5 text-blue-600 rounded cursor-pointer focus:ring-blue-500"
                                                    aria-label={`Asistencia de ${player.name} para ${trainingDates[dateIndex]}`}
                                                />
                                            </td>
                                        ))}
                                        <td className="flex items-center justify-center px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            <input
                                                type="checkbox"
                                                checked={player.paid}
                                                onChange={() =>
                                                    handlePaymentChange(
                                                        player.id
                                                    )
                                                }
                                                className="form-checkbox h-5 w-5 text-green-600 rounded cursor-pointer focus:ring-green-500"
                                                aria-label={`Pago de ${player.name} para ${months[selectedMonthIndex]}`}
                                            />
                                            <span
                                                className={`ml-2 text-xs font-semibold  ${
                                                    player.paid
                                                        ? "text-green-700"
                                                        : "text-red-700"
                                                }`}
                                            >
                                                {player.paid
                                                    ? "Pagado"
                                                    : "No Pago"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {players.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={trainingDates.length + 2}
                                            className="px-6 py-4 text-center text-white"
                                        >
                                            No hay jugadores para mostrar en{" "}
                                            {months[selectedMonthIndex]}.
                                            Verifica la hoja de cálculo o
                                            selecciona otro mes.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <footer className="bg-black text-white text-center py-2">
                <p className="text-sm">
                    © {new Date().getFullYear()} Planilla de Asistencias
                    Zapataye
                </p>
            </footer>
        </div>
    );
}

export default PlanillaMasculino;
