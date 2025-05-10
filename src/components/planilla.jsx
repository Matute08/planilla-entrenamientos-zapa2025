import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate para redirección
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
import { useAuth } from "./authContext";
import UserDisplay from "./userDisplay";

import API_BASE_URL from "../api";

// --- Constantes ---
// URL de tu Google Apps Script
//const SCRIPT_URL =
//    "https://script.google.com/macros/s/AKfycbygckn2NLCu0z7XvSbi1HtqOWdfdxX7QzhkwypKc20FEP4rr4Tcj9rvugrZHQTBpfQ2/exec";

// URL de la API)
const SCRIPT_URL = API_BASE_URL;

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
  "Noviembre",
  "Diciembre",
];

// --- Componente Principal ---
function PlanillaMasculino() {
  const navigate = useNavigate(); // Hook para navegación

  const {
    isAuthenticated,
    isAuthorized,
    isGuest,
    userProfile,
    handleLogout,
    setShowLoginModal,
    isLoadingAuth,
  } = useAuth(); // Obtiene estado y token de AuthContext

  const logoutAndRedirect = () => {
    handleLogout(); // Llama a la función original del contexto
    navigate("/"); // Redirige a la página principal
  };

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
  const currentActualMonthIndex = new Date().getMonth();

  // Crea un nuevo array con los meses desde Enero hasta el mes actual inclusive
  const availableMonths = ALL_MONTH_NAMES.slice(0, currentActualMonthIndex + 1);

  // --- Funciones de Fetch (GET) ---
  const fetchData = useCallback(async (monthIndex, suppressLoading = false) => {
    setRankingError(null);
    setPaymentStatusError(null);

    if (!suppressLoading) setLoading(true);
    setMessage("");
    setPlayers([]);
    setTrainingDates([]);
    setSuspendedDates([]);

    try {
      const year = new Date().getFullYear();

      // 1. Traer jugadores
      const playersRes = await fetch(`${API_BASE_URL}/players`);
      const playersData = await playersRes.json();

      // 2. Traer entrenamientos del mes
      const trainingsRes = await fetch(
        `${API_BASE_URL}/trainings?month=${monthIndex}`
      );

      const trainingsData = await trainingsRes.json();

      // Separar fechas y estados
      const trainingIdMap = trainingsData.map((t) => ({
        id: t.id,
        date: t.date,
        is_suspended: t.is_suspended,
      }));

      setTrainingDates(trainingIdMap); // Guardamos los objetos completos
      setSuspendedDates(trainingIdMap.map((t) => t.is_suspended));

      // 3. Traer asistencias
      const attendanceRes = await fetch(`${API_BASE_URL}/attendance`);
      const attendanceData = await attendanceRes.json();

      // 4. Traer pagos
      const paymentsRes = await fetch(
        `${API_BASE_URL}/payments?year=${year}&month=${monthIndex}`
      );
      const paymentsData = await paymentsRes.json();

      // 5. Unificar por jugador
      const jugadoresProcesados = playersData.map((player) => {
        const attendanceDelJugador = trainingIdMap.map((training) => {
          const record = attendanceData.find(
            (a) => a.player_id === player.id && a.training_id === training.id
          );
          return record ? record.present : false;
        });

        const pago = paymentsData.find(
          (p) =>
            p.player_id === player.id &&
            p.month === monthIndex &&
            p.year === year
        );

        return {
          ...player,
          attendance: attendanceDelJugador,
          paid: pago ? pago.paid : false,
        };
      });

      setPlayers(jugadoresProcesados);
      setSuspendedDates(trainingIdMap.map((t) => t.is_suspended));
    } catch (err) {
      console.error("Error al cargar datos del mes:", err);
      Swal.fire(
        "Error",
        `No se pudieron cargar los datos: ${err.message}`,
        "error"
      );
    } finally {
      if (!suppressLoading) setLoading(false);
    }
  }, []);

  // --- Función Genérica para Acciones (POST) ---
  const performAction = useCallback(
    async (action, payload, showLoadingAlert = false) => {
      const currentIsEditor = isAuthenticated && isAuthorized && !isGuest;
      const userEmail = userProfile?.email;

      if (!currentIsEditor) {
        Swal.fire(
          "Acción no permitida",
          "Debes ser un profesor autorizado.",
          "warning"
        );
        return null;
      }

      if (showLoadingAlert) {
        Swal.fire({
          title: "Procesando...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
      }

      try {
        let response;

        switch (action) {
          case "attendance":
            response = await fetch(`${API_BASE_URL}/attendance`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                player_id: payload.playerId,
                training_id: payload.trainingId,
                present: payload.value,
              }),
            });
            break;

          case "payment":
            response = await fetch(`${API_BASE_URL}/payments`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                player_id: payload.playerId,
                month: selectedMonthIndex,
                year: new Date().getFullYear(),
                paid: payload.value,
              }),
            });
            break;

          case "toggleSuspended":
            response = await fetch(
              `${API_BASE_URL}/trainings/${payload.trainingId}/suspend`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  is_suspended: payload.value,
                }),
              }
            );
            break;

          default:
            throw new Error(`Acción no soportada: ${action}`);
        }

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Error inesperado");

        if (showLoadingAlert) {
          Swal.fire({
            icon: "success",
            title: "Acción realizada",
            timer: 1200,
            showConfirmButton: false,
          });
        } else {
          setMessage("Acción guardada con éxito");
        }

        return result;
      } catch (err) {
        console.error("performAction error:", err);
        if (showLoadingAlert) Swal.close();
        Swal.fire("Error", err.message, "error");
        return null;
      }
    },
    [selectedMonthIndex, isAuthenticated, isAuthorized, isGuest, userProfile]
  );

