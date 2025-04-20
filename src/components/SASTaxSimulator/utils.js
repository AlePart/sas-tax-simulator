/**
 * Utility per il simulatore di tassazione SAS
 */

/**
 * Formatta un valore numerico come valuta euro
 * @param {number} value - Valore da formattare
 * @returns {string} Valore formattato come valuta
 */
export const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
    }).format(value);
};

/**
 * Crea un nuovo oggetto socio con valori predefiniti
 * @param {number} id - ID univoco del socio
 * @param {string} nome - Nome del socio
 * @returns {Object} Nuovo oggetto socio con proprietà predefinite
 */
export const creaNuovoSocio = (id, nome = "Nuovo Socio") => {
    return {
        id,
        nome,
        tipo: "operativo", // Default: socio operativo
        percentuale: 50,
        redditoEsterno: 0,
        giornateLavorate: 220,
        buoniPasto: false,
        valoreBuoniPasto: 8,
        buoniPastoEsentiFino: 8, // Soglia di esenzione buoni pasto, default 8€
        trasferte: false,
        giorniTrasferta: 0,
        importoTrasfertaGiorno: 50,
        trasfertaEsenteFino: 46.48 // Soglia di esenzione trasferte, default 46.48€
    };
};

/**
 * Calcola i costi legati ai soci operativi (buoni pasto e trasferte)
 * @param {Array} soci - Array di soci
 * @returns {Object} Costi totali e dettaglio costi esenti e non esenti
 */
export const calcolaCostiSociOperativi = (soci) => {
    let totaleCosti = 0;
    let costiBuoniPastoEsenti = 0;
    let costiBuoniPastoNonEsenti = 0;
    let costiTrasferteEsenti = 0;
    let costiTrasferteNonEsenti = 0;

    // Calcola i costi per i buoni pasto e trasferte
    soci.forEach(socio => {
        if (socio.tipo === "operativo") {
            // Calcolo buoni pasto
            if (socio.buoniPasto) {
                const totaleBuoniPasto = socio.valoreBuoniPasto * socio.giornateLavorate;
                // Gestione della soglia di esenzione per i buoni pasto
                const valoreBuonoGiornaliero = socio.valoreBuoniPasto;
                const sogliaBuono = socio.buoniPastoEsentiFino || 8; // Default 8€ se non specificato

                if (valoreBuonoGiornaliero <= sogliaBuono) {
                    // Se il valore è sotto la soglia, tutto è esente
                    costiBuoniPastoEsenti += totaleBuoniPasto;
                } else {
                    // Se supera la soglia, dividiamo tra esente e non esente
                    costiBuoniPastoEsenti += sogliaBuono * socio.giornateLavorate;
                    costiBuoniPastoNonEsenti += (valoreBuonoGiornaliero - sogliaBuono) * socio.giornateLavorate;
                }

                totaleCosti += totaleBuoniPasto;
            }

            // Calcolo trasferte
            if (socio.trasferte) {
                const totaleTrasferte = socio.importoTrasfertaGiorno * socio.giorniTrasferta;
                // Gestione della soglia di esenzione per le trasferte
                const valoreTrasferteGiornaliero = socio.importoTrasfertaGiorno;
                const sogliaTrasferte = socio.trasfertaEsenteFino || 46.48; // Default 46.48€ se non specificato

                if (valoreTrasferteGiornaliero <= sogliaTrasferte) {
                    // Se il valore è sotto la soglia, tutto è esente
                    costiTrasferteEsenti += totaleTrasferte;
                } else {
                    // Se supera la soglia, dividiamo tra esente e non esente
                    costiTrasferteEsenti += sogliaTrasferte * socio.giorniTrasferta;
                    costiTrasferteNonEsenti += (valoreTrasferteGiornaliero - sogliaTrasferte) * socio.giorniTrasferta;
                }

                totaleCosti += totaleTrasferte;
            }
        }
    });

    return {
        totale: totaleCosti,
        dettaglio: {
            buoniPastoEsenti: costiBuoniPastoEsenti,
            buoniPastoNonEsenti: costiBuoniPastoNonEsenti,
            trasferteEsenti: costiTrasferteEsenti,
            trasferteNonEsenti: costiTrasferteNonEsenti
        }
    };
};

