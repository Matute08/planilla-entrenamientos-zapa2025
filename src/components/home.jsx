import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./authContext"; // Importa el hook useAuth
import SpinnerIcon from "./spinnerIcon"; // Importa el spinner
import UserDisplay from "./userDisplay"; // Importa el componente de usuario
function Home() {
    const navigate = useNavigate();
    const {
        isAuthenticated,
        isAuthorized,
        isGuest,
        handleLogout,
        userProfile,
        setShowLoginModal,
    } = useAuth(); // Obtiene el estado y funciones del contexto

    const logoutAndRedirect = () => {
        handleLogout(); // Llama a la función original del contexto para limpiar estado
        navigate("/"); // Redirige a la página principal
    };
    // --- Renderizado Condicional ---

    // 3. Muestra el Contenido Principal (Home) si está autenticado o es invitado
    return (
        <div className="relative min-h-screen bg-zinc-900 font-sans text-center flex flex-col justify-center items-center gap-6 fondo p-4">
            {/* Muestra info del usuario si está autenticado */}
            {isAuthenticated && userProfile && (
                <div className="absolute top-4 right-4">
                    <UserDisplay
                        userProfile={userProfile}
                        onLogout={logoutAndRedirect}
                    />
                </div>
            )}
            {isGuest && (
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => setShowLoginModal(true)} // Abre el modal de login
                        className="text-lg bg-primary border-black text-white border rounded-full inline-flex items-center justify-left py-3 px-2 text-center mt-1 transition duration-150 ease-in-out shadow bg-blue-600 hover:bg-blue-700"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            )}

            <h1 className="text-4xl font-bold text-white mt-10 sm:mt-0">
                Planilla de asistencia Zapataye
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                    className="bg-sky-700 border-sky-700 border rounded-md inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-sky-800 hover:border-sky-800 disabled:bg-gray-400 disabled:border-gray-400 active:bg-sky-900 active:border-sky-900 transition duration-150 ease-in-out shadow-md"
                    onClick={() => navigate("/planillaMasculino")}
                >
                    Masculino
                </button>

                <button
                    className="bg-pink-600 border-pink-600 border rounded-md inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-pink-700 hover:border-pink-700 disabled:bg-gray-400 disabled:border-gray-400 active:bg-pink-800 active:border-pink-800 transition duration-150 ease-in-out shadow-md"
                    onClick={() => navigate("/planillaFemenino")}
                >
                    Femenino
                </button>
            </div>
            {/* Mensaje de Bienvenida Condicional */}
            <div className="mt-6 text-gray-300">
                {isAuthenticated && isAuthorized && (
                    <p>Bienvenido {userProfile?.name?.split(" ")[0]}!</p>
                )}

               
            </div>
        </div>
    );
}

export default Home;
