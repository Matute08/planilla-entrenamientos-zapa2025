// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// --- Configuración ---
const EDITORES_AUTORIZADOS = [
    "zapatayefc@gmail.com",
    "matutegon97@gmail.com",
    "amburicamilo@gmail.com",
    "rodriguezfarid64@gmail.com",
].map((email) => email.toLowerCase());

// --- Contexto ---
const AuthContext = createContext(null);

// --- Proveedor del Contexto ---
export const AuthProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null); // { email, name, picture, idToken }
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Empieza como true para verificar estado inicial
    const [showLoginModal, setShowLoginModal] = useState(false);
    // Función para verificar si un email está autorizado
    const checkAuthorization = (email) => {
        const isAuth = EDITORES_AUTORIZADOS.includes(email.toLowerCase());
       
        return isAuth;
    };

    // Función para procesar el login exitoso de Google
    const handleLoginSuccess = (credentialResponse) => {
        setIsLoadingAuth(true);
        try {
            const idToken = credentialResponse.credential;
            const decodedToken = jwtDecode(idToken); // Decodifica el token para obtener info básica

            const email = decodedToken.email;
            const name = decodedToken.name;
            const picture = decodedToken.picture;

            if (email) {
                const authorized = checkAuthorization(email);
                setUserProfile({ email, name, picture, idToken }); // Guarda el token también!
                setIsAuthenticated(true);
                setIsAuthorized(authorized);
                setIsGuest(false); // No es invitado si inicia sesión
                setShowLoginModal(false);
                localStorage.setItem(
                    "userAuthData",
                    JSON.stringify({
                        email,
                        name,
                        picture,
                        idToken,
                        isAuthorized: authorized,
                    })
                );
               
            } else {
                console.error("No se pudo obtener el email del token.");
                handleLogout(); // Limpia si hay error
            }
        } catch (error) {
            console.error("Error decodificando o procesando el token:", error);
            handleLogout(); // Limpia si hay error
        } finally {
            setIsLoadingAuth(false);
        }
    };

    // Función para manejar el error de login de Google
    const handleLoginError = () => {
        console.error("Error en el inicio de sesión con Google");
        setIsLoadingAuth(false);
        // Podrías mostrar un mensaje de error al usuario aquí
    };

    // Función para entrar como invitado
    const handleGuestLogin = () => {
        setIsLoadingAuth(true); // Breve carga para simular cambio de estado
        setUserProfile(null);
        setIsAuthenticated(false);
        setIsAuthorized(false);
        setIsGuest(true);
        setShowLoginModal(false);
        localStorage.removeItem("userAuthData"); // Limpia datos previos si los hubiera
        setIsLoadingAuth(false);
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        setUserProfile(null);
        setIsAuthenticated(false);
        setIsAuthorized(false);
        setIsGuest(false);
        localStorage.removeItem("userAuthData"); // Limpia LocalStorage
        // Podrías querer recargar la página o redirigir a home
        // window.location.reload(); // O usar navigate si estás en un componente
    };

    // Efecto para verificar sesión guardada en LocalStorage al cargar
    useEffect(() => {
        const storedData = localStorage.getItem("userAuthData");
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                setUserProfile({
                    email: parsedData.email,
                    name: parsedData.name,
                    picture: parsedData.picture,
                    idToken: parsedData.idToken, // Guarda el token (posiblemente expirado)
                });
                setIsAuthenticated(true);
                setIsAuthorized(parsedData.isAuthorized); // Confía en el estado guardado
                setIsGuest(false);
               
            } catch (error) {
                console.error(
                    "Error al parsear datos de LocalStorage, limpiando:",
                    error
                );
                localStorage.removeItem("userAuthData");
            }
        }
        setIsLoadingAuth(false); // Termina la carga inicial
    }, []);

    // Efecto para mostrar modal si es necesario al cargar la app
    useEffect(() => {
        if (!isLoadingAuth && !isAuthenticated && !isGuest) {
            setShowLoginModal(true);
        }
    }, [isLoadingAuth, isAuthenticated, isGuest]);

    // Valor que proveerá el contexto
    const authContextValue = {
        userProfile,
        isAuthenticated,
        isAuthorized,
        isGuest,
        isLoadingAuth,
        handleLoginSuccess,
        showLoginModal,
        setShowLoginModal,
        handleLoginError,
        handleGuestLogin,
        handleLogout,
        idToken: userProfile?.idToken, // Provee el idToken directamente
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// --- Hook para usar el Contexto ---
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};
