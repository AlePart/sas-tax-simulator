/**
 * Utility per il salvataggio automatico dei dati dell'applicazione
 * Questo modulo implementa una soluzione robusta per salvare e recuperare
 * automaticamente i dati di configurazione del simulatore SAS
 */

// Chiave usata per salvare i dati nel localStorage
const STORAGE_KEY = 'sas-simulator-data';

/**
 * Salva i dati nel localStorage
 * 
 * @param {Object} data - Dati da salvare
 * @returns {boolean} - true se il salvataggio è riuscito, false altrimenti
 */
export const saveData = (data) => {
    try {
        // Aggiungiamo un timestamp per tracciare quando i dati sono stati salvati
        const dataToSave = {
            ...data,
            _lastSaved: new Date().toISOString()
        };

        // Serializziamo i dati in formato JSON
        const serializedData = JSON.stringify(dataToSave);

        // Salviamo i dati nel localStorage
        localStorage.setItem(STORAGE_KEY, serializedData);

        console.log('Dati salvati con successo:', new Date().toLocaleTimeString());
        return true;
    } catch (error) {
        // Gestione degli errori
        console.error('Errore durante il salvataggio dei dati:', error);

        // In caso di errore di quota (localStorage pieno), proviamo a salvare solo i dati essenziali
        if (error.name === 'QuotaExceededError') {
            try {
                const essentialData = {
                    fatturato: data.fatturato,
                    costi: data.costi,
                    aliquotaIrap: data.aliquotaIrap,
                    aliquotaInps: data.aliquotaInps,
                    _lastSaved: new Date().toISOString(),
                    _reduced: true
                };

                localStorage.setItem(STORAGE_KEY, JSON.stringify(essentialData));
                console.warn('Salvati solo i dati essenziali a causa di spazio insufficiente');
                return true;
            } catch (e) {
                console.error('Impossibile salvare anche i dati essenziali:', e);
            }
        }

        return false;
    }
};

/**
 * Recupera i dati dal localStorage
 * 
 * @returns {Object|null} - Dati recuperati o null se non disponibili
 */
export const loadData = () => {
    try {
        // Recuperiamo i dati dal localStorage
        const serializedData = localStorage.getItem(STORAGE_KEY);

        // Se non ci sono dati, ritorniamo null
        if (!serializedData) {
            console.log('Nessun dato salvato trovato');
            return null;
        }

        // Deserializziamo i dati
        const data = JSON.parse(serializedData);

        console.log('Dati caricati con successo. Ultimo salvataggio:',
            data._lastSaved ? new Date(data._lastSaved).toLocaleString() : 'data sconosciuta');

        // Se i dati erano stati ridotti per problemi di spazio, informiamo l'utente
        if (data._reduced) {
            console.warn('Sono stati caricati solo i dati essenziali (salvataggio ridotto)');
        }

        return data;
    } catch (error) {
        console.error('Errore durante il caricamento dei dati:', error);

        // In caso di errori di parsing, proviamo a ripulire il localStorage
        try {
            localStorage.removeItem(STORAGE_KEY);
            console.warn('Dati corrotti rimossi dal localStorage');
        } catch (e) {
            // Ignoriamo eventuali errori nella pulizia
        }

        return null;
    }
};

/**
 * Cancella i dati salvati
 * 
 * @returns {boolean} - true se la cancellazione è riuscita, false altrimenti
 */
export const clearData = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('Dati cancellati con successo');
        return true;
    } catch (error) {
        console.error('Errore durante la cancellazione dei dati:', error);
        return false;
    }
};

/**
 * Controlla se il localStorage è disponibile
 * 
 * @returns {boolean} - true se disponibile, false altrimenti
 */
export const isStorageAvailable = () => {
    try {
        const testKey = '__test_storage__';
        localStorage.setItem(testKey, testKey);
        const result = localStorage.getItem(testKey) === testKey;
        localStorage.removeItem(testKey);
        return result;
    } catch (e) {
        return false;
    }
};

// Versione di fallback per i cookie quando localStorage non è disponibile
const setCookie = (name, value, days = 30) => {
    try {
        const jsonValue = JSON.stringify(value);
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${encodeURIComponent(jsonValue)};expires=${d.toUTCString()};path=/`;
        return true;
    } catch (error) {
        console.error('Errore durante il salvataggio del cookie:', error);
        return false;
    }
};

const getCookie = (name) => {
    try {
        const cookieArr = document.cookie.split(";");
        for (let i = 0; i < cookieArr.length; i++) {
            const cookiePair = cookieArr[i].split("=");
            const cookieName = cookiePair[0].trim();
            if (cookieName === name) {
                const decodedValue = decodeURIComponent(cookiePair[1]);
                return JSON.parse(decodedValue);
            }
        }
        return null;
    } catch (error) {
        console.error('Errore durante la lettura del cookie:', error);
        return null;
    }
};

/**
 * API unificata che usa localStorage se disponibile, altrimenti cookie
 */
export const saveAutoData = (data) => {
    if (isStorageAvailable()) {
        return saveData(data);
    } else {
        return setCookie(STORAGE_KEY, data);
    }
};

export const loadAutoData = () => {
    if (isStorageAvailable()) {
        return loadData();
    } else {
        return getCookie(STORAGE_KEY);
    }
};

export const clearAutoData = () => {
    try {
        // Pulizia di localStorage
        if (isStorageAvailable()) {
            localStorage.removeItem(STORAGE_KEY);
        }

        // Pulizia dei cookie (indipendentemente dalla disponibilità di localStorage)
        document.cookie = `${STORAGE_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;

        // Per compatibilità con versioni precedenti, proviamo anche con il nome del cookie originale
        document.cookie = `sas-simulator-data=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;

        console.log('Dati cancellati con successo da localStorage e cookie');
        return true;
    } catch (error) {
        console.error('Errore durante la cancellazione dei dati:', error);
        return false;
    }
};