/**
 * Utilities per la gestione dei dati di sessione
 * Copyright © 2025 Key-Code. Tutti i diritti riservati.
 */

/**
 * Ripristina lo stato iniziale (pulisce i cookie)
 * @param {Function} callback - Funzione da eseguire dopo il reset
 */
export const resetSession = (callback) => {
    // Cancella tutti i cookie relativi al simulatore
    document.cookie = 'sas-simulator-data=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';

    // Esegui la callback se fornita (es. per ricaricare la pagina o reimpostare lo stato)
    if (typeof callback === 'function') {
        callback();
    }
};

/**
 * Esporta i dati in formato JSON
 * @param {Object} data - Dati da esportare
 */
export const exportSessionData = (data) => {
    // Crea un oggetto Blob con i dati formattati
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

    // Crea un URL per il download
    const url = URL.createObjectURL(blob);

    // Crea un elemento di ancoraggio per il download
    const a = document.createElement('a');
    a.href = url;
    a.download = `sas-simulator-export-${new Date().toISOString().slice(0, 10)}.json`;

    // Aggiungi l'elemento al DOM, esegui il click e rimuovilo
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Rilascia l'URL
    URL.revokeObjectURL(url);
};

export const importSessionData = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        // Leggi il file come testo
        reader.readAsText(file);
        // Gestisci il caricamento del file
        reader.onload = () => {
            try {
                // Analizza i dati JSON
                const data = JSON.parse(reader.result);
                resolve(data);
            } catch (error) {
                reject(new Error('Errore durante l\'analisi dei dati JSON: ' + error.message));
            }
        };
        // Gestisci gli errori di lettura
        reader.onerror = () => {
            reject(new Error('Errore durante la lettura del file: ' + reader.error.message));
        };
    });
}