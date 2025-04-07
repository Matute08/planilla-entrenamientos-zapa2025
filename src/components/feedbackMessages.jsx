import React, { useEffect } from 'react';
import Swal from 'sweetalert2'; // Importa SweetAlert2

// Configuración del Toast (Mixin)
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

// Componente para mostrar mensajes de éxito como Toasts
function FeedbackMessages({ message, error, rankingError, paymentStatusError }) { // Recibe errores para NO mostrar toast si hay error

    // Efecto para mostrar el toast de éxito cuando 'message' cambie y no haya errores
    useEffect(() => {
        const hasError = error || rankingError || paymentStatusError;
        if (message && !hasError) {
            Toast.fire({
              icon: "success",
              title: message // Usa el mensaje de éxito como título del toast
            });
        }
    }, [message, error, rankingError, paymentStatusError]); // Dependencias

    // Este componente ya no necesita renderizar nada en el DOM para los mensajes
    return null;
}

export default FeedbackMessages;
