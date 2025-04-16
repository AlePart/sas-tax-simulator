import React, { useState } from 'react';
import AziendaForm from './AziendaForm';
import TassazioneForm from './TassazioneForm';
import SocioList from './SocioList';
import SocioResults from './SocioResults';
import ReportCharts from './ReportCharts';
import {
    calcolaCostiSociOperativi,
    calcolaRisultatiSocio,
    creaNuovoSocio
} from './utils';

/**
 * Componente principale del simulatore di tassazione SAS
 */
const SASTaxSimulator = () => {
    // Stato per i dati aziendali
    const [fatturato, setFatturato] = useState(100000);
    const [costi, setCosti] = useState(40000);
    const [aliquotaIrap, setAliquotaIrap] = useState(3.9); // Default IRAP 3.9%
    const [aliquotaInps, setAliquotaInps] = useState(23.1);

    // Stato per i soci
    const [soci, setSoci] = useState([
        creaNuovoSocio(1, "Mario Rossi"),
        creaNuovoSocio(2, "Giulia Bianchi")
    ]);

    // Inizializza i valori predefiniti per i soci
    useState(() => {
        setSoci([
            {
                ...creaNuovoSocio(1, "Mario Rossi"),
                tipo: "operativo",
                percentuale: 60,
                redditoEsterno: 0,
                giornateLavorate: 220,
                buoniPasto: true,
                valoreBuoniPasto: 8,
                trasferte: true,
                giorniTrasferta: 30,
                importoTrasfertaGiorno: 50,
            },
            {
                ...creaNuovoSocio(2, "Giulia Bianchi"),
                tipo: "capitale",
                percentuale: 40,
                redditoEsterno: 30000,
            }
        ]);
    }, []);

    // Configurazione degli scaglioni IRPEF
    const [scaglioniIrpef, setScaglioniIrpef] = useState([
        { limite: 15000, aliquota: 23 },
        { limite: 28000, aliquota: 25 },
        { limite: 50000, aliquota: 35 },
        { limite: Infinity, aliquota: 43 }
    ]);

    // Aliquote addizionali
    const [aliqRegionale, setAliqRegionale] = useState(1.73);
    const [aliqComunale, setAliqComunale] = useState(0.8);

    // Calcola i costi per soci operativi
    const costiSociOperativi = calcolaCostiSociOperativi(soci);

    // Calcola l'utile aziendale considerando i costi per soci operativi
    const utileAziendale = fatturato - costi - costiSociOperativi;

    // Calcola IRAP
    const irap = utileAziendale * (aliquotaIrap / 100);

    // Utile dopo IRAP
    const utileDopoIrap = utileAziendale - irap;

    // Percentuale totale di partecipazione
    const totalPercentuale = soci.reduce((acc, socio) => acc + Number(socio.percentuale), 0);

    // Calcola risultati per ciascun socio
    const risultatiSoci = soci.map(socio =>
        calcolaRisultatiSocio(
            socio,
            utileDopoIrap,
            aliquotaInps,
            scaglioniIrpef,
            aliqRegionale,
            aliqComunale
        )
    );

    return (
        <div className="p-6 max-w-6xl mx-auto bg-gray-50">
            <h1 className="text-2xl font-bold mb-6 text-blue-800">Simulatore Tassazione SAS</h1>

            <AziendaForm
                fatturato={fatturato}
                setFatturato={setFatturato}
                costi={costi}
                setCosti={setCosti}
                aliquotaIrap={aliquotaIrap}
                setAliquotaIrap={setAliquotaIrap}
                aliquotaInps={aliquotaInps}
                setAliquotaInps={setAliquotaInps}
                utileAziendale={utileAziendale}
                irap={irap}
                utileDopoIrap={utileDopoIrap}
                costiSociOperativi={costiSociOperativi}
            />

            <TassazioneForm
                scaglioniIrpef={scaglioniIrpef}
                setScaglioniIrpef={setScaglioniIrpef}
                aliqRegionale={aliqRegionale}
                setAliqRegionale={setAliqRegionale}
                aliqComunale={aliqComunale}
                setAliqComunale={setAliqComunale}
            />

            <SocioList
                soci={soci}
                setSoci={setSoci}
                totalPercentuale={totalPercentuale}
            />

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Risultati</h2>

                {risultatiSoci.map((risultato, index) => (
                    <SocioResults key={index} risultato={risultato} />
                ))}
            </div>

            <ReportCharts
                fatturato={fatturato}
                costi={costi}
                costiSociOperativi={costiSociOperativi}
                utileAziendale={utileAziendale}
                irap={irap}
                utileDopoIrap={utileDopoIrap}
                risultatiSoci={risultatiSoci}
            />

            <div className="text-sm text-gray-500 mt-8">
                <p>Disclaimer: Questo simulatore fornisce una stima indicativa. Per calcoli precisi si consiglia di consultare un commercialista.</p>
                <p>Le aliquote IRPEF e i contributi INPS utilizzati sono configurabili ma potrebbero richiedere aggiornamenti in base alle normative vigenti.</p>
            </div>
        </div>
    );
};

export default SASTaxSimulator;