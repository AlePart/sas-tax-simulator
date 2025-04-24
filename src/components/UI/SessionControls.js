import React, { useState } from 'react';
import { deleteAutoData, saveAutoData } from '../../utils/autoSaveUtils';
import { loadAutoData } from '../../utils/autoSaveUtils';

/**
 * Componente per i controlli di gestione della sessione
 * @param {Object} props
 * @param {Object} props.simulationData - Dati completi della simulazione
 * @param {Function} props.onReset - Funzione chiamata quando si resetta la simulazione
 * @param {Function} props.onResetComplete - Callback eseguito al completamento del reset
 */
const SessionControls = ({ simulationData, onReset, onResetComplete, onDataRestored }) => {
    const [showConfirmReset, setShowConfirmReset] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleImport = (event) => {
        const file = event.target.files[0];
        console.log('File selezionato:', file);
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    // Qui puoi gestire i dati importati come preferisci
                    console.log('Dati importati:', data);
                    deleteAutoData();
                    saveAutoData(data);
                    onDataRestored(data);
                    

                } catch (error) {
                    console.error('Errore durante l\'importazione dei dati:', error);
                    alert('Si è verificato un errore durante l\'importazione dei dati.');
                }
            };
            // Leggi il file come testo
            reader.readAsText(file);
            
        }
        ;
    };
    // Gestione dell'esportazione dati in formato JSON
    const handleExport = () => {
        setIsExporting(true);

        try {
            // Crea un blob JSON con i dati della simulazione
            console.log('Dati da esportare:', loadAutoData());
            const dataStr = JSON.stringify(loadAutoData(), null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            // Crea e simula il click su un link di download
            const link = document.createElement('a');
            link.href = url;
            link.download = `simulazione-sas-${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Errore durante l\'esportazione dei dati:', error);
            alert('Si è verificato un errore durante l\'esportazione dei dati.');
        } finally {
            setIsExporting(false);
        }
    };

    // Gestione del reset dei dati
    const handleReset = () => {
        if (showConfirmReset) {

            // Nascondi il dialogo di conferma
            setShowConfirmReset(false);

            // Notifica al genitore che il reset è completato
            if (onResetComplete) {

                deleteAutoData();
                onResetComplete();
                // reload default data
                onReset();
            }
        } else {
            // Mostra il dialogo di conferma
            setShowConfirmReset(true);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md py-3 px-6 flex justify-between items-center">
            <div className="flex space-x-2">
                <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow disabled:opacity-50"
                >
                    {isExporting ? 'Esportazione...' : 'Esporta Dati'}
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
                    onClick={() => {
                        document.getElementById('fileInput').click();

                    }
                    }

                >
                Importa Dati
                </button>
                <input
                    type="file"
                    id="fileInput"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                />
                <button
                    onClick={handleReset}
                    className={`${showConfirmReset
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-gray-500 hover:bg-gray-600'
                        } text-white px-4 py-2 rounded shadow`}
                >
                    {showConfirmReset
                        ? 'Conferma Reset'
                        : 'Reset Dati'}
                </button>
            </div>

            {showConfirmReset && (
                <div className="text-sm text-red-500 ml-2">
                    Attenzione: questa operazione canceller&agrave; tutti i dati inseriti.
                </div>
            )}

            <div className="text-xs text-gray-500">
                Versione {simulationData.versione}
            </div>
        </div>
    );
};

export default SessionControls;