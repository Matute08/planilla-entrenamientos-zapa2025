import React from "react";
import { useNavigate } from "react-router-dom";
function Home() {
    const navigate = useNavigate();

    return (
        <div className="h-screen bg-zinc-900 font-sans text-center flex flex-col justify-center items-center gap-4 fondo">
            <h1 className="text-3xl font-bold text-white">
                Planilla de asistencia de Zapataye
            </h1>
            <button
                className="bg-primary border-primary border rounded-md inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-[#0369a1] hover:border-[#0369a1] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-[#0369a1] active:border-[#0369a1]"
                onClick={() => navigate("/planillaMasculino")}
            >
                Masculino
            </button>

            <button
                className="bg-primary border-primary border rounded-md inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-[#0369a1] hover:border-[#0369a1] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-[#0369a1] active:border-[#0369a1]"
                onClick={() => navigate("/planillaFemenino")}
                
            >
                Femenino
            </button>
        </div>
    );
}

export default Home;
