import React from 'react';

// Componente para mostrar la sección de Ranking
function RankingSection({ rankingData, rankingError, onClose }) {
    // Nota: El indicador de carga principal ahora está en LoadingIndicators
    // Aquí solo mostramos el contenido una vez que la carga termina (implícito por cómo se llama en App.js)
    return (
        <div className="my-6 p-4 bg-white bg-opacity-90 text-black rounded-lg shadow-lg border border-gray-300 relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-stone-950">Ranking General de Asistencia</h2>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-red-700 text-2xl font-bold focus:outline-none" aria-label="Cerrar ranking"> &times; </button>
            </div>
            {/* Muestra error si existe */}
            {rankingError && <p className="text-center text-red-700"><strong>Error:</strong> {rankingError}</p>}
            {/* Muestra tabla si hay datos y no hay error */}
            {rankingData && rankingData.length > 0 && !rankingError && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-zinc-950">
                        <thead className="bg-blue-300">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-bold text-stone-950 uppercase tracking-wider">Pos.</th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-stone-950 uppercase tracking-wider">Nombre</th>
                                <th className="px-4 py-2 text-center text-xs font-bold text-stone-950 uppercase tracking-wider">Asistencias</th>
                                <th className="px-4 py-2 text-center text-xs font-bold text-stone-950 uppercase tracking-wider">Faltas</th>
                                <th className="px-4 py-2 text-center text-xs font-bold text-stone-950 uppercase tracking-wider">Total Entren.</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-zinc-400">
                            {rankingData.map((player, index) => (
                                <tr key={player.name + index} className="hover:bg-purple-50">
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{player.name}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-700 font-semibold text-center">{player.attended}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-red-700 font-semibold text-center">{player.missed}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 text-center">{player.totalTrainings}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Mensaje si no hay datos y no hay error */}
            {rankingData && rankingData.length === 0 && !rankingError && ( <p className="text-center text-gray-700 mt-4">No hay datos suficientes para generar un ranking.</p> )}
        </div>
    );
}

export default RankingSection;
