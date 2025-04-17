import React, { useRef, useState } from 'react';

/**
 * Componente per l'importazione di una simulazione in formato JSON
 * @param {Object} props - Props del componente
 * @param {Function} props.onImport - Callback da chiamare quando viene importato un file valido
 */
const ImportSimulationButton = ({ onImport }) => {
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setError(null);

        if (!file) return;

        // Verifica il tipo di file
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            setError('Il file deve essere in formato JSON');
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // Validazione base dei dati importati
                if (!data.datiAzienda || !data.soci || !data.tassazione) {
                    setError('Il file non contiene una simulazione valida');
                    return;
                }

                // Invoca il callback con i dati importati
                onImport(data);

                // Reset del campo file
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } catch (err) {
                setError('Errore nella lettura del file: ' + err.message);
            }
        };

        reader.onerror = () => {
            setError('Errore nella lettura del file');
        };

        reader.readAsText(file);
    };

    return (
        <div className="relative">
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
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded text-sm cursor-pointer flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12" />
                </svg>
                Importa Simulazione
            </label>

            {error && (
                <div className="mt-2 text-sm text-red-600">
                    {error}
                </div>
            )}
        </div>
    );
};

export default ImportSimulationButton;