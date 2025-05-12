// COMPONENTE: Fixture.jsx (con diseño mejorado y armonía visual)
import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../api';
import FixtureForm from './fixtureForm';

function Fixture() {
  const [fixture, setFixture] = useState([]);
  const [solapados, setSolapados] = useState([]);

  const fetchFixture = async () => {
    const res = await fetch(`${API_BASE_URL}/fixture`);
    const data = await res.json();
    setFixture(data);
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

  const handleAddFixture = (nuevoPartido) => {
    setFixture((prev) => [...prev, nuevoPartido]);
    fetchSolapados();
  };

  const isSolapado = (item) => {
    return solapados.some(s => s.partido1_id === item.id || s.partido2_id === item.id);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 bg-white shadow-md rounded-xl">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <FixtureForm onAdd={handleAddFixture} />
      </div>

      <div className="overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Fixture General</h2>
        <table className="w-full text-sm text-center border border-gray-300 rounded-md overflow-hidden">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border-r">Equipo</th>
              <th className="py-2 px-4 border-r">Fecha</th>
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
                <td className="py-2 px-4 border-r">{item.fecha}</td>
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
