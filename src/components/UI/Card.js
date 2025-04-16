import React from 'react';

/**
 * Componente Card per il layout delle sezioni
 * @param {Object} props - Props del componente
 * @param {React.ReactNode|string} props.title - Titolo della card
 * @param {React.ReactNode} props.children - Contenuto della card
 * @param {string} props.className - Classi CSS aggiuntive
 */
const Card = ({ title, children, className = '' }) => {
    return (
        <div className={`mb-6 p-4 bg-white rounded-lg shadow ${className}`}>
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            {children}
        </div>
    );
};

export default Card;