/**
 * Calcola il reddito imponibile totale di un socio
 * @param {Object} socio - Oggetto socio
 * @param {number} quotaUtile - Quota di utile aziendale spettante
 * @param {number} importoBuoniPastoNonEsenti - Importo buoni pasto non esenti
 * @param {number} importoTrasferteNonEsenti - Importo rimborsi trasferta non esenti
 * @returns {number} Reddito imponibile totale
 */
const calcolaRedditoImponibileTotale = (socio, quotaUtile, importoBuoniPastoNonEsenti, importoTrasferteNonEsenti) => {
    // Reddito da SAS + Reddito esterno + Importi non esenti
    return quotaUtile + socio.redditoEsterno + importoBuoniPastoNonEsenti + importoTrasferteNonEsenti;
};

/**
 * Calcola i contributi INPS di un socio
 * @param {number} quotaUtile - Quota di utile aziendale spettante
 * @param {number} aliquotaInps - Aliquota INPS in percentuale
 * @returns {number} Contributi INPS
 */
const calcolaContributiInps = (quotaUtile, aliquotaInps) => {
    return quotaUtile * (aliquotaInps / 100);
};

/**
 * Calcola l'IRPEF sulla base degli scaglioni e del reddito imponibile
 * @param {number} redditoImponibile - Reddito imponibile totale
 * @param {Array} scaglioniIrpef - Array di scaglioni IRPEF
 * @returns {number} IRPEF da versare
 */
const calcolaIrpef = (redditoImponibile, scaglioniIrpef) => {
    let irpef = 0;
    let redditoRimanente = redditoImponibile;
    let scaglionePrecedente = 0;

    for (const scaglione of scaglioniIrpef) {
        if (redditoRimanente <= 0) break;

        const redditoScaglione = Math.min(
            redditoRimanente,
            scaglione.limite - scaglionePrecedente
        );

        irpef += redditoScaglione * (scaglione.aliquota / 100);
        redditoRimanente -= redditoScaglione;
        scaglionePrecedente = scaglione.limite;
    }

    return irpef;
};

/**
 * Calcola l'addizionale regionale sulla base dell'aliquota
 * @param {number} redditoImponibile - Reddito imponibile totale
 * @param {number} aliquota - Aliquota addizionale regionale
 * @returns {number} Addizionale regionale da versare
 */
const calcolaAddizionaleRegionale = (redditoImponibile, aliquota) => {
    return redditoImponibile * (aliquota / 100);
};

/**
 * Calcola l'addizionale comunale sulla base dell'aliquota
 * @param {number} redditoImponibile - Reddito imponibile totale
 * @param {number} aliquota - Aliquota addizionale comunale
 * @returns {number} Addizionale comunale da versare
 */
const calcolaAddizionaleComunale = (redditoImponibile, aliquota) => {
    return redditoImponibile * (aliquota / 100);
};

/**
 * Calcola i risultati fiscali di un socio
 * @param {Object} socio - Oggetto socio
 * @param {number} utileAziendale - Utile aziendale dopo IRAP
 * @param {number} aliquotaInps - Aliquota INPS in percentuale
 * @param {Array} scaglioniIrpef - Array di scaglioni IRPEF
 * @param {number} aliqRegionale - Aliquota addizionale regionale
 * @param {number} aliqComunale - Aliquota addizionale comunale
 * @returns {Object} Risultati fiscali per il socio
 */
