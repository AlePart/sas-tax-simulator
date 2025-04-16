import React from 'react';

/**
 * Componente per visualizzare un valore con label
 * @param {Object} props - Props del componente
 * @param {string} props.label - Label da visualizzare
 * @param {string|number} props.value - Valore da visualizzare
 * @param {string} props.bgColor - Colore di sfondo (default: bg-blue-50)
 * @param {string} props.className - Classi CSS aggiuntive
 */
const InfoBox = ({ label, value, bgColor = 'bg-blue-50', className = '' }) => {
    return (
        <div className={`p-3 ${bgColor} rounded ${className}`}>
            <span className="text-sm text-gray-600">{label}</span>
            <p className="text-lg font-semibold">{value}</p>
        </div>
    );
};

export default InfoBox;