import { useState } from 'react';

function SASTaxSimulator() {
    const [fatturato, setFatturato] = useState(100000);
    const [costi, setCosti] = useState(40000);
    const [aliquotaIres, setAliquotaIres] = useState(24);
    const [aliquotaInps, setAliquotaInps] = useState(23.1);
    const [soci, setSoci] = useState([
        {
            id: 1,
            nome: "Mario Rossi",
            tipo: "operativo", // operativo o capitale
            percentuale: 60,
            redditoEsterno: 0,
            giornateLavorate: 220,
            buoniPasto: true,
            valoreBuoniPasto: 8, // valore giornaliero
            buoniPastoEsentiFino: 8, // soglia esenzione
            trasferte: true,
            giorniTrasferta: 30,
            importoTrasfertaGiorno: 50,
            trasfertaEsenteFino: 46.48, // soglia esenzione
        },
        {
            id: 2,
            nome: "Giulia Bianchi",
            tipo: "capitale",
            percentuale: 40,
            redditoEsterno: 30000,
            giornateLavorate: 0,
            buoniPasto: false,
            valoreBuoniPasto: 0,
            buoniPastoEsentiFino: 8,
            trasferte: false,
            giorniTrasferta: 0,
            importoTrasfertaGiorno: 0,
            trasfertaEsenteFino: 46.48,
        }
    ]);

    // Configurazione degli scaglioni IRPEF (editabili)
    const [scaglioniIrpef, setScaglioniIrpef] = useState([
        { limite: 15000, aliquota: 23 },
        { limite: 28000, aliquota: 25 },
        { limite: 50000, aliquota: 35 },
        { limite: Infinity, aliquota: 43 }
    ]);

    const [aliqRegionale, setAliqRegionale] = useState(1.73);
    const [aliqComunale, setAliqComunale] = useState(0.8);

    const aggiungiSocio = () => {
        const nuovoSocio = {
            id: soci.length + 1,
            nome: `Socio ${soci.length + 1}`,
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
        setSoci([...soci, nuovoSocio]);
    };

    const rimuoviSocio = (id) => {
        setSoci(soci.filter(socio => socio.id !== id));
    };

    const updateSocio = (id, campo, valore) => {
        setSoci(soci.map(socio => {
            if (socio.id === id) {
                return { ...socio, [campo]: valore };
            }
            return socio;
        }));
    };

    // Funzione per calcolare l'IRPEF in base agli scaglioni configurati
    const calcolaIrpef = (reddito) => {
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

    // Calcola l'utile aziendale
    const utileAziendale = fatturato - costi;

    // Calcola IRES sulla percentuale impostata
    const ires = utileAziendale * (aliquotaIres / 100);

    // Utile dopo IRES
    const utileDopoIres = utileAziendale - ires;

    // Calcola risultati per ciascun socio
    const risultatiSoci = soci.map(socio => {
        // Calcola quota utile in base alla percentuale di partecipazione
        const quotaUtile = (utileDopoIres * socio.percentuale) / 100;

        // Calcola importo buoni pasto
        const importoBuoniPasto = socio.buoniPasto ? socio.giornateLavorate * socio.valoreBuoniPasto : 0;
        const buoniPastoImponibili = socio.buoniPasto && socio.valoreBuoniPasto > socio.buoniPastoEsentiFino ?
            socio.giornateLavorate * (socio.valoreBuoniPasto - socio.buoniPastoEsentiFino) : 0;

        // Calcola rimborsi trasferta
        const importoTrasferte = socio.trasferte ? socio.giorniTrasferta * socio.importoTrasfertaGiorno : 0;
        const trasferteImponibili = socio.trasferte && socio.importoTrasfertaGiorno > socio.trasfertaEsenteFino ?
            socio.giorniTrasferta * (socio.importoTrasfertaGiorno - socio.trasfertaEsenteFino) : 0;

        // Calcola imponibile contributivo INPS
        const imponibileInps = socio.tipo === "operativo" ? quotaUtile + buoniPastoImponibili + trasferteImponibili : 0;
        const contributiInps = imponibileInps * (aliquotaInps / 100);

        // Calcola imponibile IRPEF
        const redditoComplessivo = quotaUtile + socio.redditoEsterno + buoniPastoImponibili + trasferteImponibili;

        // Deduzioni per contributi INPS (totalmente deducibili)
        const redditoImponibileDopoInps = redditoComplessivo - contributiInps;

        // Calcola IRPEF usando la funzione con gli scaglioni configurabili
        const irpefNettoInps = calcolaIrpef(redditoImponibileDopoInps);

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
    });

    const totalPercentuale = soci.reduce((acc, socio) => acc + Number(socio.percentuale), 0);

    // Aggiorna uno scaglione IRPEF
    const updateScaglioneIrpef = (index, campo, valore) => {
        const nuoviScaglioni = [...scaglioniIrpef];
        nuoviScaglioni[index] = { ...nuoviScaglioni[index], [campo]: valore };
        setScaglioniIrpef(nuoviScaglioni);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto bg-gray-50">
            <h1 className="text-2xl font-bold mb-6 text-blue-800">Simulatore Tassazione SAS</h1>

            <div className="mb-6 p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Dati Aziendali</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fatturato Aziendale (�)
                        </label>
                        <input
                            type="number"
                            value={fatturato}
                            onChange={(e) => setFatturato(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Costi Aziendali (�)
                        </label>
                        <input
                            type="number"
                            value={costi}
                            onChange={(e) => setCosti(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Aliquota IRES (%)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={aliquotaIres}
                            onChange={(e) => setAliquotaIres(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Aliquota INPS (%)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={aliquotaInps}
                            onChange={(e) => setAliquotaInps(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-blue-50 rounded">
                        <span className="text-sm text-gray-600">Utile Aziendale:</span>
                        <p className="text-lg font-semibold">{utileAziendale.toLocaleString('it-IT')} �</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                        <span className="text-sm text-gray-600">IRES ({aliquotaIres}%):</span>
                        <p className="text-lg font-semibold">{ires.toLocaleString('it-IT')} �</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                        <span className="text-sm text-gray-600">Utile dopo IRES:</span>
                        <p className="text-lg font-semibold">{utileDopoIres.toLocaleString('it-IT')} �</p>
                    </div>
                </div>
            </div>

            <div className="mb-6 p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Configurazione Tassazione</h2>

                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Scaglioni IRPEF</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {scaglioniIrpef.map((scaglione, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Limite (�)</label>
                                    <input
                                        type="number"
                                        value={scaglione.limite === Infinity ? 999999999 : scaglione.limite}
                                        onChange={(e) => updateScaglioneIrpef(index, 'limite', e.target.value === '999999999' ? Infinity : Number(e.target.value))}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        disabled={index === scaglioniIrpef.length - 1}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Aliquota (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={scaglione.aliquota}
                                        onChange={(e) => updateScaglioneIrpef(index, 'aliquota', Number(e.target.value))}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Addizionale Regionale (%)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={aliqRegionale}
                            onChange={(e) => setAliqRegionale(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Addizionale Comunale (%)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={aliqComunale}
                            onChange={(e) => setAliqComunale(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold">Soci</h2>
                    <button
                        onClick={aggiungiSocio}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                        Aggiungi Socio
                    </button>
                </div>

                {totalPercentuale !== 100 && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                        Attenzione: La somma delle percentuali di partecipazione � {totalPercentuale}%. Il totale deve essere 100%.
                    </div>
                )}

                {soci.map((socio) => (
                    <div key={socio.id} className="mb-6 p-4 bg-white rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">{socio.nome}</h3>
                            <button
                                onClick={() => rimuoviSocio(socio.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                            >
                                Rimuovi
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome Socio
                                </label>
                                <input
                                    type="text"
                                    value={socio.nome}
                                    onChange={(e) => updateSocio(socio.id, 'nome', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo Socio
                                </label>
                                <select
                                    value={socio.tipo}
                                    onChange={(e) => updateSocio(socio.id, 'tipo', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="operativo">Socio Operativo</option>
                                    <option value="capitale">Socio di Capitale</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Percentuale di Partecipazione (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={socio.percentuale}
                                    onChange={(e) => updateSocio(socio.id, 'percentuale', Number(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reddito Esterno (�)
                                </label>
                                <input
                                    type="number"
                                    value={socio.redditoEsterno}
                                    onChange={(e) => updateSocio(socio.id, 'redditoEsterno', Number(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Giornate Lavorate
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="365"
                                    value={socio.giornateLavorate}
                                    onChange={(e) => updateSocio(socio.id, 'giornateLavorate', Number(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={socio.buoniPasto}
                                        onChange={(e) => updateSocio(socio.id, 'buoniPasto', e.target.checked)}
                                        className="mr-2"
                                    />
                                    Buoni Pasto
                                </label>
                                {socio.buoniPasto && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs text-gray-600">Valore (�/giorno)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={socio.valoreBuoniPasto}
                                                onChange={(e) => updateSocio(socio.id, 'valoreBuoniPasto', Number(e.target.value))}
                                                className="w-full p-2 border border-gray-300 rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600">Esente fino a (�)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={socio.buoniPastoEsentiFino}
                                                onChange={(e) => updateSocio(socio.id, 'buoniPastoEsentiFino', Number(e.target.value))}
                                                className="w-full p-2 border border-gray-300 rounded"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={socio.trasferte}
                                        onChange={(e) => updateSocio(socio.id, 'trasferte', e.target.checked)}
                                        className="mr-2"
                                    />
                                    Rimborsi Trasferta
                                </label>
                                {socio.trasferte && (
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="block text-xs text-gray-600">Giorni</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={socio.giorniTrasferta}
                                                onChange={(e) => updateSocio(socio.id, 'giorniTrasferta', Number(e.target.value))}
                                                className="w-full p-2 border border-gray-300 rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600">�/giorno</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={socio.importoTrasfertaGiorno}
                                                onChange={(e) => updateSocio(socio.id, 'importoTrasfertaGiorno', Number(e.target.value))}
                                                className="w-full p-2 border border-gray-300 rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600">Esente fino a (�)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={socio.trasfertaEsenteFino}
                                                onChange={(e) => updateSocio(socio.id, 'trasfertaEsenteFino', Number(e.target.value))}
                                                className="w-full p-2 border border-gray-300 rounded"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Risultati</h2>

                {risultatiSoci.map((risultato, index) => {
                    const socio = risultato.socio;
                    return (
                        <div key={index} className="mb-6 p-4 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-medium mb-2 border-b pb-2">{socio.nome} - {socio.tipo === "operativo" ? "Socio Operativo" : "Socio di Capitale"} ({socio.percentuale}%)</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="p-3 bg-blue-50 rounded">
                                    <span className="text-sm text-gray-600">Quota Utile:</span>
                                    <p className="text-lg font-semibold">{risultato.quotaUtile.toLocaleString('it-IT')} �</p>
                                </div>

                                <div className="p-3 bg-blue-50 rounded">
                                    <span className="text-sm text-gray-600">Buoni Pasto:</span>
                                    <p className="text-lg font-semibold">{risultato.importoBuoniPasto.toLocaleString('it-IT')} �</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded">
                                    <span className="text-sm text-gray-600">Rimborsi Trasferta:</span>
                                    <p className="text-lg font-semibold">{risultato.importoTrasferte.toLocaleString('it-IT')} �</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div className="p-3 bg-yellow-50 rounded">
                                    <span className="text-sm text-gray-600">Contributi INPS:</span>
                                    <p className="text-lg font-semibold">{risultato.contributiInps.toLocaleString('it-IT')} �</p>
                                </div>
                                <div className="p-3 bg-yellow-50 rounded">
                                    <span className="text-sm text-gray-600">IRPEF:</span>
                                    <p className="text-lg font-semibold">{risultato.irpef.toLocaleString('it-IT')} �</p>
                                </div>
                                <div className="p-3 bg-yellow-50 rounded">
                                    <span className="text-sm text-gray-600">Addizionale Regionale:</span>
                                    <p className="text-lg font-semibold">{risultato.addizionaleRegionale.toLocaleString('it-IT')} �</p>
                                </div>
                                <div className="p-3 bg-yellow-50 rounded">
                                    <span className="text-sm text-gray-600">Addizionale Comunale:</span>
                                    <p className="text-lg font-semibold">{risultato.addizionaleComunale.toLocaleString('it-IT')} �</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3 bg-red-50 rounded">
                                    <span className="text-sm text-gray-600">Totale Imposte:</span>
                                    <p className="text-lg font-semibold">{risultato.totaleImposte.toLocaleString('it-IT')} �</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded">
                                    <span className="text-sm text-gray-600">Netto Percepito:</span>
                                    <p className="text-lg font-semibold">{risultato.nettoPercepito.toLocaleString('it-IT')} �</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="text-sm text-gray-500 mt-8">
                <p>Disclaimer: Questo simulatore fornisce una stima indicativa. Per calcoli precisi si consiglia di consultare un commercialista.</p>
                <p>Le aliquote IRPEF e i contributi INPS utilizzati sono configurabili ma potrebbero richiedere aggiornamenti in base alle normative vigenti.</p>
            </div>
        </div>
    );
}