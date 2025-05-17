// COMPONENTE: FixtureForm.jsx (actualizado con campo ETAPA)
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
    } = useAuth(); // Obtiene estado y token de AuthContext
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const logoutAndRedirect = () => {
        handleLogout(); // Llama a la función original del contexto
        navigate("/"); // Redirige a la página principal
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
        try {
            const res = await fetch(`${API_BASE_URL}/fixture`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Error al guardar el fixture");
            const nuevoPartido = await res.json();
            onAdd(nuevoPartido);
            Swal.fire("Éxito", "Partido agregado correctamente", "success");
            setFormData({
                equipo: "masculino",
                etapa: etapas[0],
                hora_inicio: "",
                cancha: "",
                rival: "",
            });
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

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
                        isEditor={isAuthenticated && isAuthorized && !isGuest}
                        loading={loading}
                    />{" "}
                </div>
            </header>
            {/* Contenido principal */}
            <main className="flex-grow overflow-auto p-4">
                <div className="p-6 max-w-5xl mx-auto space-y-8 bg-white shadow-md rounded-xl">
                    <div className=" items-center">
                        <form
                            onSubmit={handleSubmit}
                            className="p-4 bg-white rounded shadow-md space-y-3"
                        >
                            <h3 className="text-lg font-bold">
                                Agregar partido al fixture
                            </h3>

                            <div className="flex flex-col">
                                <label>Equipo</label>
                                <select
                                    name="equipo"
                                    value={formData.equipo}
                                    onChange={handleChange}
                                    className="border p-2 rounded"
                                >
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label>Etapa</label>
                                <select
                                    name="etapa"
                                    value={formData.etapa}
                                    onChange={handleChange}
                                    className="border p-2 rounded"
                                >
                                    {etapas.map((etapa) => (
                                        <option key={etapa} value={etapa}>
                                            {etapa}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label>Hora de inicio</label>
                                <input
                                    type="time"
                                    name="hora_inicio"
                                    value={formData.hora_inicio}
                                    onChange={handleChange}
                                    className="border p-2 rounded"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label>Cancha</label>
                                <input
                                    type="text"
                                    name="cancha"
                                    value={formData.cancha}
                                    onChange={handleChange}
                                    className="border p-2 rounded"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label>Rival</label>
                                <input
                                    type="text"
                                    name="rival"
                                    value={formData.rival}
                                    onChange={handleChange}
                                    className="border p-2 rounded"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 m-2 rounded hover:bg-blue-700"
                            >
                                Guardar partido
                            </button>

                            <button
                                onClick={() => navigate("/fixture")}
                                className="bg-gray-300 text-gray-800 px-4 py-2 m-2 rounded hover:bg-gray-400"
                            >
                                ← Volver al fixture
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default FixtureForm;
