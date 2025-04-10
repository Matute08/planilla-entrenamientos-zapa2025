import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./navbar"; // Importa el componente de navegación
import Swal from "sweetalert2"; // Importa SweetAlert2 para mostrar alertas
import Controls from "./controls";
import FeedbackMessages from "./feedbackMessages";
import LoadingIndicators from "./loadingIndicators";
import RankingSection from "./rankingSection";
import PaymentStatusSection from "./paymentStatusSection";
import MonthlyAttendanceTable from "./monthlyAttendanceTable";
import Footer from "./footer";
import SpinnerIcon from "./spinnerIcon";

// --- Constantes ---
// URL de tu Google Apps Script
const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbygckn2NLCu0z7XvSbi1HtqOWdfdxX7QzhkwypKc20FEP4rr4Tcj9rvugrZHQTBpfQ2/exec";
// Meses (puedes mover esto a un archivo de constantes si prefieres)
const ALL_MONTH_NAMES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre"  /* ...otros meses */,
];

// --- Componente Principal ---
function PlanillaMasculino() {
    const [players, setPlayers] = useState([]);
    const [trainingDates, setTrainingDates] = useState([]);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(
        new Date().getMonth()
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [rankingData, setRankingData] = useState(null);
    const [showRanking, setShowRanking] = useState(false);
    const [loadingRanking, setLoadingRanking] = useState(false);
    const [rankingError, setRankingError] = useState(null);
    const [paymentStatusData, setPaymentStatusData] = useState(null);
    const [showPaymentStatus, setShowPaymentStatus] = useState(false);
    const [loadingPaymentStatus, setLoadingPaymentStatus] = useState(false);
    const [paymentStatusError, setPaymentStatusError] = useState(null);
    const [suspendedDates, setSuspendedDates] = useState([]);
    // Derivar los meses disponibles para el dropdown
    const currentActualMonthIndex = new Date().getMonth(); // 0-11
    // Crea un nuevo array con los meses desde Enero hasta el mes actual inclusive
    const availableMonths = ALL_MONTH_NAMES.slice(0, currentActualMonthIndex + 1);

    // --- Funciones de Fetch (GET) ---
    const fetchData = useCallback(
        async (monthIndex, suppressLoading = false) => {
            // Limpia errores específicos al iniciar fetch
            setRankingError(null);
            setPaymentStatusError(null);
            if (!SCRIPT_URL || SCRIPT_URL === "URL_DE_TU_APPS_SCRIPT_AQUI") {
                Swal.fire("Error", "URL del script no configurada", "error");
                setLoading(false);
                setPlayers([]);
                setTrainingDates([]);
                setSuspendedDates([]);
                return;
            }
            if (!suppressLoading) setLoading(true);
            setMessage("");
            setPlayers([]);
            setTrainingDates([]);
            setSuspendedDates([]);
            try {
                const url = `${SCRIPT_URL}?monthIndex=${monthIndex}`;
                const response = await fetch(url);
                if (!response.ok) {
                    let errorMsg = `Error ${response.status}: ${response.statusText}`;
                    try {
                        const errorData = await response.json();
                        errorMsg = errorData.message || errorMsg;
                    } catch {
                        // Intentionally left empty
                    }
                    throw new Error(errorMsg);
                }
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.message || "Error desconocido.");
                }
                if (
                    data &&
                    Array.isArray(data.players) &&
                    Array.isArray(data.trainingDates) &&
                    Array.isArray(data.suspendedDates)
                ) {
                    setPlayers(data.players);
                    setTrainingDates(data.trainingDates);
                    setSuspendedDates(data.suspendedDates);
                } else {
                    console.error("Respuesta inesperada (mensual):", data);
                    throw new Error("Formato datos mensual inesperado.");
                }
            } catch (err) {
                console.error("Error fetching monthly data:", err);
                // Muestra error con SweetAlert
                Swal.fire({
                    icon: "error",
                    title: "Error al cargar datos",
                    text: `Mes: ${ALL_MONTH_NAMES[monthIndex]}. Detalle: ${err.message}`,
                });
                setPlayers([]);
                setTrainingDates([]);
                setSuspendedDates([]);
            } finally {
                if (!suppressLoading) setLoading(false);
            }
        },
        []
    );

    // --- Función Genérica para Acciones (POST) ---
    const performAction = useCallback(
        async (action, payload, showLoadingAlert = false) => {
            // Renombrado showOverlay a showLoadingAlert
            if (!SCRIPT_URL || SCRIPT_URL === "URL_DE_TU_APPS_SCRIPT_AQUI") {
                Swal.fire("Error", "URL script no configurada", "error");
                return null;
            }

            // Muestra alerta de carga si es una acción pesada
            if (showLoadingAlert) {
                Swal.fire({
                    title: "Procesando...",
                    text: "Por favor espera.",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading(); // Muestra el icono de carga
                    },
                });
            }
            // Limpia errores específicos
            // setMessage(''); // No limpiar mensaje aquí para permitir "Guardando..." previo para acciones menores
            setRankingError(null);
            setPaymentStatusError(null);

            const fullPayload = {
                ...payload,
                action,
                monthIndex: selectedMonthIndex,
            };
            let success = false; // Variable para saber si la acción tuvo éxito
            let resultData = null; // Para guardar los datos de respuesta

            try {
                const response = await fetch(SCRIPT_URL, {
                    method: "POST",
                    redirect: "follow",
                    body: JSON.stringify(fullPayload),
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                });
                if (!response.ok) {
                    let errorMsg = `Error ${response.status}: ${response.statusText}`;
                    try {
                        const errorData = await response.json();
                        errorMsg = errorData.message || errorMsg;
                    } catch {
                        // Intentionally left empty
                    }
                    throw new Error(errorMsg);
                }
                const result = await response.json();
                if (result.error) {
                    throw new Error(result.message || `Error: ${action}`);
                }

                // Guarda el resultado y marca éxito
                resultData = result;
                success = true;

                // Actualiza estado local si el script devolvió datos (acciones pesadas y toggleSuspended)
                if (
                    result &&
                    Array.isArray(result.players) &&
                    Array.isArray(result.trainingDates) &&
                    Array.isArray(result.suspendedDates)
                ) {
                    setPlayers(result.players);
                    setTrainingDates(result.trainingDates);
                    setSuspendedDates(result.suspendedDates);
                } else if (
                    result.success &&
                    !["attendance", "payment"].includes(action)
                ) {
                    // Si solo devolvió éxito para una acción mayor (raro), refrescar por si acaso
                    fetchData(selectedMonthIndex, true);
                }
                // Para acciones menores (attendance, payment), la UI ya se actualizó optimistamente
            } catch (err) {
                console.error(`Error performing action ${action}:`, err);
                // Cierra el Swal de carga si estaba abierto ANTES de mostrar el error
                if (showLoadingAlert) {
                    Swal.close();
                }
                // Muestra error con SweetAlert
                Swal.fire({
                    icon: "error",
                    title: `Error al ${action}`,
                    text: "Ocurrió un error.",
                });
                return null; // Indica fallo
            } finally {
                // No necesitamos setLoadingAction(false)
            }

            // Si la acción fue exitosa
            if (success) {
                const successMessage = `Acción completada con éxito.`;
                if (showLoadingAlert) {
                    // Si mostramos alerta de carga, la cerramos y mostramos alerta de éxito
                    Swal.fire({
                        icon: "success",
                        title: successMessage,
                        timer: 1500, // Cierre automático
                        showConfirmButton: false,
                    });
                } else {
                    // Si fue acción menor, mostramos toast de éxito usando setMessage
                    setMessage(successMessage);
                }
                return resultData; // Devuelve resultado en éxito
            }
        },
        [selectedMonthIndex, fetchData]
    );

    const fetchRankingData = useCallback(async () => {
        // Limpia errores específicos
        setError(null);
        setPaymentStatusError(null);
        if (!SCRIPT_URL || SCRIPT_URL === "URL_DE_TU_APPS_SCRIPT_AQUI") {
            Swal.fire("Error", "URL del script no configurada", "error");
            return;
        }
        setLoadingRanking(true);
        setRankingError(null);
        setRankingData(null);
        setMessage("");
        setShowPaymentStatus(false);
        setPaymentStatusData(null);
        try {
            const url = `${SCRIPT_URL}?action=getRanking`;
            const response = await fetch(url);
            if (!response.ok) {
                let errorMsg = `Error ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch {
                    // Intentionally left empty
                }
                throw new Error(errorMsg);
            }
            const data = await response.json();
            if (data.error) {
                throw new Error("Error al obtener ranking.");
            }
            if (data && Array.isArray(data.ranking)) {
                setRankingData(data.ranking);
                setShowRanking(true);
            } else {
                console.error("Respuesta inesperada (ranking):", data);
                throw new Error("Formato datos ranking inesperado.");
            }
        } catch (err) {
            console.error("Error fetching ranking data:", err);
            setRankingError(`Error al cargar ranking: ${err.message}`); // Guarda error específico
            Swal.fire(
                "Error",
                `No se pudo cargar el ranking: ${err.message}`,
                "error"
            ); // Muestra alerta
            setShowRanking(false);
        } finally {
            setLoadingRanking(false);
        }
    }, []);

    const fetchPaymentStatusData = useCallback(async () => {
        // Limpia errores específicos
        setError(null);
        setRankingError(null);
        if (!SCRIPT_URL || SCRIPT_URL === "URL_DE_TU_APPS_SCRIPT_AQUI") {
            Swal.fire("Error", "URL del script no configurada", "error");
            return;
        }
        setLoadingPaymentStatus(true);
        setPaymentStatusError(null);
        setPaymentStatusData(null);
        setMessage("");
        setShowRanking(false);
        setRankingData(null);
        try {
            const url = `${SCRIPT_URL}?action=getPaymentStatus`;
            const response = await fetch(url);
            if (!response.ok) {
                let errorMsg = `Error ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch {
                    // Intentionally left empty
                }
                throw new Error(errorMsg);
            }
            const data = await response.json();
            if (data.error) {
                throw new Error("Error al obtener pagos.");
            }
            if (data && Array.isArray(data.paymentStatus)) {
                setPaymentStatusData(data.paymentStatus);
                setShowPaymentStatus(true);
            } else {
                console.error("Respuesta inesperada (pagos):", data);
                throw new Error("Formato datos pagos inesperado.");
            }
        } catch (err) {
            console.error("Error fetching payment status data:", err);
            setPaymentStatusError(`Error al cargar pagos: ${err.message}`); // Guarda error específico
            Swal.fire(
                "Error",
                `No se pudo cargar el estado de pagos: ${err.message}`,
                "error"
            ); // Muestra alerta
            setShowPaymentStatus(false);
        } finally {
            setLoadingPaymentStatus(false);
        }
    }, []);

    // --- Efecto para cargar datos mensuales iniciales ---
    useEffect(() => {
        // Carga inicial o al cambiar de mes si no hay secciones especiales activas/cargando
        if (
            !showRanking &&
            !showPaymentStatus &&
            !loadingRanking &&
            !loadingPaymentStatus
        ) {
            fetchData(selectedMonthIndex);
        }
    }, [
        selectedMonthIndex,
        fetchData,
        showRanking,
        showPaymentStatus,
        loadingRanking,
        loadingPaymentStatus,
    ]);

    // --- Manejadores de Eventos (se mantienen aquí y se pasan como props) ---

    const handleAttendanceChange = useCallback(
        async (playerId, dateIndex) => {
            if (suspendedDates[dateIndex]) {
                setMessage("Día suspendido.");
                return;
            }
            const originalPlayers = players.map((p) => ({
                ...p,
                attendance: [...p.attendance],
            }));
            const playerIndex = originalPlayers.findIndex(
                (p) => p.id === playerId
            );
            if (playerIndex === -1) return;
            const previousValue =
                originalPlayers[playerIndex].attendance[dateIndex];
            const newValue =
                typeof previousValue === "boolean" ? !previousValue : true;
            setPlayers((prevPlayers) =>
                prevPlayers.map((p) =>
                    p.id === playerId
                        ? {
                              ...p,
                              attendance: p.attendance.map((att, idx) =>
                                  idx === dateIndex ? newValue : att
                              ),
                          }
                        : p
                )
            );
            setMessage("Guardando asistencia..."); // Para toast
            const successResult = await performAction(
                "attendance",
                { playerId, dateIndex, value: newValue },
                false
            ); // false = no alert de carga
            if (successResult === null) {
                console.log("Reverting attendance");
                setMessage("");
                setPlayers(originalPlayers);
            }
        },
        [players, performAction, suspendedDates]
    );

    const handleAddTrainingDate = useCallback(async () => {
        const { value: dateValue } = await Swal.fire({
            title: `Agregar Entrenamiento (${ALL_MONTH_NAMES[selectedMonthIndex]})`,
            // Usa el input tipo 'date' del navegador
            input: "date",
            inputLabel: "Seleccione la fecha",
            // Podrías limitar las fechas al mes actual si quisieras con min/max
            // inputAttributes: {
            //     min: '2024-05-01', // Ejemplo: Primero de mayo
            //     max: '2024-05-31'  // Ejemplo: Último de mayo
            // },
            showCancelButton: true,
            confirmButtonText: "Agregar Fecha",
            cancelButtonText: "Cancelar",
            inputValidator: (value) => {
                if (!value) {
                    return "¡Necesita seleccionar una fecha!";
                }
                // Validación opcional: Asegurar que la fecha pertenezca al mes seleccionado
                const selectedDate = new Date(value + "T00:00:00"); // Asegura parseo correcto
                if (selectedDate.getMonth() !== selectedMonthIndex) {
                    return `La fecha debe pertenecer a ${ALL_MONTH_NAMES[selectedMonthIndex]}`;
                }
                // Validación opcional: Asegurar que no sea una fecha futura (si se requiere)
                // const today = new Date(); today.setHours(0,0,0,0);
                // if (selectedDate > today) {
                //     return 'No puede seleccionar una fecha futura.';
                // }
                // Validación opcional: Asegurar que no exista ya (requiere leer trainingDates)
                if (trainingDates.includes(value)) {
                    return "Esta fecha ya existe.";
                }
            },
        });

        // Si el usuario ingresó una fecha válida y confirmó
        if (dateValue) {
            // Llama a performAction con la nueva acción y la fecha en formato YYYY-MM-DD
            await performAction(
                "addTrainingDate",
                { newDateString: dateValue },
                true
            ); // true para alerta de carga
        }
    }, [performAction, selectedMonthIndex, trainingDates]);

    const handleDeleteTrainingDate = useCallback(async () => {
        if (!trainingDates || trainingDates.length === 0) {
            Swal.fire('Info', 'No hay fechas de entrenamiento para eliminar en este mes.', 'info');
            return;
        }

        // Crear opciones para el select de Swal
        const dateOptions = {};
        trainingDates.forEach(dateYYYYMMDD => {
            try {
                // Muestra DD/MM al usuario, pero el valor interno es YYYY-MM-DD
                const displayDate = new Date(dateYYYYMMDD + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
                dateOptions[dateYYYYMMDD] = displayDate; // key: YYYY-MM-DD, value: DD/MM
            } catch {
                 dateOptions[dateYYYYMMDD] = dateYYYYMMDD; // Fallback si falla el formato
            }
        });

        const { value: dateToDelete } = await Swal.fire({
            title: `Eliminar Entrenamiento (${ALL_MONTH_NAMES[selectedMonthIndex]})`,
            input: 'select',
            inputOptions: dateOptions,
            inputPlaceholder: 'Seleccione una fecha',
            showCancelButton: true,
            confirmButtonText: 'Eliminar Fecha',
            confirmButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return '¡Necesita seleccionar una fecha para eliminar!'
                }
            }
        });

        if (dateToDelete) { // dateToDelete será el valor YYYY-MM-DD seleccionado
            await performAction('deleteTrainingDate', { dateToDeleteString: dateToDelete }, true); // true para alerta de carga
        }
    }, [performAction, selectedMonthIndex, trainingDates]); 

    const handleToggleSuspended = useCallback(
        async (dateIndex) => {
            const originalSuspendedDates = [...suspendedDates];
            const originalPlayers = players.map((p) => ({
                ...p,
                attendance: [...p.attendance],
            }));
            const newSuspendedState = !originalSuspendedDates[dateIndex];
            setSuspendedDates((prevDates) =>
                prevDates.map((suspended, idx) =>
                    idx === dateIndex ? !suspended : suspended
                )
            );
            setPlayers((prevPlayers) =>
                prevPlayers.map((player) => ({
                    ...player,
                    attendance: player.attendance.map((att, idx) =>
                        idx === dateIndex && newSuspendedState
                            ? "suspended"
                            : idx === dateIndex && !newSuspendedState
                            ? originalPlayers.find((op) => op.id === player.id)
                                  ?.attendance[idx] ?? false
                            : att
                    ),
                }))
            );
            setMessage("Actualizando suspensión..."); // Para toast
            const successResult = await performAction(
                "toggleSuspended",
                { dateIndex },
                false
            ); // false = no alert de carga
            if (successResult === null) {
                console.log("Reverting suspension");
                setMessage("");
                setSuspendedDates(originalSuspendedDates);
                setPlayers(originalPlayers);
            }
        },
        [suspendedDates, players, performAction]
    );

    const handlePaymentChange = useCallback(
        async (playerId) => {
            const originalPlayers = players.map((p) => ({ ...p }));
            const playerIndex = originalPlayers.findIndex(
                (p) => p.id === playerId
            );
            if (playerIndex === -1) return;
            const newValue = !originalPlayers[playerIndex].paid;
            setPlayers((prevPlayers) =>
                prevPlayers.map((p) =>
                    p.id === playerId ? { ...p, paid: newValue } : p
                )
            );
            setMessage("Guardando pago..."); // Para toast
            const successResult = await performAction(
                "payment",
                { playerId, value: newValue },
                false
            ); // false = no alert de carga
            if (successResult === null) {
                console.log("Reverting payment");
                setMessage("");
                setPlayers(originalPlayers);
            }
        },
        [players, performAction]
    );

    const handleMonthChange = (event) => {
        const newMonthIndex = parseInt(event.target.value, 10);
        setSelectedMonthIndex(newMonthIndex);
        setShowRanking(false);
        setRankingError(null);
        setRankingData(null);
        setShowPaymentStatus(false);
        setPaymentStatusError(null);
        setPaymentStatusData(null);
    };
    // --- Manejadores para Acciones de Jugador (Usan SweetAlert) ---
    const handleAddPlayer = useCallback(async () => {
        const { value: playerName } = await Swal.fire({
            title: "Agregar Jugador",
            input: "text",
            inputLabel: "Nombre",
            showCancelButton: true,
            confirmButtonText: "Agregar",
            cancelButtonText: "Cancelar",
            inputValidator: (v) =>
                !v || !v.trim() ? "Escriba un nombre" : null,
        });
        if (playerName) {
            await performAction(
                "addPlayer",
                { playerName: playerName.trim() },
                true
            ); // true = SÍ alert de carga
        }
    }, [performAction]);

    const handleDeletePlayer = useCallback(
        async (playerId, playerName) => {
            const result = await Swal.fire({
                title: "¿Seguro desea eliminar?",
                html: `¿Eliminar a <u><strong>${playerName}</strong></u>?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });
            if (result.isConfirmed) {
                await performAction("deletePlayer", { playerId }, true); // true = SÍ alert de carga
            }
        },
        [performAction]
    );

    const handleUpdatePlayerName = useCallback(
        async (playerId, currentName) => {
            const { value: newName } = await Swal.fire({
                title: "Editar Nombre",
                input: "text",
                inputLabel: `Nuevo nombre para ${currentName}`,
                inputValue: currentName,
                showCancelButton: true,
                confirmButtonText: "Guardar",
                cancelButtonText: "Cancelar",
                inputValidator: (v) =>
                    !v || !v.trim()
                        ? "Nombre vacío"
                        : v.trim() === currentName
                        ? "Nombre igual al actual"
                        : null,
            });
            if (newName && newName.trim() !== currentName) {
                await performAction(
                    "updatePlayerName",
                    { playerId, newName: newName.trim() },
                    true
                ); // true = SÍ alert de carga
            }
        },
        [performAction]
    );

    // Removed unused showMessage function

    const closeSpecialSections = () => {
        setShowRanking(false);
        setShowPaymentStatus(false);
        setRankingError(null);
        setPaymentStatusError(null);
        // fetchData(selectedMonthIndex); // Descomenta si quieres recargar mes al cerrar
    };

    // --- Renderizado Principal usando Componentes Hijos ---
    return (
        <div className="flex flex-col h-screen fondo font-sans ">
            {/* Header con Navbar y Título */}
            <header className="text-white py-3 flex flex-col items-center px-4">
                <div className="bg-black text-white text-start py-2 w-full">
                    {" "}
                    <Navbar
                        onAddPlayer={handleAddPlayer}
                        onAddTrainingDate={handleAddTrainingDate}
                        onDeleteTrainingDate={handleDeleteTrainingDate}
                    />{" "}
                </div>
                <h1 className="text-3xl font-bold text-center mt-4 ">
                    {" "}
                    Asistencias Masculino{" "}
                </h1>
            </header>

            {/* Contenido Principal */}
            <main className="flex-grow overflow-auto p-4">
                {/* Componente de Controles */}
                <Controls
                    selectedMonthIndex={selectedMonthIndex}
                    handleMonthChange={handleMonthChange}
                    fetchRankingData={fetchRankingData}
                    fetchPaymentStatusData={fetchPaymentStatusData}
                    loading={loading}
                    loadingRanking={loadingRanking}
                    loadingPaymentStatus={loadingPaymentStatus}
                    months={availableMonths}

                    //onAddPlayer={handleAddPlayer} // Pasa la función si el botón está en Controls
                />

                {/* Componente de Mensajes de Feedback */}
                <FeedbackMessages
                    message={message}
                    error={error}
                    rankingError={rankingError} // Pasa errores específicos si quieres mostrarlos aquí
                    paymentStatusError={paymentStatusError} // Pasa errores específicos
                />

                {/* Componente de Indicadores de Carga */}
                <LoadingIndicators
                    loading={loading}
                    loadingRanking={loadingRanking}
                    loadingPaymentStatus={loadingPaymentStatus}
                    selectedMonthIndex={selectedMonthIndex}
                    months={ALL_MONTH_NAMES}
                />

                {/* Componente de Ranking (Condicional) */}
                {showRanking && !loadingRanking && (
                    <RankingSection
                        rankingData={rankingData}
                        rankingError={rankingError} // Pasa el error específico
                        onClose={closeSpecialSections}
                    />
                )}

                {/* Componente de Estado de Pagos (Condicional) */}
                {showPaymentStatus && !loadingPaymentStatus && (
                    <PaymentStatusSection
                        paymentStatusData={paymentStatusData}
                        paymentStatusError={paymentStatusError} // Pasa el error específico
                        onClose={closeSpecialSections}
                    />
                )}

                {/* Componente de Tabla Mensual (Condicional) */}
                {!loading &&
                    !error &&
                    !showRanking &&
                    !showPaymentStatus &&
                    !loadingRanking &&
                    !loadingPaymentStatus && (
                        <MonthlyAttendanceTable
                            players={players}
                            trainingDates={trainingDates}
                            suspendedDates={suspendedDates}
                            selectedMonthIndex={selectedMonthIndex}
                            months={ALL_MONTH_NAMES}
                            handleAttendanceChange={handleAttendanceChange}
                            handlePaymentChange={handlePaymentChange}
                            handleToggleSuspended={handleToggleSuspended}
                            handleDeletePlayer={handleDeletePlayer}
                            handleUpdatePlayerName={handleUpdatePlayerName}
                        />
                    )}
            </main>

            {/* Componente Footer */}
            <Footer />
        </div>
    );
}

// Exportación del componente principal
export default PlanillaMasculino;
