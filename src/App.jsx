// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from "react-router-dom"; // Router aquí
import { AuthProvider, useAuth } from "./components/authContext"; // AuthProvider y useAuth aquí
import Main from './components/main'; // Main contiene las Routes
import LoginScreen from './components/loginScreen'; // Importa LoginScreen
import SpinnerIcon from './components/spinnerIcon'; // Para la carga inicial
import './App.css';

// Componente interno para acceder al contexto después de que AuthProvider esté montado
function AppContent() {
    const {
        isLoadingAuth,
        showLoginModal,
        //setShowLoginModal,
        handleLoginSuccess,
        handleLoginError,
        handleGuestLogin
     } = useAuth(); // Obtiene estado/funciones del modal

    // Muestra carga inicial de autenticación si es necesario
    if (isLoadingAuth) {
        return (
            <div className="h-screen bg-zinc-900 flex justify-center items-center">
                <SpinnerIcon /> <span className="ml-2 text-white">Verificando sesión...</span>
            </div>
        );
    }

    return (
        <>
            {/* Contenido principal de la app (rutas) */}
            <Main />

            {/* Renderiza el Modal de Login globalmente si showLoginModal es true */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]"> {/* Overlay y z-index alto */}
                    <LoginScreen
                         onLoginSuccess={(credentialResponse) => {
                            handleLoginSuccess(credentialResponse);
                            // setShowLoginModal(false); // Ya se hace en handleLoginSuccess
                         }}
                         onLoginError={handleLoginError}
                         onGuestLogin={() => {
                            handleGuestLogin();
                            // setShowLoginModal(false); // Ya se hace en handleGuestLogin
                         }}
                         // Opcional: Añadir un botón de cierre manual al LoginScreen
                         // onClose={() => setShowLoginModal(false)}
                    />
                </div>
             )}
        </>
    );
}


function App() {
  return (
      // Router envuelve AuthProvider, que envuelve AppContent
      <Router>
          <AuthProvider>
              <AppContent />
          </AuthProvider>
      </Router>
  );
}

export default App;