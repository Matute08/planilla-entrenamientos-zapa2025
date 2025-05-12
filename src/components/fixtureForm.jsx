// COMPONENTE: FixtureForm.jsx (actualizado con campo ETAPA)
import React, { useState } from 'react';
import API_BASE_URL from '../api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
function FixtureForm({ onAdd }) {
    const navigate = useNavigate();
  const etapas = [
    'Fecha 1', 'Fecha 2', 'Fecha 3', 'Fecha 4', 'Fecha 5',
    'Fecha 6', 'Fecha 7', 'Fecha 8', 'Fecha 9', 'Fecha 10',
    'Fecha 11', 'Fecha 12', 'Fecha 13', 'Fecha 14',
    'Cuartos', 'Semifinal', 'Final'
  ];

  const [formData, setFormData] = useState({
    equipo: 'masculino',
    etapa: etapas[0],
    hora_inicio: '',
    cancha: '',
    rival: '',
    observaciones: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/fixture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Error al guardar el fixture');
      const nuevoPartido = await res.json();
      onAdd(nuevoPartido);
      Swal.fire('Éxito', 'Partido agregado correctamente', 'success');
      setFormData({ equipo: 'masculino', etapa: etapas[0], hora_inicio: '', cancha: '', rival: '', observaciones: '' });
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  return (
    
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-md space-y-3">
      <h3 className="text-lg font-bold">Agregar partido al fixture</h3>

      <div className="flex flex-col">
        <label>Equipo</label>
        <select name="equipo" value={formData.equipo} onChange={handleChange} className="border p-2 rounded">
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label>Etapa</label>
        <select name="etapa" value={formData.etapa} onChange={handleChange} className="border p-2 rounded">
          {etapas.map((etapa) => (
            <option key={etapa} value={etapa}>{etapa}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label>Hora de inicio</label>
        <input type="time" name="hora_inicio" value={formData.hora_inicio} onChange={handleChange} className="border p-2 rounded" required />
      </div>

      <div className="flex flex-col">
        <label>Cancha</label>
        <input type="text" name="cancha" value={formData.cancha} onChange={handleChange} className="border p-2 rounded" required />
      </div>

      <div className="flex flex-col">
        <label>Rival</label>
        <input type="text" name="rival" value={formData.rival} onChange={handleChange} className="border p-2 rounded" required />
      </div>

      <div className="flex flex-col">
        <label>Observaciones</label>
        <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} className="border p-2 rounded" rows={2} />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Guardar partido
      </button>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <button
        onClick={() => navigate('/fixture')}
        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
      >
        ← Volver al fixture
      </button>

      <FixtureForm onAdd={() => navigate('/fixture')} />
    </div>
    </form>
  );
}

export default FixtureForm;
