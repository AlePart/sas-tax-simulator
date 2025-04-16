/**
 * Utilities per la gestione dei cookie
 * Copyright © 2025 Key-Code. Tutti i diritti riservati.
 */

/**
 * Salva i dati nei cookie
 * @param {string} name - Nome del cookie
 * @param {Object} value - Valore da salvare
 * @param {number} days - Giorni di validità del cookie
 */
export const setCookie = (name, value, days = 365) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${JSON.stringify(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

/**
 * Recupera i dati dai cookie
 * @param {string} name - Nome del cookie
 * @returns {Object|null} Valore recuperato o null se non trovato
 */
export const getCookie = (name) => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            try {
                return JSON.parse(c.substring(nameEQ.length, c.length));
            } catch (e) {
                return null;
            }
        }
    }
    return null;
};

/**
 * Cancella un cookie
 * @param {string} name - Nome del cookie da cancellare
 */
export const deleteCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
};