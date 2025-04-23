import React from 'react';

/**
 * Componente per visualizzare un indicatore di caricamento circolare
 * @param {Object} props - Props del componente
 * @param {string} props.size - Dimensione dello spinner (small, medium, large)
 * @param {string} props.color - Colore dello spinner (primary, secondary, white)
 */
const LoadingSpinner = ({
    size = 'medium',
    color = 'primary'
}) => {
    // Determina le classi in base alla dimensione
    let sizeClasses = 'w-8 h-8'; // default: medium
    if (size === 'small') {
        sizeClasses = 'w-5 h-5';
    } else if (size === 'large') {
        sizeClasses = 'w-12 h-12';
    }

    // Determina le classi in base al colore
    let colorClasses = 'text-blue-600'; // default: primary
    if (color === 'secondary') {
        colorClasses = 'text-gray-600';
    } else if (color === 'white') {
        colorClasses = 'text-white';
    }

    return (
        <div className="flex justify-center items-center">
            <div className={`${sizeClasses} ${colorClasses} animate-spin`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            </div>
        </div>
    );
};

export default LoadingSpinner;