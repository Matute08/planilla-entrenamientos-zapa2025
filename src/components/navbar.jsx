import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({
    onAddPlayer,
    loading,
    loadingRanking,
    loadingPaymentStatus,
    onAddTrainingDate,
    onDeleteTrainingDate,
}) {
    const isLoadingAnything = loading || loadingRanking || loadingPaymentStatus;
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [trainingDropdownOpen, setTrainingDropdownOpen] =
        React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".relative")) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex justify-between items-center p-4 rounded-lg shadow-lg">
            <div>
                <button
                    className="text-lg bg-primary border-primary border rounded-full inline-flex items-center justify-left py-3 px-7 text-center text-white hover:bg-[#464749] hover:border-[#464749] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-[#464749] active:border-[#464749]"
                    onClick={() => navigate("/")}
                >
                    Inicio
                </button>
            </div>
            <div className="relative inline-block text-left">
                <button
                    className="text-lg bg-primary border-primary border rounded-full inline-flex items-center justify-center py-3 px-7 text-center text-white hover:bg-[#464749] hover:border-[#464749] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-[#464749] active:border-[#464749]"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    Opciones
                    <svg
                        className="ml-2 w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border font-bold border-gray-200 rounded-xl shadow-lg z-1000">
                        <button
                            className="block w-full px-4 py-2 text-left text-black text-m hover:bg-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2"
                            onClick={() => {
                                onAddPlayer();
                                setDropdownOpen(false);
                            }}
                            disabled={isLoadingAnything}
                        >
                            Nuevo Jugador
                        </button>
                        <hr className="border-gray-500" />

                        <div className="relative">
                            <button
                                className="block w-full px-4 py-2 text-left text-black text-m hover:bg-gray-300 focus:ring-offset-2 focus:outline-none focus:ring-2"
                                onClick={() =>
                                    setTrainingDropdownOpen(
                                        !trainingDropdownOpen
                                    )
                                }
                            >
                                Entrenamientos
                                <svg
                                    className="inline-block ml-2 w-4 h-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {trainingDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-full font-medium bg-gray-200 border border-gray-700 rounded-md shadow-lg z-20">
                                    <button
                                        className="block w-full px-4 py-2 text-left text-black text-m hover:bg-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2"
                                        onClick={() => {
                                            onAddTrainingDate();
                                            setDropdownOpen(false);
                                            setTrainingDropdownOpen(false);
                                        }}
                                        disabled={isLoadingAnything}
                                    >
                                        Nuevo 
                                    </button>
                                    <hr className="border-gray-600" />
                                    <button
                                        className="block w-full px-4 py-2 text-left text-black text-m hover:bg-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2"
                                        onClick={() => {
                                            onDeleteTrainingDate();
                                            setDropdownOpen(false);
                                            setTrainingDropdownOpen(false);
                                        }}
                                        disabled={isLoadingAnything}
                                    >
                                        Eliminar 
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
