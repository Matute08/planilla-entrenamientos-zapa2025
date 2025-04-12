import React, { useState } from "react";
function UserDisplay({ userProfile, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!userProfile) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 focus:outline-none"
            >
                <img
                    src={userProfile.picture}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full border-2 border-gray-400 hover:border-white transition"
                />
                <span className="text-white hidden md:inline">
                    {userProfile.email}
                </span>
                <svg
                    className={`w-4 h-4 text-white transition-transform duration-200 ${
                        isOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    ></path>
                </svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="flex justify-center px-4 py-2 text-sm text-gray-700 border-b">
                        Hola,{" "}
                        <span className="font-bold">{userProfile.name?.split(" ")[0]}</span>
                    </div>
                    <button
                        onClick={() => {
                            onLogout();
                            setIsOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-100 hover:text-red-700"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    );
}
export default UserDisplay;