export const calcolaRisultatiSocio = (
    socio,
    utileAziendale,
    aliquotaInps,
    scaglioniIrpef,
    aliqRegionale,
    aliqComunale
) => {
    // Calcola la quota di utile
    const quotaUtile = utileAziendale * (socio.percentuale / 100);

    // Calcola gli importi totali dei buoni pasto e trasferte
    let importoBuoniPasto = 0;
    let importoBuoniPastoEsenti = 0;
    let importoBuoniPastoNonEsenti = 0;
    let importoTrasferte = 0;
    let importoTrasferteEsenti = 0;
    let importoTrasferteNonEsenti = 0;

    if (socio.tipo === "operativo") {
        // Buoni pasto
        if (socio.buoniPasto) {
            const totaleBuoni = socio.valoreBuoniPasto * socio.giornateLavorate;
            importoBuoniPasto = totaleBuoni;

            // Calcola la parte esente e non esente
            const sogliaBuoni = socio.buoniPastoEsentiFino || 8; // Default 8€
            if (socio.valoreBuoniPasto <= sogliaBuoni) {
                importoBuoniPastoEsenti = totaleBuoni;
                importoBuoniPastoNonEsenti = 0;
            } else {
                importoBuoniPastoEsenti = sogliaBuoni * socio.giornateLavorate;
                importoBuoniPastoNonEsenti = (socio.valoreBuoniPasto - sogliaBuoni) * socio.giornateLavorate;
            }
        }

        // Trasferte
        if (socio.trasferte) {
            const totaleTrasferte = socio.importoTrasfertaGiorno * socio.giorniTrasferta;
            importoTrasferte = totaleTrasferte;

            // Calcola la parte esente e non esente
            const sogliaTrasferte = socio.trasfertaEsenteFino || 46.48; // Default 46.48€
            if (socio.importoTrasfertaGiorno <= sogliaTrasferte) {
                importoTrasferteEsenti = totaleTrasferte;
                importoTrasferteNonEsenti = 0;
            } else {
                importoTrasferteEsenti = sogliaTrasferte * socio.giorniTrasferta;
                importoTrasferteNonEsenti = (socio.importoTrasfertaGiorno - sogliaTrasferte) * socio.giorniTrasferta;
            }
        }
    }

    // Calcola contributi INPS
    const contributiInps = calcolaContributiInps(quotaUtile, aliquotaInps);

    // Calcola il reddito imponibile totale
    const redditoImponibileTotale = calcolaRedditoImponibileTotale(
        socio,
        quotaUtile,
        importoBuoniPastoNonEsenti,
        importoTrasferteNonEsenti
    );

    // Calcola IRPEF
    const irpef = calcolaIrpef(redditoImponibileTotale, scaglioniIrpef);

    // Calcola addizionali
    const addizionaleRegionale = calcolaAddizionaleRegionale(redditoImponibileTotale, aliqRegionale);
    const addizionaleComunale = calcolaAddizionaleComunale(redditoImponibileTotale, aliqComunale);

    // Calcola totale imposte
    const totaleImposte = contributiInps + irpef + addizionaleRegionale + addizionaleComunale;

    // Calcola il netto percepito
    // Quota utile - imposte + parte esente di buoni pasto e trasferte
    const nettoPercepito = quotaUtile - totaleImposte + importoBuoniPastoEsenti + importoTrasferteEsenti;

    return {
        socio,
        quotaUtile,
        importoBuoniPasto,
        importoBuoniPastoEsenti,
        importoBuoniPastoNonEsenti,
        importoTrasferte,
        importoTrasferteEsenti,
        importoTrasferteNonEsenti,
        contributiInps,
        redditoImponibileTotale,
        irpef,
        addizionaleRegionale,
        addizionaleComunale,
        totaleImposte,
        nettoPercepito
    };
};

/**
 * Calcola la somma totale di una proprietà per tutti i soci
 * @param {Array} risultatiSoci - Array di risultati dei soci
 * @param {string} proprieta - Proprietà da sommare
 * @returns {number} Somma totale della proprietà
 */
export const calcolaTotaleSoci = (risultatiSoci, proprieta) => {
    return risultatiSoci.reduce((acc, risultato) => acc + risultato[proprieta], 0);
};