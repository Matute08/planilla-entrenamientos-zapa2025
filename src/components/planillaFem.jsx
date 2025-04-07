import React, { useState, useEffect, useCallback } from "react";
// Importa los componentes hijos
import Navbar from "./navbar";
import Controls from "./controls";
import FeedbackMessages from "./feedbackMessages";
import LoadingIndicators from "./loadingIndicators";
import RankingSection from "./rankingSection";
import PaymentStatusSection from "./paymentStatusSection";
import MonthlyAttendanceTable from "./monthlyAttendanceTable";
import Footer from "./footer";

// --- Constantes ---
// URL de tu Google Apps Script
const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyWk-m7Rj757Ko-kxkG9EwpXDRM7pQwX72L-H4emA_zfZ_PGqXqzWN8SRndtFd4D9gHig/exec";
// Meses (puedes mover esto a un archivo de constantes si prefieres)
const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio" /* ...otros meses */,
];

// --- Componente Principal ---
function PlanillaFemenino() {
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
    
        const fetchData = useCallback(async (monthIndex) => {
            if (!SCRIPT_URL || SCRIPT_URL === "URL_DE_TU_APPS_SCRIPT_AQUI") {
                setError(
                    "Error: La URL de Google Apps Script no está configurada."
                );
                setLoading(false);
                setPlayers([]);
                setTrainingDates([]);
                return;
            }
            setLoading(true);
            setError(null);
            setMessage("");
            setPlayers([]);
            setTrainingDates([]);
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
                    throw new Error(
                        data.message || "Error desconocido desde Apps Script."
                    );
                }
                if (
                    data &&
                    Array.isArray(data.players) &&
                    Array.isArray(data.trainingDates) &&
                    Array.isArray(data.suspendedDates)
                ) {
                    setPlayers(data.players);
                    setTrainingDates(data.trainingDates);
                    setSuspendedDates(data.suspendedDates); // Guarda el array de booleanos de suspensión
                } else {
                    console.error("Respuesta inesperada (mensual):", data);
                    throw new Error("Formato de datos mensual inesperado.");
                }
            } catch (err) {
                console.error("Error fetching monthly data:", err);
                setError(
                    `Error al cargar datos para ${months[monthIndex]}: ${err.message}`
                );
                setPlayers([]);
                setTrainingDates([]);
                setSuspendedDates([]); 
            } finally {
                setLoading(false);
            }
        }, []); 
    
        const fetchRankingData = useCallback(async () => {
            if (!SCRIPT_URL || SCRIPT_URL === "URL_DE_TU_APPS_SCRIPT_AQUI") {
                setRankingError(
                    "Error: La URL de Google Apps Script no está configurada."
                );
                return;
            }
            setLoadingRanking(true);
            setRankingError(null);
            setRankingData(null);
            setMessage("");
            setShowPaymentStatus(false);
            setPaymentStatusError(null);
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
                    throw new Error(
                        data.message || "Error desconocido al obtener ranking."
                    );
                }
                if (data && Array.isArray(data.ranking)) {
                    setRankingData(data.ranking);
                    setShowRanking(true);
                } else {
                    console.error("Respuesta inesperada (ranking):", data);
                    throw new Error("Formato de datos de ranking inesperado.");
                }
            } catch (err) {
                console.error("Error fetching ranking data:", err);
                setRankingError(`Error al cargar el ranking: ${err.message}`);
                setShowRanking(false);
            } finally {
                setLoadingRanking(false);
            }
        }, []); 
    
        const fetchPaymentStatusData = useCallback(async () => {
            if (!SCRIPT_URL || SCRIPT_URL === "URL_DE_TU_APPS_SCRIPT_AQUI") {
                setPaymentStatusError(
                    "Error: La URL de Google Apps Script no está configurada."
                );
                return;
            }
            setLoadingPaymentStatus(true);
            setPaymentStatusError(null);
            setPaymentStatusData(null);
            setMessage("");
            setShowRanking(false);
            setRankingError(null);
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
                    throw new Error(
                        data.message ||
                            "Error desconocido al obtener estado de pagos."
                    );
                }
                if (data && Array.isArray(data.paymentStatus)) {
                    setPaymentStatusData(data.paymentStatus);
                    setShowPaymentStatus(true);
                } else {
                    console.error("Respuesta inesperada (pagos):", data);
                    throw new Error(
                        "Formato de datos de estado de pago inesperado."
                    );
                }
            } catch (err) {
                console.error("Error fetching payment status data:", err);
                setPaymentStatusError(
                    `Error al cargar estado de pagos: ${err.message}`
                );
                setShowPaymentStatus(false);
            } finally {
                setLoadingPaymentStatus(false);
            }
        }, []); // No necesita dependencias externas
    
        useEffect(() => {
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
    
        const updateData = useCallback(async (payload) => {
            if (!SCRIPT_URL || SCRIPT_URL === "URL_DE_TU_APPS_SCRIPT_AQUI") {
                setError(
                    "Error: La URL de Google Apps Script no está configurada."
                );
                return false;
            }
            setMessage("Guardando...");
            setError(null);
            let specificLoadingSetter = null;
            if (payload.action === 'toggleSuspended') specificLoadingSetter = setLoading; // Reusa loading general o crea uno nuevo
    
            if (specificLoadingSetter) specificLoadingSetter(true);
            try {
                const response = await fetch(SCRIPT_URL, {
                    method: "POST",
                    redirect: "follow",
                    body: JSON.stringify(payload),
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
                    throw new Error(
                        result.message || "Error desconocido al guardar."
                    );
                }
                //Si la acción fue toggleSuspended, el script devuelve los datos actualizados del mes
                if (payload.action === 'toggleSuspended' && result && Array.isArray(result.players) && Array.isArray(result.trainingDates) && Array.isArray(result.suspendedDates)) {
                    setPlayers(result.players);
                    setTrainingDates(result.trainingDates);
                    setSuspendedDates(result.suspendedDates);
                    showMessage("Estado de suspensión actualizado."); // Mensaje específico
                    return true; // Indica éxito
                } else if (payload.action === 'attendance' || payload.action === 'payment') {
                    // Éxito para acciones normales
                    showMessage("Cambio guardado con éxito.");
                    return true; // Indica éxito
                } else {
                    // Respuesta inesperada para toggleSuspended
                    throw new Error("Respuesta inesperada del servidor al cambiar suspensión.");
                }
                
            } catch (err) {
                console.error("Error updating data:", err);
                // Muestra el error específico de la acción si es posible
                if (payload.action === 'toggleSuspended') {
                    setError(`Error al cambiar suspensión: ${err.message}`); // O un estado de error específico
                } else {
                    setError(`Error al guardar (${payload.action}): ${err.message}`);
                }
                showMessage(''); // Limpia mensaje de éxito/guardando
                return false; // Indica fallo
            } finally {
                if (specificLoadingSetter) specificLoadingSetter(false);
            }
        }, []); // No necesita dependencias externas
    
        // --- Manejadores de Eventos (se mantienen aquí y se pasan como props) ---
        const handleAttendanceChange = useCallback(
            async (playerId, dateIndex) => {
                if (suspendedDates[dateIndex]) {
                showMessage("No se puede cambiar la asistencia en un día suspendido.");
                return;
                }
    
                const originalPlayers = players.map((p) => ({
                    ...p,
                    attendance: [...p.attendance],
                }));
                setPlayers((prevPlayers) =>
                    prevPlayers.map((player) =>
                        player.id === playerId
                            ? {
                                  ...player,
                                  attendance: player.attendance.map((att, idx) =>
                                      idx === dateIndex ? !att : att
                                  ),
                              }
                            : player
                    )
                );
                const player = originalPlayers.find((p) => p.id === playerId);
                if (!player) return;
                const newValue = !player.attendance[dateIndex];
                const success = await updateData({
                    action: "attendance",
                    playerId: playerId,
                    monthIndex: selectedMonthIndex,
                    dateIndex: dateIndex,
                    value: newValue,
                });
                if (!success) {
                    showMessage(
                        "Error al guardar asistencia, revirtiendo cambio local."
                    );
                    setPlayers(originalPlayers);
                }
            },
            [players, updateData, selectedMonthIndex, suspendedDates]
        ); 
    
        const handleToggleSuspended = useCallback(async (dateIndex) => {
            // Nota: No hacemos actualización optimista compleja aquí porque el script
            // devuelve todos los datos actualizados (incluyendo players y suspendedDates).
            // Simplemente llamamos a updateData.
            await updateData({
                action: 'toggleSuspended',
                monthIndex: selectedMonthIndex,
                dateIndex: dateIndex
            });
            // El estado se actualizará si la llamada a updateData tiene éxito
            // y procesa la respuesta correctamente.
    
        }, [selectedMonthIndex, updateData]); // Depende del mes y la función de update
    
    
        const handlePaymentChange = useCallback(
            async (playerId) => {
                const originalPlayers = players.map((p) => ({ ...p }));
                setPlayers((prevPlayers) =>
                    prevPlayers.map((player) =>
                        player.id === playerId
                            ? { ...player, paid: !player.paid }
                            : player
                    )
                );
                const player = originalPlayers.find((p) => p.id === playerId);
                if (!player) return;
                const newValue = !player.paid;
                const success = await updateData({
                    action: "payment",
                    playerId: playerId,
                    monthIndex: selectedMonthIndex,
                    value: newValue,
                });
                if (!success) {
                    showMessage("Error al guardar pago, revirtiendo cambio local.");
                    setPlayers(originalPlayers);
                }
            },
            [players, updateData, selectedMonthIndex]
        ); // Depende de players, updateData, selectedMonthIndex
    
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
    
        const showMessage = (msg) => {
            setMessage(msg);
            setTimeout(() => {
                setMessage((prev) => (prev === msg ? "" : prev));
            }, 3000);
        };
    
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
                    <Navbar />{" "}
                </div>
                <h1 className="text-3xl font-bold text-center mt-4 ">
                    {" "}
                    Asistencias Femenino{" "}
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
                    months={months}
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
                    months={months}
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
                            suspendedDates={suspendedDates}
                            handleToggleSuspended={handleToggleSuspended}
                            trainingDates={trainingDates}
                            selectedMonthIndex={selectedMonthIndex}
                            months={months}
                            handleAttendanceChange={handleAttendanceChange}
                            handlePaymentChange={handlePaymentChange} 
                        />
                    )}
            </main>

            {/* Componente Footer */}
            <Footer />
        </div>
    );
}

// Exportación del componente principal
export default PlanillaFemenino;
