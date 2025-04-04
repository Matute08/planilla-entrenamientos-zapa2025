import React, { useEffect } from "react";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end", // Posición del toast
    showConfirmButton: false, // No mostrar botón de confirmación
    timer: 1500, // Duración en milisegundos
    timerProgressBar: true, // Mostrar barra de progreso
    didOpen: (toast) => {
        // Pausar el timer si el mouse está encima
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
});
// Componente para mostrar mensajes de feedback (éxito general, errores)
function FeedbackMessages({
    message,
    error,
    rankingError,
    paymentStatusError,
}) {
    useEffect(() => {
        // Verifica si hay un mensaje y si NO hay ningún error activo
        const hasError = error || rankingError || paymentStatusError;
        if (message && !hasError) {
            // Dispara el toast de SweetAlert2
            Toast.fire({
                icon: "success", // Icono de éxito
                title: message, // Usa el mensaje recibido como título
            });
        }
    }, [message, error, rankingError, paymentStatusError]);

    // Muestra el mensaje de éxito solo si no hay errores activos
    // const showSuccessMessage =
    //     message && !error && !rankingError && !paymentStatusError;
    return (
        <>
            {/* Muestra el primer error que encuentre */}
            {error && (
                <div className="mb-4 p-3 rounded-md bg-red-900 bg-opacity-80 text-white text-center shadow">
                    {" "}
                    <strong>Error: {error}</strong>{" "}
                </div>
            )}
            {/* Si no hay error mensual, muestra error de ranking si existe */}
            {!error && rankingError && (
                <div className="mb-4 p-3 rounded-md bg-red-900 bg-opacity-80 text-white text-center shadow">
                    {" "}
                    <strong>Error Ranking: {rankingError}</strong>{" "}
                </div>
            )}
            {/* Si no hay otros errores, muestra error de pagos si existe */}
            {!error && !rankingError && paymentStatusError && (
                <div className="mb-4 p-3 rounded-md bg-red-900 bg-opacity-80 text-white text-center shadow">
                    {" "}
                    <strong>Error Pagos: {paymentStatusError}</strong>{" "}
                </div>
            )}

            {/* Mensaje de Feedback (Éxito)
            {showSuccessMessage && (
                <div className="mb-4 p-3 rounded-md bg-green-800 bg-opacity-80 text-white text-center shadow transition-opacity duration-300">
                    {" "}
                    {message}{" "}
                </div>
            )} */}
        </>
    );
}

export default FeedbackMessages;
