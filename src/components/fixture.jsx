// COMPONENTE: Fixture.jsx (fix de clase malformada y superposición condicional)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import { useAuth } from "./authContext";
import UserDisplay from "./userDisplay";
import Navbar from "./navbar";

function Fixture() {
  const {
    isGuest,
    userProfile,
    handleLogout,
    setShowLoginModal,
    isLoadingAuth,
  } = useAuth();
  const [fixture, setFixture] = useState([]);
  const [solapados, setSolapados] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logoutAndRedirect = () => {
    handleLogout();
    navigate("/");
  };

  const fetchFixture = async () => {
    const res = await fetch(`${API_BASE_URL}/fixture`);
    const data = await res.json();
    if (Array.isArray(data)) {
      setFixture(data);
    } else {
      console.error("Error inesperado:", data);
      setFixture([]);
    }
  };

  const fetchSolapados = async () => {
    const res = await fetch(`${API_BASE_URL}/fixture/solapados`);
    const data = await res.json();
    if (Array.isArray(data)) {
      setSolapados(data);
    } else {
      console.error("Error en solapados:", data);
      setSolapados([]);
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

  const fixtureAgrupado = fixture.reduce((acc, partido) => {
    acc[partido.etapa] = acc[partido.etapa] || [];
    acc[partido.etapa].push(partido);
    return acc;
  }, {});

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
          <Navbar isEditor={!isGuest} loading={loading} />
        </div>
      </header>

      <main className="flex-grow overflow-auto p-4">
        <div className="p-6 max-w-5xl mx-auto space-y-8 bg-white shadow-md rounded-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Fixture General
            </h2>
            <button
              onClick={() => navigate("/fixture/cargar")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
            Cargar partido
            </button>
          </div>

          <div className="overflow-x-auto">
            {Object.entries(fixtureAgrupado).map(([etapa, partidos]) => (
              <div key={etapa} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1 border-blue-300">
                  {etapa}
                </h3>
                <table className="w-full text-sm text-center border border-gray-300 rounded-md overflow-hidden">
                  <thead className="bg-blue-100 text-gray-700">
                    <tr>
                      <th className="py-2 px-4 border-r">Equipo</th>
                      <th className="py-2 px-4 border-r">Hora</th>
                      <th className="py-2 px-4 border-r">Rival</th>
                      <th className="py-2 px-4 border-r">Cancha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partidos.map((item) => {
                      const isConflict = isSolapado(item);
                      return (
                        <tr
                          key={item.id}
                          className={`${
                            isConflict
                              ? "bg-red-100 text-red-800 font-semibold"
                              : "bg-white"
                          } border-b hover:bg-gray-50`}
                        >
                          <td className="py-2 px-4 border-r capitalize">
                            {item.equipo}
                          </td>
                          <td className="py-2 px-4 border-r">
                            {item.hora_inicio.slice(0, 5)}
                          </td>
                          <td className="py-2 px-4 border-r">{item.rival}</td>
                          <td className="py-2 px-4 border-r">{item.cancha}</td>
                          
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
            {fixture.length === 0 && (
              <div className="py-4 text-gray-500 italic text-center">
                No hay partidos cargados.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Fixture;
