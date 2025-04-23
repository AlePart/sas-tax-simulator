/**
 * Utility per la gestione dei cookie
 */

/**
 * Imposta un cookie con i dati specificati
 * @param {string} name - Nome del cookie
 * @param {object} value - Valore da salvare (verrà convertito in JSON)
 * @param {number} days - Giorni di validità del cookie (default: 30)
 */
export const setCookie = (name, value, days = 30) => {
    try {
        // Converti l'oggetto in una stringa JSON
        const jsonValue = JSON.stringify(value);

        // Calcola la data di scadenza
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));

        // Imposta il cookie
        document.cookie = `${name}=${encodeURIComponent(jsonValue)};expires=${d.toUTCString()};path=/`;

        return true;
    } catch (error) {
        console.error('Errore durante il salvataggio del cookie:', error);
        return false;
    }
};

/**
 * Ottiene il valore di un cookie
 * @param {string} name - Nome del cookie da leggere
 * @returns {object|null} - Valore del cookie o null se non trovato
 */
export const getCookie = (name) => {
    try {
        // Cerca il cookie nel documento
        const cookieArr = document.cookie.split(";");

        // Cerca il cookie con il nome specificato
        for (let i = 0; i < cookieArr.length; i++) {
            const cookiePair = cookieArr[i].split("=");
            const cookieName = cookiePair[0].trim();

            if (cookieName === name) {
                // Decodifica il valore e converte da JSON a oggetto JavaScript
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
 * Elimina un cookie
 * @param {string} name - Nome del cookie da eliminare
 */
export const deleteCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};