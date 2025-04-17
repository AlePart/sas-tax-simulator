import React, { useRef, useState } from 'react';
import { resetSession, exportSessionData } from '../../utils/sessionUtils';

/**
 * Controlli per la gestione della sessione
 */
const SessionControls = ({ simulationData, onImportData }) => {
    const [importError, setImportError] = useState(null);
    const fileInputRef = useRef(null);

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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImportError(null);

        if (!file) return;

        // Verifica il tipo di file
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            setImportError('Il file deve essere in formato JSON');
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // Validazione base dei dati importati
                if (!data.datiAzienda || !data.soci || !data.tassazione) {
                    setImportError('Il file non contiene una simulazione valida');
                    return;
                }

                // Invoca il callback con i dati importati
                if (typeof onImportData === 'function') {
                    onImportData(data);
                }

                // Reset del campo file
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } catch (err) {
                setImportError('Errore nella lettura del file: ' + err.message);
            }
        };

        reader.onerror = () => {
            setImportError('Errore nella lettura del file');
        };

        reader.readAsText(file);
    };

    return (
        <div className="fixed bottom-4 right-4 flex flex-col space-y-2 items-end print:hidden">
            {importError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded text-xs mb-1">
                    {importError}
                </div>
            )}

            <div className="flex space-x-2">
                <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileChange}
                    className="sr-only"
                    ref={fileInputRef}
                    id="import-simulation-file"
                />
                <label
                    htmlFor="import-simulation-file"
                    className="bg-green-500 text-white text-xs py-1 px-2 rounded hover:bg-green-600 transition-colors shadow-md cursor-pointer"
                    title="Importa dati"
                >
                    Importa Dati
                </label>

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
        </div>
    );
};

export default SessionControls;