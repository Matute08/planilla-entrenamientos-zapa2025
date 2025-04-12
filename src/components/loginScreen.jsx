import React from "react";
import { GoogleLogin } from "@react-oauth/google";

// Pantalla de inicio de sesión
function LoginScreen({ onLoginSuccess, onLoginError, onGuestLogin, onClose }) {
    return (
        // Contenedor centrado que ocupa toda la pantalla
        <div className="flex flex-col items-center justify-center min-h-screen fondo text-white p-4">
            {/* Botón de cierre opcional */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl font-bold focus:outline-none"
                    aria-label="Cerrar"
                >
                    &times;
                </button>
            )}
            <div className="bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
                {/* Título */}
                <h1 className="text-3xl font-bold mb-4">
                    Planilla de Asistencias
                </h1>
                <p className="text-gray-300 mb-10">
                    Inicia sesión para editar o entra como invitado para
                    visualizar.
                </p>

                {/* Botón de Google Sign-In */}
                <div className="mb-6 flex justify-center">
                    <GoogleLogin
                        onSuccess={onLoginSuccess}
                        onError={onLoginError}
                        // Opciones de personalización (opcional)
                        theme="outline"
                        size="large"
                        shape="rectangular"
                        logo_alignment="left"
                        text="signin_with" // O "continue_with"
                        locale="es" // Establece el idioma
                    />
                </div>

                {/* Separador */}
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-t border-gray-600" />
                    <span className="px-4 text-gray-400">O</span>
                    <hr className="flex-grow border-t border-gray-600" />
                </div>

                {/* Botón Entrar como Invitado */}
                <button
                    onClick={onGuestLogin}
                    className="w-full px-4 py-2 bg-gray-600 text-white font-semibold rounded-md shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    Entrar como Invitado (Solo Lectura)
                </button>
            </div>
            
        </div>
    );
}

export default LoginScreen;
