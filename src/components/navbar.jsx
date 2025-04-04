import React from "react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();
    return (
        <button
            className="text-lg bg-primary border-primary border rounded-full inline-flex items-center justify-center py-3 px-7 text-center text-white hover:bg-[#464749] hover:border-[#464749] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-[#464749] active:border-[#464749]"
            onClick={() => navigate("/")}
        >
            Inicio
        </button>
    );
};
