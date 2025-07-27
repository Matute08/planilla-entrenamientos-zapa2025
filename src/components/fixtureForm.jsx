// COMPONENTE: FixtureForm.jsx (rediseñado con UI/UX moderna)
import React, { useState } from "react";
import API_BASE_URL from "../api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./authContext";
import UserDisplay from "./userDisplay";
import Navbar from "./navbar";

function FixtureForm({ onAdd }) {
    const {
        isAuthenticated,
        isAuthorized,
        isGuest,
        userProfile,
        handleLogout,
        setShowLoginModal,
        isLoadingAuth,
    } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const logoutAndRedirect = () => {
        handleLogout();
        navigate("/");
    };

    const etapas = [
        "Fecha 1",
        "Fecha 2",
        "Fecha 3",
        "Fecha 4",
        "Fecha 5",
        "Fecha 6",
        "Fecha 7",
        "Fecha 8",
        "Fecha 9",
        "Fecha 10",
        "Fecha 11",
        "Fecha 12",
        "Fecha 13",
        "Fecha 14",
        "Cuartos",
        "Semifinal",
        "Final",
    ];

    const [formData, setFormData] = useState({
        equipo: "masculino",
        etapa: etapas[0],
        hora_inicio: "",
        cancha: "",
        rival: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const res = await fetch(`${API_BASE_URL}/fixture`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Error al guardar el fixture");
            const nuevoPartido = await res.json();
            Swal.fire({
                title: "¡Partido agregado!",
                text: "El partido se ha guardado correctamente",
                icon: "success",
                confirmButtonColor: "#3B82F6",
                confirmButtonText: "Continuar"
            });
            setFormData({
                equipo: "masculino",
                etapa: etapas[0],
                hora_inicio: "",
                cancha: "",
                rival: "",
            });
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: err.message,
                icon: "error",
                confirmButtonColor: "#EF4444"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen fondo font-sans">
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
                            onClick={() => setShowLoginModal(true)}
                            className="text-lg bg-primary border-black border rounded-full inline-flex items-center justify-left py-3 px-1 text-center mt-1 transition duration-150 ease-in-out shadow bg-blue-600 hover:bg-blue-700"
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                )}
                <div className="bg-black text-white text-start py-2 w-full">
                    <Navbar
                        isEditor={isAuthenticated && isAuthorized && !isGuest}
                        loading={loading}
                    />
                </div>
            </header>

            {/* Contenido principal */}
            <main className="flex-grow overflow-auto p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* Header del formulario */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-white">
                                        Agregar Partido al Fixture
                                    </h1>
                                    <p className="text-blue-100 mt-1">
                                        Completa la información del nuevo partido
                                    </p>
                                </div>
                                <div className="hidden sm:block">
                                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Primera fila - Equipo y Etapa */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Equipo
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="equipo"
                                            value={formData.equipo}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white appearance-none cursor-pointer"
                                        >
                                            <option value="masculino">Masculino</option>
                                            <option value="femenino">Femenino</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Etapa
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="etapa"
                                            value={formData.etapa}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white appearance-none cursor-pointer"
                                        >
                                            {etapas.map((etapa) => (
                                                <option key={etapa} value={etapa}>
                                                    {etapa}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Segunda fila - Hora y Cancha */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Hora de inicio
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            name="hora_inicio"
                                            value={formData.hora_inicio}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            {/* <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg> */}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Cancha
                                    </label>
                                    <input
                                        type="text"
                                        name="cancha"
                                        value={formData.cancha}
                                        onChange={handleChange}
                                        placeholder="Ej: Cancha 1, Polideportivo..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Tercera fila - Rival */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Rival
                                </label>
                                <input
                                    type="text"
                                    name="rival"
                                    value={formData.rival}
                                    onChange={handleChange}
                                    placeholder="Nombre del equipo rival"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400"
                                    required
                                />
                            </div>

                            {/* Botones de acción */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Guardando...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Guardar Partido
                                        </div>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/fixture")}
                                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 border border-gray-300"
                                >
                                    <div className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Volver al Fixture
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>

                    
                </div>
            </main>
        </div>
    );
}

export default FixtureForm;
