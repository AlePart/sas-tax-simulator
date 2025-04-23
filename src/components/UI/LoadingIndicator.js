import React from 'react';

/**
 * Componente per visualizzare un indicatore di caricamento con una barra di progresso
 * @param {Object} props - Props del componente
 * @param {number} props.progress - Percentuale di caricamento (0-100)
 * @param {string} props.message - Messaggio da mostrare durante il caricamento
 * @param {boolean} props.isIndeterminate - Se true, mostra una barra indeterminata
 */
const LoadingIndicator = ({
    progress = 0,
    message = "Caricamento in corso...",
    isIndeterminate = false
}) => {
    return (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold text-blue-800 mb-4 text-center">
                    {message}
                </h2>

                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    {isIndeterminate ? (
                        <div className="h-full bg-blue-500 rounded-full animate-pulse"
                            style={{ width: '100%' }}></div>
                    ) : (
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(5, Math.min(progress, 100))}%` }}></div>
                    )}
                </div>

                {!isIndeterminate && (
                    <div className="text-right mt-1 text-sm text-gray-600">
                        {Math.round(progress)}%
                    </div>
                )}

                <div className="text-center mt-4 text-sm text-gray-500">
                    Simulatore Tassazione SAS | Key-Code
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;