import React from 'react';

/**
 * Componente Card riutilizzabile
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Contenuto della card
 * @param {React.ReactNode|string} props.title - Titolo della card (può essere una stringa o un elemento React)
 * @param {string} props.className - Classi CSS aggiuntive (opzionale)
 */
const Card = ({ children, title, className = '' }) => {
    return (
        <div className={`mb-6 p-4 bg-white rounded-lg shadow ${className}`}>
            {title && (
                <div className="text-xl font-semibold mb-4">
                    {title}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;