const fetchRankingData = useCallback(async () => {
  setError(null);
  setPaymentStatusError(null);
  setLoadingRanking(true);
  setRankingError(null);
  setRankingData(null);
  setMessage("");
  setShowPaymentStatus(false);

  try {
    const response = await fetch(`${API_BASE_URL}/ranking`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    setRankingData(data);
    setShowRanking(true);
  } catch (err) {
    console.error("Error fetching ranking data:", err);
    setRankingError(`Error al cargar ranking: ${err.message}`);
    Swal.fire("Error", `No se pudo cargar el ranking: ${err.message}`, "error");
    setShowRanking(false);
  } finally {
    setLoadingRanking(false);
  }
}, []);


const fetchPaymentStatusData = useCallback(async () => {
  setError(null);
  setRankingError(null);
  setLoadingPaymentStatus(true);
  setPaymentStatusError(null);
  setPaymentStatusData(null);
  setMessage("");
  setShowRanking(false);
  setRankingData(null);

  try {
    const response = await fetch(`${API_BASE_URL}/payments/pendings?month=${selectedMonthIndex}&year=${new Date().getFullYear()}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    setPaymentStatusData(data);
    setShowPaymentStatus(true);
  } catch (err) {
    console.error("Error fetching payment status data:", err);
    setPaymentStatusError(`Error al cargar pagos: ${err.message}`);
    Swal.fire("Error", `No se pudo cargar el estado de pagos: ${err.message}`, "error");
    setShowPaymentStatus(false);
  } finally {
    setLoadingPaymentStatus(false);
  }
}, [selectedMonthIndex]);


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

      const playerIndex = originalPlayers.findIndex((p) => p.id === playerId);
      if (playerIndex === -1) return;

      const previousValue = originalPlayers[playerIndex].attendance[dateIndex];
      const newValue =
        typeof previousValue === "boolean" ? !previousValue : true;

      const trainingId = trainingDates[dateIndex]?.id;
      // Ahora cada fecha en `trainingDates` es un objeto con `id`

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

      setMessage("Guardando asistencia...");
      const successResult = await performAction(
        "attendance",
        { playerId, trainingId, value: newValue },
        false
      );

      if (successResult === null) {
        setMessage("");
        setPlayers(originalPlayers);
      }
    },
    [players, performAction, suspendedDates, trainingDates]
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
      Swal.fire(
        "Info",
        "No hay fechas de entrenamiento para eliminar en este mes.",
        "info"
      );
      return;
    }

    // Crear opciones para el select de Swal
    const dateOptions = {};
    trainingDates.forEach((dateYYYYMMDD) => {
      try {
        // Muestra DD/MM al usuario, pero el valor interno es YYYY-MM-DD
        const displayDate = new Date(
          dateYYYYMMDD + "T00:00:00"
        ).toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
        });
        dateOptions[dateYYYYMMDD] = displayDate; // key: YYYY-MM-DD, value: DD/MM
      } catch {
        dateOptions[dateYYYYMMDD] = dateYYYYMMDD; // Fallback si falla el formato
      }
    });

    const { value: dateToDelete } = await Swal.fire({
      title: `Eliminar Entrenamiento (${ALL_MONTH_NAMES[selectedMonthIndex]})`,
      input: "select",
      inputOptions: dateOptions,
      inputPlaceholder: "Seleccione una fecha",
      showCancelButton: true,
      confirmButtonText: "Eliminar Fecha",
      confirmButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "¡Necesita seleccionar una fecha para eliminar!";
        }
      },
    });

    if (dateToDelete) {
      // dateToDelete será el valor YYYY-MM-DD seleccionado
      await performAction(
        "deleteTrainingDate",
        { dateToDeleteString: dateToDelete },
        true
      ); // true para alerta de carga
    }
  }, [performAction, selectedMonthIndex, trainingDates]);

  const handleToggleSuspended = useCallback(
    async (dateIndex) => {
      const trainingId = trainingDates[dateIndex]?.id;
      // Igual que antes, tiene que ser el objeto con `id`
      const currentValue = suspendedDates[dateIndex];
      const newValue = !currentValue;

      const originalSuspendedDates = [...suspendedDates];

      setSuspendedDates((prevDates) =>
        prevDates.map((suspended, idx) =>
          idx === dateIndex ? newValue : suspended
        )
      );

      setMessage("Actualizando suspensión...");

      const result = await performAction(
        "toggleSuspended",
        { trainingId, value: newValue },
        false
      );

      if (result === null) {
        setSuspendedDates(originalSuspendedDates);
        setMessage("");
      }
    },
    [suspendedDates, trainingDates, performAction]
  );

const handlePaymentChange = useCallback(
  async (playerId) => {
    const originalPlayers = players.map((p) => ({ ...p }));
    const playerIndex = originalPlayers.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) return;

    const newValue = !originalPlayers[playerIndex].paid;

    setPlayers((prevPlayers) =>
      prevPlayers.map((p) =>
        p.id === playerId ? { ...p, paid: newValue } : p
      )
    );

    setMessage("Guardando pago...");

    const successResult = await performAction(
      "payment",
      { playerId, value: newValue },
      false
    );

    if (successResult === null) {
      setMessage("");
      setPlayers(originalPlayers); // Restaurar estado anterior si falló
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
    inputValidator: (v) => (!v || !v.trim() ? "Escriba un nombre" : null),
  });

  if (playerName) {
    try {
      const response = await fetch(`${API_BASE_URL}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: playerName.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al agregar jugador");
      }

      await fetchData(selectedMonthIndex); // recargar
      Swal.fire("Éxito", "Jugador agregado", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  }
}, [selectedMonthIndex, fetchData]);


const handleDeletePlayer = useCallback(async (playerId, playerName) => {
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
    try {
      const response = await fetch(`${API_BASE_URL}/players/${playerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al eliminar jugador");
      }

      await fetchData(selectedMonthIndex);
      Swal.fire("Eliminado", "Jugador eliminado", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  }
}, [selectedMonthIndex, fetchData]);

const handleUpdatePlayerName = useCallback(async (playerId, currentName) => {
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
    try {
      const response = await fetch(`${API_BASE_URL}/players/${playerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al modificar jugador");
      }

      await fetchData(selectedMonthIndex);
      Swal.fire("Actualizado", "Nombre actualizado", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  }
}, [selectedMonthIndex, fetchData]);


  const closeSpecialSections = () => {
    setShowRanking(false);
    setShowPaymentStatus(false);
    setRankingError(null);
    setPaymentStatusError(null);
    // fetchData(selectedMonthIndex); // Descomenta si quieres recargar mes al cerrar
  };

  //Mostrar Carga si el estado de Auth aún no está listo**
  if (isLoadingAuth) {
    return (
      <div className="flex flex-col min-h-screen fondo font-sans justify-center items-center">
        <SpinnerIcon />
        <span className="ml-2 text-white">Cargando datos de usuario...</span>
      </div>
    );
  }
  // --- Renderizado Principal usando Componentes Hijos ---
  return (
    <div className="flex flex-col h-screen fondo font-sans ">
      {/* Header con Navbar y Título */}
      <header className="text-white py-3 flex flex-col items-center px-4">
        {isAuthenticated && userProfile && (
          <div className="absolute top-4 right-4 z-50 py-2">
            <UserDisplay
              userProfile={userProfile}
              onLogout={logoutAndRedirect}
            />
          </div>
        )}
        {isGuest && (
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={() => setShowLoginModal(true)} // Abre el modal global
              className="text-lg bg-primary border-black  border rounded-full inline-flex items-center justify-left py-3 px-1 text-center mt-1 transition duration-150 ease-in-out shadow bg-blue-600 hover:bg-blue-700"
            >
              Iniciar Sesión
            </button>
          </div>
        )}
        {/* Navbar ahora recibe isEditor */}
        <div className="bg-black text-white text-start py-2 w-full ">
          {" "}
          <Navbar
            onAddPlayer={handleAddPlayer}
            onAddTrainingDate={handleAddTrainingDate}
            onDeleteTrainingDate={handleDeleteTrainingDate}
            isEditor={isAuthenticated && isAuthorized && !isGuest}
            loading={loading}
            loadingRanking={loadingRanking}
            loadingPaymentStatus={loadingPaymentStatus}
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
              isAuthenticated={isAuthenticated}
              isAuthorized={isAuthorized}
              isGuest={isGuest}
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
