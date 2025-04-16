// Funzioni di utilità per il simulatore SAS

/**
 * Formatta un valore numerico come valuta EUR
 * @param {number} value - Il valore da formattare
 * @returns {string} Il valore formattato come valuta
 */
export const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
    }).format(value);
};

/**
 * Calcola l'IRPEF in base agli scaglioni configurati
 * @param {number} reddito - Il reddito imponibile
 * @param {Array} scaglioniIrpef - Gli scaglioni IRPEF configurati
 * @returns {number} L'importo IRPEF calcolato
 */
export const calcolaIrpef = (reddito, scaglioniIrpef) => {
    let irpef = 0;
    let redditoRimanente = reddito;
    let scaglionePrecedente = 0;

    for (const scaglione of scaglioniIrpef) {
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
 * Calcola i costi dei buoni pasto e trasferte per i soci operativi
 * @param {Array} soci - Lista dei soci
 * @returns {number} Totale dei costi
 */
export const calcolaCostiSociOperativi = (soci) => {
    return soci.reduce((total, socio) => {
        if (socio.tipo !== "operativo") return total;

        // Calcola costo buoni pasto (deducibili al 75%)
        const costoBuoniPasto = socio.buoniPasto ?
            socio.giornateLavorate * socio.valoreBuoniPasto * 0.75 : 0;

        // Calcola costo trasferte
        const costoTrasferte = socio.trasferte ?
            socio.giorniTrasferta * socio.importoTrasfertaGiorno : 0;

        return total + costoBuoniPasto + costoTrasferte;
    }, 0);
};

/**
 * Crea un nuovo oggetto socio con valori predefiniti
 * @param {number} id - ID univoco per il socio
 * @param {string} nome - Nome del socio
 * @returns {Object} Oggetto socio
 */
export const creaNuovoSocio = (id, nome = null) => {
    return {
        id,
        nome: nome || `Socio ${id}`,
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
 * Calcola risultati fiscali per un socio
 * @param {Object} socio - Dati del socio
 * @param {number} utileDopoIrap - Utile dopo IRAP da distribuire
 * @param {number} aliquotaInps - Aliquota INPS
 * @param {Array} scaglioniIrpef - Scaglioni IRPEF
 * @param {number} aliqRegionale - Aliquota addizionale regionale
 * @param {number} aliqComunale - Aliquota addizionale comunale
 * @returns {Object} Risultati calcolati
 */
export const calcolaRisultatiSocio = (socio, utileDopoIrap, aliquotaInps, scaglioniIrpef, aliqRegionale, aliqComunale) => {
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
    const irpefNettoInps = calcolaIrpef(redditoImponibileDopoInps, scaglioniIrpef);

    // Calcolo addizionali regionali e comunali
    const addizionaleRegionale = redditoImponibileDopoInps * (aliqRegionale / 100);
    const addizionaleComunale = redditoImponibileDopoInps * (aliqComunale / 100);

    // Totale imposte
    const totaleImposte = irpefNettoInps + addizionaleRegionale + addizionaleComunale;

    // Netto percepito
    const nettoPercepito = quotaUtile - contributiInps - totaleImposte + importoBuoniPasto + importoTrasferte;

    return {
        socio,
        quotaUtile,
        importoBuoniPasto,
        importoTrasferte,
        contributiInps,
        irpef: irpefNettoInps,
        addizionaleRegionale,
        addizionaleComunale,
        totaleImposte,
        nettoPercepito
    };
};