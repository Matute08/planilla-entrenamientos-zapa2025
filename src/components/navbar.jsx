import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({
  onAddPlayer,
  loading,
  loadingRanking,
  loadingPaymentStatus,
  onAddTrainingDate,
  onDeleteTrainingDate,
  isEditor,
}) {
  const isLoadingAnything = loading || loadingRanking || loadingPaymentStatus;
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [trainingDropdownOpen, setTrainingDropdownOpen] = React.useState(false);
  const navigate = useNavigate();
  const actionButtonsDisabled = !isEditor || isLoadingAnything;

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
    <div className="flex items-center  rounded-lg shadow-lg gap-3">
      <div>
        <button
          className="text-lg bg-primary border-primary border rounded-full inline-flex items-center justify-left py-3 px-5 text-center text-white hover:bg-[#464749] hover:border-[#464749] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-[#464749] active:border-[#464749]"
          onClick={() => navigate("/")}
        >
          Inicio
        </button>
      </div>
      {/* Botón Opciones (deshabilitado si no es editor) */}
      <div className="relative inline-block text-left">
        <button
          className={`text-lg bg-primary borderprimary border rounded-full inline-flex items-center justify-center py-3 px-3 text-center text-white hover:bg-[#464749] hover:border[#464749] active:bg-[#464749] active:border-[#464749] transition duration-150 ease-in-out ${
            actionButtonsDisabled
              ? "opacity-50 cursor-not-allowed bg-gray-500 border-gray-500 hover:bg-gray-500"
              : ""
          }`}
          onClick={() =>
            actionButtonsDisabled ? null : setDropdownOpen(!dropdownOpen)
          } // No abrir si está deshabilitado
          disabled={actionButtonsDisabled} // Deshabilitar botón
          aria-disabled={actionButtonsDisabled}
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

        {dropdownOpen && isEditor && (
          <div className="absolute right-0 mt-2 w-50 bg-white border font-bold border-gray-200 rounded-xl shadow-lg z-50">
            <button
              className="block w-full px-4 py-2 text-left text-black text-sm font-medium hover:bg-blue-100 transition duration-150 ease-in-out"
              onClick={() => {
                onAddPlayer();
                setDropdownOpen(false);
              }}
              disabled={isLoadingAnything}
            >
              ➕ Nuevo Jugador
            </button>
            <hr className="border-gray-300" />
            <button
              className="block w-full px-4 py-2 text-left text-black text-sm font-medium hover:bg-blue-100 transition duration-150 ease-in-out"
              onClick={() => {
                onAddTrainingDate();
                setDropdownOpen(false);
              }}
              disabled={isLoadingAnything}
            >
              📅 Nuevo Entrenamiento
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
