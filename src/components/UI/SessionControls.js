import React from 'react';
import { resetSession, exportSessionData } from '../../utils/sessionUtils';

/**
 * Controlli per la gestione della sessione
 */
const SessionControls = ({ simulationData }) => {
    const handleReset = () => {
        if (window.confirm('Sei sicuro di voler cancellare tutti i dati? Questa azione non può essere annullata.')) {
            resetSession(() => {
                window.location.reload();
            });
        }
    };

    const handleExport = () => {
        exportSessionData(simulationData);
    };

    return (
        <div className="fixed bottom-4 right-4 flex space-x-2 print:hidden">
            <button
                onClick={handleExport}
                className="bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600 transition-colors shadow-md"
                title="Esporta dati"
            >
                Esporta Dati
            </button>
            <button
                onClick={handleReset}
                className="bg-red-500 text-white text-xs py-1 px-2 rounded hover:bg-red-600 transition-colors shadow-md"
                title="Cancella tutti i dati"
            >
                Reset
            </button>
        </div>
    );
};

export default SessionControls;