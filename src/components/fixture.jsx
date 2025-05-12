// COMPONENTE: Fixture.jsx (actualizado con navegación a carga y campo 'etapa')
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api';

function Fixture() {
  const [fixture, setFixture] = useState([]);
  const [solapados, setSolapados] = useState([]);
  const navigate = useNavigate();

const fetchFixture = async () => {
  const res = await fetch(`${API_BASE_URL}/fixture`);
  const data = await res.json();

  if (Array.isArray(data)) {
    setFixture(data);
  } else {
    console.error("Error inesperado:", data);
    setFixture([]); // Evita que se rompa
  }
};

  const fetchSolapados = async () => {
    const res = await fetch(`${API_BASE_URL}/fixture/solapados`);
    const data = await res.json();
    setSolapados(data);
  };

  useEffect(() => {
    fetchFixture();
    fetchSolapados();
  }, []);

  const isSolapado = (item) => {
    return solapados.some(s => s.partido1_id === item.id || s.partido2_id === item.id);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 bg-white shadow-md rounded-xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Fixture General</h2>
        <button
          onClick={() => navigate('/fixture/cargar')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Cargar partido
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center border border-gray-300 rounded-md overflow-hidden">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border-r">Equipo</th>
              <th className="py-2 px-4 border-r">Etapa</th>
              <th className="py-2 px-4 border-r">Hora</th>
              <th className="py-2 px-4 border-r">Rival</th>
              <th className="py-2 px-4 border-r">Cancha</th>
              <th className="py-2 px-4">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {fixture.map((item) => (
              <tr
                key={item.id}
                className={`${isSolapado(item) ? 'bg-red-100 text-red-800 font-semibold' : 'bg-white'} border-b hover:bg-gray-50`}
              >
                <td className="py-2 px-4 border-r capitalize">{item.equipo}</td>
                <td className="py-2 px-4 border-r">{item.etapa}</td>
                <td className="py-2 px-4 border-r">{item.hora_inicio.slice(0,5)}</td>
                <td className="py-2 px-4 border-r">{item.rival}</td>
                <td className="py-2 px-4 border-r">{item.cancha}</td>
                <td className="py-2 px-4">{item.observaciones || '-'}</td>
              </tr>
            ))}
            {fixture.length === 0 && (
              <tr>
                <td colSpan="6" className="py-4 text-gray-500 italic">No hay partidos cargados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Fixture;
