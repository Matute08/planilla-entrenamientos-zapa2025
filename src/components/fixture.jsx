// COMPONENTE: Fixture.jsx (rediseñado con UI/UX moderna)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import { useAuth } from "./authContext";
import UserDisplay from "./userDisplay";
import Navbar from "./navbar";
import Swal from "sweetalert2";

function Fixture() {
    const { isGuest, userProfile, handleLogout, setShowLoginModal } = useAuth();
    const [fixture, setFixture] = useState([]);
    const [solapados, setSolapados] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const logoutAndRedirect = () => {
        handleLogout();
        navigate("/");
    };

    const fetchFixture = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/fixture`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setFixture(data);
            } else {
                console.error("Error inesperado:", data);
                setFixture([]);
            }
        } catch (error) {
            console.error("Error al cargar fixture:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSolapados = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/fixture/solapados`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setSolapados(data);
            } else {
                console.error("Error en solapados:", data);
                setSolapados([]);
            }
        } catch (error) {
            console.error("Error al cargar solapados:", error);
        }
    };

    useEffect(() => {
        fetchFixture();
        fetchSolapados();
    }, []);

    const isSolapado = (item) => {
        return (
            Array.isArray(solapados) &&
            solapados.some(
                (s) => s.partido1_id === item.id || s.partido2_id === item.id
            )
        );
    };

    const handleDeleteEtapas = async () => {
        // Verificar que el usuario esté logueado
        if (isGuest) {
            Swal.fire({
                title: "Acceso denegado",
                text: "Debes iniciar sesión para eliminar partidos del fixture.",
                icon: "warning",
                confirmButtonColor: "#F59E0B"
            });
            return;
        }

        // Agrupar partidos por etapa y equipo para eliminación más específica
        const partidosAgrupados = fixture.reduce((acc, partido) => {
            const key = `${partido.etapa}_${partido.equipo}`;
            if (!acc[key]) {
                acc[key] = {
                    etapa: partido.etapa,
                    equipo: partido.equipo,
                    partidos: []
                };
            }
            acc[key].partidos.push(partido);
            return acc;
        }, {});

        // Ordenar y crear opciones
        const opcionesEliminacion = Object.values(partidosAgrupados)
            .sort((a, b) => {
                const numA = parseInt(a.etapa.match(/\d+/)?.[0] || 0);
                const numB = parseInt(b.etapa.match(/\d+/)?.[0] || 0);
                if (numA && numB) return numA - numB;
                return a.etapa.localeCompare(b.etapa);
            })
            .map(grupo => ({
                id: `${grupo.etapa}_${grupo.equipo}`,
                label: `${grupo.etapa} - ${grupo.equipo.charAt(0).toUpperCase() + grupo.equipo.slice(1)}`,
                value: `${grupo.etapa}_${grupo.equipo}`,
                count: grupo.partidos.length,
                etapa: grupo.etapa,
                equipo: grupo.equipo
            }));

        // Crear HTML del formulario
        const formHtml = `
            <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-3">Selecciona los grupos de partidos a eliminar</h3>
                <p class="text-sm text-gray-600 mb-4">Se eliminarán todos los partidos del equipo seleccionado en esa etapa específica.</p>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    ${opcionesEliminacion.map(opcion => `
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div class="flex items-center">
                                <input type="checkbox" id="opcion_${opcion.id}" name="opciones" value="${opcion.value}" class="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded">
                                <label for="opcion_${opcion.id}" class="text-sm text-gray-700 flex items-center">
                                    <span class="mr-2">${opcion.equipo === 'masculino' ? '⚽' : '🏃‍♀️'}</span>
                                    ${opcion.label}
                                </label>
                            </div>
                            <span class="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">${opcion.count} partido${opcion.count !== 1 ? 's' : ''}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const result = await Swal.fire({
            title: "Eliminar grupos de partidos",
            html: `<form id="eliminacion-form" class="text-left">${formHtml}</form>`,
            showCancelButton: true,
            confirmButtonText: "Eliminar seleccionados",
            confirmButtonColor: "#EF4444",
            cancelButtonText: "Cancelar",
            width: '600px',
            preConfirm: () => {
                const checkboxes = document.querySelectorAll('input[name="opciones"]:checked');
                return Array.from(checkboxes).map((cb) => cb.value);
            },
        });

        const opcionesSeleccionadas = result.value;

        if (opcionesSeleccionadas && opcionesSeleccionadas.length > 0) {
            try {
                let eliminacionesRealizadas = 0;

                // Procesar cada opción seleccionada
                for (const opcion of opcionesSeleccionadas) {
                    const [etapa, equipo] = opcion.split('_');
                    
                    // Filtrar partidos que coincidan con la etapa y equipo
                    const partidosAEliminar = fixture.filter(p => p.etapa === etapa && p.equipo === equipo);
                    
                    // Eliminar cada partido individualmente
                    for (const partido of partidosAEliminar) {
                        try {
                            const res = await fetch(`${API_BASE_URL}/fixture/${partido.id}`, {
                                method: "DELETE",
                            });
                            if (res.ok) {
                                eliminacionesRealizadas++;
                            } else {
                                console.error(`Error al eliminar partido ${partido.id}:`, res.status, res.statusText);
                            }
                        } catch (error) {
                            console.error(`Error de red al eliminar partido ${partido.id}:`, error);
                        }
                    }
                }

                if (eliminacionesRealizadas > 0) {
                    await fetchFixture();
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: `${eliminacionesRealizadas} partido${eliminacionesRealizadas !== 1 ? 's' : ''} eliminado${eliminacionesRealizadas !== 1 ? 's' : ''} correctamente`,
                        icon: "success",
                        confirmButtonColor: "#10B981"
                    });
                } else {
                    throw new Error("No se pudo eliminar ningún partido");
                }
            } catch (error) {
                console.error("Error en eliminación:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron eliminar los partidos seleccionados. Verifica la conexión con el servidor.",
                    icon: "error",
                    confirmButtonColor: "#EF4444"
                });
            }
        }
    };

    const fixtureAgrupado = fixture.reduce((acc, partido) => {
        acc[partido.etapa] = acc[partido.etapa] || [];
        acc[partido.etapa].push(partido);
        return acc;
    }, {});

    // Función para ordenar las etapas correctamente
    const ordenarEtapas = (etapas) => {
        return etapas.sort((a, b) => {
            // Extraer números de las etapas
            const numA = parseInt(a.match(/\d+/)?.[0] || 0);
            const numB = parseInt(b.match(/\d+/)?.[0] || 0);
            
            // Si ambos tienen números, ordenar numéricamente
            if (numA && numB) {
                return numA - numB;
            }
            
            // Si solo uno tiene número, el que no tiene número va al final
            if (numA && !numB) return -1;
            if (!numA && numB) return 1;
            
            // Si ninguno tiene número, ordenar alfabéticamente
            return a.localeCompare(b);
        });
    };

    const getEquipoColor = (equipo) => {
        return equipo === "masculino" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800";
    };

    const getEquipoIcon = (equipo) => {
        return equipo === "masculino" ? "⚽" : "🏃‍♀️";
    };

    return (
        <div className="flex flex-col h-screen fondo font-sans">
            <header className="text-white py-3 flex flex-col items-center px-4">
                {userProfile && (
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
                    <Navbar isEditor={!isGuest} />
                </div>
            </header>

            <main className="flex-grow overflow-auto p-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header con estadísticas */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
                        <div className="bg-gradient-to-r from-black to-white-900 px-4 py-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-white">
                                        Fixture General
                                    </h1>
                                    <p className="text-blue-100 mt-1">
                                        Calendario de partidos y torneos
                                    </p>
                                </div>
                                {!isGuest ? (
                                    <div className="mt-4 sm:mt-0 flex flex-row gap-2 sm:gap-3 justify-center">
                                        <button
                                            onClick={() => navigate("/fixture/cargar")}
                                            className="inline-flex items-center px-3 py-2 sm:px-6 sm:py-3 bg-blue-900 bg-opacity-20 hover:bg-opacity-30 text-white text-sm sm:text-base font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                                        >
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <span className="hidden sm:inline">Cargar Partido</span>
                                            <span className="sm:hidden">Cargar</span>
                                        </button>
                                        <button
                                            onClick={handleDeleteEtapas}
                                            className="inline-flex items-center px-3 py-2 sm:px-6 sm:py-3 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                                        >
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            <span className="hidden sm:inline">Eliminar Partidos</span>
                                            <span className="sm:hidden">Eliminar</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-4 sm:mt-0 flex items-center justify-center">
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                                <span className="text-sm text-yellow-800 font-medium">
                                                    Modo solo visualización
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                       
                    </div>

                    {/* Contenido de partidos */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="ml-3 text-gray-600">Cargando partidos...</span>
                                </div>
                            </div>
                        ) : Object.entries(fixtureAgrupado).length > 0 ? (
                            ordenarEtapas(Object.keys(fixtureAgrupado)).map((etapa) => {
                                const partidos = fixtureAgrupado[etapa];
                                return (
                                <div key={etapa} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                            <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {etapa}
                                            <span className="ml-3 text-sm font-normal text-gray-500">
                                                ({partidos.length} partido{partidos.length !== 1 ? 's' : ''})
                                            </span>
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid gap-4">
                                            {partidos.map((item) => {
                                                const isConflict = isSolapado(item);
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                                                            isConflict
                                                                ? "bg-red-50 border-red-200 shadow-md"
                                                                : "bg-gray-50 border-gray-200 hover:border-blue-300"
                                                        }`}
                                                    >
                                                        {isConflict && (
                                                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                                                                ⚠️ Superposición
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                            <div className="flex items-center space-x-4">
                                                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getEquipoColor(item.equipo)}`}>
                                                                    <span className="mr-2">{getEquipoIcon(item.equipo)}</span>
                                                                    {item.equipo.charAt(0).toUpperCase() + item.equipo.slice(1)}
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    <span className={`font-semibold ${isConflict ? "text-red-700" : "text-gray-700"}`}>
                                                                        {item.hora_inicio.slice(0, 5)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                                                                <div className="flex items-center space-x-2">
                                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                    </svg>
                                                                    <span className={`font-medium ${isConflict ? "text-red-700" : "text-gray-700"}`}>
                                                                        vs {item.rival}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                    </svg>
                                                                    <span className={`font-medium ${isConflict ? "text-red-700" : "text-gray-700"}`}>
                                                                        {item.cancha}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                            })
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
                                <div className="max-w-md mx-auto">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay partidos cargados</h3>
                                    <p className="text-gray-500 mb-6">
                                        {!isGuest 
                                            ? "Comienza agregando el primer partido del fixture" 
                                            : "Inicia sesión para poder cargar partidos del fixture"
                                        }
                                    </p>
                                    {!isGuest ? (
                                        <button
                                            onClick={() => navigate("/fixture/cargar")}
                                            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Cargar Primer Partido
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setShowLoginModal(true)}
                                            className="inline-flex items-center px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors duration-200"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            Iniciar Sesión
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    
                </div>
            </main>
        </div>
    );
}

export default Fixture;
