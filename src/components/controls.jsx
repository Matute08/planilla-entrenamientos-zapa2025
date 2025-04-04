import React from 'react';
import SpinnerIcon from './spinnerIcon'; 

function Controls({
    selectedMonthIndex,
    handleMonthChange,
    fetchRankingData,
    fetchPaymentStatusData,
    loading,
    loadingRanking,
    loadingPaymentStatus,
    months,
}) {
    const isLoadingAnything = loading || loadingRanking || loadingPaymentStatus;

    return (
        <div className="mb-6 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6">
            {/* Selector de Mes */}
            <div className="flex items-center space-x-2">
                <label htmlFor="month-select" className="text-xl font-medium text-white"> Mes: </label>
                <select
                    id="month-select"
                    value={selectedMonthIndex}
                    onChange={handleMonthChange}
                    disabled={isLoadingAnything}
                    className="text-lg mt-1 block w-auto pl-3 pr-10 py-2 border-gray-600 focus:outline-none focus:border-blue-500 sm:text-lg rounded-md shadow-sm disabled:bg-gray-200 text-black bg-white"
                >
                    {months.map((month, index) => ( <option key={index} value={index}> {month} </option> ))}
                </select>
                <span className="text-xl font-semibold text-white"> {new Date().getFullYear()} </span>
            </div>
            {/* Botón Ranking */}
            <button
                onClick={fetchRankingData}
                disabled={isLoadingAnything}
                className="px-4 py-2 bg-sky-700 text-white font-semibold rounded-md shadow hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loadingRanking ? ( <SpinnerIcon /> ) : ( 'Ranking General' )}
            </button>
            {/* Botón Estado de Pagos */}
            <button
                onClick={fetchPaymentStatusData}
                disabled={isLoadingAnything}
                className="px-4 py-2 bg-red-400 text-white font-semibold rounded-md shadow hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loadingPaymentStatus ? ( <SpinnerIcon /> ) : ( 'Pagos Pendientes' )}
            </button>
        </div>
    );
}

export default Controls;
