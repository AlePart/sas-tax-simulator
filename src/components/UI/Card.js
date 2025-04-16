import React from 'react';

/**
 * Componente Card riutilizzabile
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Contenuto della card
 * @param {string} props.title - Titolo della card (opzionale)
 * @param {string} props.className - Classi CSS aggiuntive (opzionale)
 */
const Card = ({ children, title, className = '' }) => {
    return (
        <div className={`mb-6 p-4 bg-white rounded-lg shadow ${className}`}>
            {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
            {children}
        </div>
    );
};

export default Card;