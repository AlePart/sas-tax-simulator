/**
 * Utility per il simulatore di tassazione SAS
 * Copyright © 2025 Key-Code. Tutti i diritti riservati.
 */

/**
 * Formatta un valore numerico come valuta EUR
 * @param {number} value - Valore da formattare
 * @returns {string} Valore formattato
 */
export const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
    }).format(value);
};

/**
 * Calcola l'IRPEF in base agli scaglioni
 * @param {number} reddito - Reddito imponibile
 * @param {Array} scaglioni - Scaglioni IRPEF
 * @returns {number} Importo IRPEF
 */
export const calcolaIrpef = (reddito, scaglioni) => {
    let irpef = 0;
    let redditoRimanente = reddito;
    let scaglionePrecedente = 0;

    for (const scaglione of scaglioni) {
        const scaglioneAttuale = Math.min(redditoRimanente, scaglione.limite - scaglionePrecedente);

        if (scaglioneAttuale > 0) {
            irpef += scaglioneAttuale * (scaglione.aliquota / 100);
            redditoRimanente -= scaglioneAttuale;
        }

        if (redditoRimanente <= 0) break;
        scaglionePrecedente = scaglione.limite;
    }

    return irpef;
};

/**
 * Crea un nuovo socio con valori predefiniti
 * @param {number} id - ID del socio
 * @param {string} nome - Nome del socio
 * @returns {Object} Oggetto socio
 */
export const creaNuovoSocio = (id, nome = `Socio ${id}`) => {
    return {
        id,
        nome,
        tipo: "capitale",
        percentuale: 0,
        redditoEsterno: 0,
        giornateLavorate: 0,
        buoniPasto: false,
        valoreBuoniPasto: 0,
        buoniPastoEsentiFino: 8,
        trasferte: false,
        giorniTrasferta: 0,
        importoTrasfertaGiorno: 0,
        trasfertaEsenteFino: 46.48,
    };
};

/**
 * Calcola i costi dei soci operativi
 * @param {Array} soci - Lista dei soci
 * @returns {number} Totale costi
 */
export const calcolaCostiSociOperativi = (soci) => {
    return soci.reduce((total, socio) => {
        if (socio.tipo !== "operativo") return total;

        // Calcola costo buoni pasto (deducibili al 100%)
        const costoBuoniPasto = socio.buoniPasto ?
            socio.giornateLavorate * socio.valoreBuoniPasto : 0;

        // Calcola costo trasferte
        const costoTrasferte = socio.trasferte ?
            socio.giorniTrasferta * socio.importoTrasfertaGiorno : 0;

        return total + costoBuoniPasto + costoTrasferte;
    }, 0);
};

/**
 * Calcola i risultati per un socio
 * @param {Object} socio - Dati del socio
 * @param {number} utileDopoIrap - Utile dopo IRAP
 * @param {number} aliquotaInps - Aliquota INPS
 * @param {Array} scaglioniIrpef - Scaglioni IRPEF
 * @param {number} aliqRegionale - Aliquota regionale
 * @param {number} aliqComunale - Aliquota comunale
 * @returns {Object} Risultati calcolati
 */
export const calcolaRisultatiSocio = (
    socio,
    utileDopoIrap,
    aliquotaInps,
    scaglioniIrpef,
    aliqRegionale,
    aliqComunale
) => {
    // Calcola quota utile in base alla percentuale di partecipazione
    const quotaUtile = (utileDopoIrap * socio.percentuale) / 100;

    // Calcola importo buoni pasto
    const importoBuoniPasto = socio.tipo === "operativo" && socio.buoniPasto ?
        socio.giornateLavorate * socio.valoreBuoniPasto : 0;

    // Calcola rimborsi trasferta
    const importoTrasferte = socio.tipo === "operativo" && socio.trasferte ?
        socio.giorniTrasferta * socio.importoTrasfertaGiorno : 0;

    // Calcola imponibile contributivo INPS
    const imponibileInps = socio.tipo === "operativo" ? quotaUtile : 0;
    const contributiInps = imponibileInps * (aliquotaInps / 100);

    // Calcola imponibile IRPEF
    const redditoComplessivo = quotaUtile + socio.redditoEsterno;

    // Deduzioni per contributi INPS (totalmente deducibili)
    const redditoImponibileDopoInps = redditoComplessivo - contributiInps;

    // Calcola IRPEF usando la funzione con gli scaglioni configurabili
    const irpef = calcolaIrpef(redditoImponibileDopoInps, scaglioniIrpef);

    // Calcolo addizionali regionali e comunali
    const addizionaleRegionale = redditoImponibileDopoInps * (aliqRegionale / 100);
    const addizionaleComunale = redditoImponibileDopoInps * (aliqComunale / 100);

    // Totale imposte
    const totaleImposte = irpef + addizionaleRegionale + addizionaleComunale;

    // Netto percepito
    const nettoPercepito = quotaUtile - contributiInps - totaleImposte + importoBuoniPasto + importoTrasferte;

    return {
        socio,
        quotaUtile,
        importoBuoniPasto,
        importoTrasferte,
        contributiInps,
        irpef,
        addizionaleRegionale,
        addizionaleComunale,
        totaleImposte,
        nettoPercepito
    };
};