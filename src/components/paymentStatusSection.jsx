import React from "react";

// Componente para mostrar la sección de Estado de Pagos
function PaymentStatusSection({
  paymentStatusData,
  paymentStatusError,
  onClose,
}) {
  return (
    <div className="my-6 p-4 bg-white bg-opacity-90 text-black rounded-lg shadow-lg border border-gray-300 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-stone-950">
          Pagos Pendientes del Semestre 
        </h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-700 text-2xl font-bold focus:outline-none"
          aria-label="Cerrar estado de pagos"
        >
          {" "}
          &times;{" "}
        </button>
      </div>

      {/* Muestra error si existe */}
      {paymentStatusError && (
        <p className="text-center text-red-700">
          <strong>Error:</strong> {paymentStatusError}
        </p>
      )}

      {/* Muestra tabla si hay datos y no hay error */}
      {paymentStatusData &&
        paymentStatusData.length > 0 &&
        !paymentStatusError && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-950">
              <thead className="bg-blue-300">
                <tr>
                  <th className="px-4 py-2 text-center text-xs font-bold text-stone-950 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-bold text-stone-950 uppercase tracking-wider">
                    Cuotas Pendientes
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-bold text-stone-950 uppercase tracking-wider">
                    Meses Adeudados
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentStatusData.map((item, index) => (
                  <tr key={index} className="hover:bg-red-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-red-600">
                      {item.owedCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.owedMonths?.join(", ") || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      {/* Mensaje si no hay pagos pendientes y no hay error */}
      {paymentStatusData &&
        paymentStatusData.length === 0 &&
        !paymentStatusError && (
          <p className="text-center text-green-700 mt-4 font-semibold">
            ¡Todos los jugadores están al día con sus pagos del semestre!
          </p>
        )}
    </div>
  );
}

export default PaymentStatusSection;
