/**
 * Utility per il salvataggio automatico dei dati dell'applicazione
 * Questo modulo implementa una soluzione robusta per salvare e recuperare
 * automaticamente i dati di configurazione del simulatore SAS
 */
import { setCookie, getCookie, deleteCookie } from './cookieUtils';
// Chiave usata per salvare i dati nel localStorage
const STORAGE_KEY = 'sas-simulator-data';


export const saveAutoData = (data) => {
    try {
        // Prova a salvare i dati nel cookie
        const success = setCookie(STORAGE_KEY, data, 30); // Salva per 30 giorni
        if (success) {
            console.log('Dati salvati con successo nel cookie');
            return true;
        } else {
            console.error('Errore durante il salvataggio dei dati nel cookie');
        }
    } catch (error) {
        console.error('Errore durante il salvataggio dei dati nel cookie:', error);
    }

};

export const loadAutoData = () => {
    try {
        // Prova a recuperare i dati dal cookie
        const data = getCookie(STORAGE_KEY);
        if (data) {
            return data;
        } else {
            console.warn('Nessun dato trovato nel cookie');
            return null;
        }
    }
        catch (error) {
            console.error('Errore durante il recupero dei dati dal cookie:', error);
            return null;
        }

};

export const deleteAutoData = () => {
    try {
        // Prova a eliminare i dati dal cookie
        deleteCookie(STORAGE_KEY);
        console.log('Dati eliminati con successo dal cookie');
        return true;
    } catch (error) {
        console.error('Errore durante l\'eliminazione dei dati dal cookie:', error);
        return false;
    }
};






