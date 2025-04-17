import React from 'react';
import ImportSimulationButton from './ImportSimulationButton';

/**
 * Componente per il controllo della sessione (salvataggio, caricamento, reset)
 * @param {Object} props - Props del componente
 * @param {Object} props.simulationData - Dati completi della simulazione
 * @param {Function} props.onImportData - Callback per caricare i dati importati
 * @param {Function} props.onResetSession - Callback per resettare la sessione
 */
const SessionControls = ({ simulationData, onImportData, onResetSession }) => {
    // Funzione per esportare i dati come file JSON
    const handleExport = () => {
        // Crea un oggetto Blob con i dati JSON
        const dataStr = JSON.stringify(simulationData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });

        // Crea un URL per il blob
        const url = URL.createObjectURL(blob);

        // Crea un link temporaneo e avvia il download
        const link = document.createElement('a');
        link.href = url;
        link.download = `simulazione-sas-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();

        // Pulisce dopo il download
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    };

    // Gestisce l'importazione dei dati
    const handleImport = (importedData) => {
        if (typeof onImportData === 'function') {
            onImportData(importedData);
        }
    };

    // Gestisce il reset della sessione
    const handleReset = () => {
        if (window.confirm('Sei sicuro di voler resettare tutti i dati della simulazione?')) {
            if (typeof onResetSession === 'function') {
                onResetSession();
            }
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md p-3 flex justify-center space-x-4 z-10">
            <button
                onClick={handleExport}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded text-sm flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Esporta Simulazione
            </button>

            <ImportSimulationButton onImport={handleImport} />

            <button
                onClick={handleReset}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded text-sm flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
            </button>
        </div>
    );
};

export default SessionControls;