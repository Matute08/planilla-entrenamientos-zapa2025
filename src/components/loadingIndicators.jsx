import React from 'react';
import SpinnerIcon from './spinnerIcon'; // Importa el icono

// Componente para mostrar indicadores de carga específicos
function LoadingIndicators({ loading, loadingRanking, loadingPaymentStatus, selectedMonthIndex, months }) {
     return (
        <>
            {/* Indicador de Carga Mensual */}
            {loading && !loadingRanking && !loadingPaymentStatus && ( <div className="text-center p-4 text-xl text-white"> <SpinnerIcon /> Cargando datos de {months[selectedMonthIndex]}... </div> )}
            {/* Indicador de Carga Ranking */}
            {loadingRanking && ( <div className="text-center p-4 text-xl text-white"> <SpinnerIcon /> Calculando ranking... </div> )}
            {/* Indicador de Carga Pagos */}
            {loadingPaymentStatus && ( <div className="text-center p-4 text-xl text-white"> <SpinnerIcon /> Consultando estado de pagos... </div> )}
        </>
     );
}

export default LoadingIndicators;
