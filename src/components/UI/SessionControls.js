import React, { useState } from 'react';

/**
 * Componente per il controllo della sessione di simulazione
 * Consente di salvare manualmente, esportare e ripristinare i dati della simulazione
 * 
 * @param {Object} props - Props del componente
 * @param {Object} props.simulationData - Dati completi della simulazione corrente
 * @param {Function} props.onSave - Funzione per salvare manualmente i dati
 * @param {Function} props.onReset - Funzione per cancellare i dati salvati
 */
const SessionControls = ({ simulationData, onSave, onReset }) => {
    const [message, setMessage] = useState(null);

    /**
     * Mostra un messaggio temporaneo all'utente
     * @param {string} text - Testo del messaggio
     * @param {string} type - Tipo di messaggio ('success', 'error', 'info')
     */
    const showMessage = (text, type = 'info') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };


    /**
     * Esporta i dati della simulazione come file JSON
     */
    const esportaSimulazione = () => {
        try {
            // Crea un Blob con i dati
            const jsonData = JSON.stringify(simulationData, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });

            // Crea un URL per il blob
            const url = URL.createObjectURL(blob);

            // Crea un elemento link per scaricare il file
            const a = document.createElement('a');
            a.href = url;
            a.download = `simulazione-sas-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();

            // Rilascia l'URL
            URL.revokeObjectURL(url);

            showMessage('Simulazione esportata come file.', 'success');
        } catch (error) {
            console.error('Errore durante l\'esportazione:', error);
            showMessage('Errore durante l\'esportazione.', 'error');
        }
    };

    /**
     * Reset ai valori predefiniti
     */
    const resetSimulazione = () => {
        if (window.confirm('Sei sicuro di voler resettare la simulazione? Tutti i dati inseriti andranno persi.')) {
            try {
                // Elimina i dati salvati da localStorage e cookie
                onReset();

                // Elimina anche il cookie con il nome originale (per compatibilità)
                document.cookie = `sas-simulator-data=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;

                showMessage('Simulazione reimpostata ai valori predefiniti.', 'info');

                // Attendi un momento per mostrare il messaggio prima del reload
                setTimeout(() => {
                    // Ricarica la pagina per reinizializzare lo stato
                    window.location.reload();
                }, 1500);
            } catch (error) {
                console.error('Errore durante il reset:', error);
                showMessage('Errore durante il reset. Prova a ricaricare la pagina manualmente.', 'error');
            }
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-2 shadow-lg border-t z-10 flex justify-center">
            {/* Contenitore per il messaggio */}
            {message && (
                <div className={`fixed bottom-16 left-1/2 transform -translate-x-1/2 p-3 rounded-md shadow-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' :
                        message.type === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    onClick={esportaSimulazione}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                    title="Esporta simulazione come file JSON"
                >
                    Esporta
                </button>

                <button
                    onClick={resetSimulazione}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                    title="Reimposta ai valori predefiniti"
                >
                    Reset
                </button>
            </div>

            {/* Indicatore di autosalvataggio */}
            <div className="absolute left-2 bottom-2 text-xs text-gray-500">
                Autosalvataggio attivo
            </div>
        </div>
    );

};



export default SessionControls;