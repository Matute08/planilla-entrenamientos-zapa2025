import React from 'react';

// Componente Footer simple
function Footer() {
    return (
        <footer className="bg-black text-white text-center py-3">
            <p className="text-sm"> © {new Date().getFullYear()} Planilla de Asistencias Zapataye </p>
        </footer>
    );
}

export default Footer;
