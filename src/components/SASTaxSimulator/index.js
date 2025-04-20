import React, { useState, useEffect } from 'react';
import AziendaForm from './AziendaForm';
import TassazioneForm from './TassazioneForm';
import SocioList from './SocioList';
import SocioResults from './SocioResults';
import ReportCharts from './ReportCharts';
import Sidebar from '../UI/Sidebar';
import SessionControls from '../UI/SessionControls';
import {
    calcolaCostiSociOperativi,
    calcolaRisultatiSocio,
    creaNuovoSocio
} from './utils';
import { setCookie, getCookie } from '../../utils/cookieUtils';

/**
 * Componente principale del simulatore di tassazione SAS
 */
const SASTaxSimulator = () => {
    // Stato per i dati aziendali con valori predefiniti
    const [fatturato, setFatturato] = useState(100000);
    const [costi, setCosti] = useState(40000);
    const [aliquotaIrap, setAliquotaIrap] = useState(3.9); // Default IRAP 3.9%
    const [aliquotaInps, setAliquotaInps] = useState(23.1);

    // Stato per i soci con valori predefiniti
    const [soci, setSoci] = useState([
        {
            ...creaNuovoSocio(1, "Mario Rossi"),
            tipo: "operativo",
            percentuale: 60,
            redditoEsterno: 0,
            giornateLavorate: 220,
            buoniPasto: true,
            valoreBuoniPasto: 8,
            buoniPastoEsentiFino: 8,
            trasferte: true,
            giorniTrasferta: 30,
            importoTrasfertaGiorno: 50,
            trasfertaEsenteFino: 46.48,
        },
        {
            ...creaNuovoSocio(2, "Giulia Bianchi"),
            tipo: "capitale",
            percentuale: 40,
            redditoEsterno: 30000,
        }
    ]);

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

    // Caricamento dati dai cookie all'avvio
    useEffect(() => {
        const savedData = getCookie('sas-simulator-data');
        if (savedData) {
            // Carica i dati salvati se disponibili
            if (savedData.fatturato) setFatturato(savedData.fatturato);
            if (savedData.costi) setCosti(savedData.costi);
            if (savedData.aliquotaIrap) setAliquotaIrap(savedData.aliquotaIrap);
            if (savedData.aliquotaInps) setAliquotaInps(savedData.aliquotaInps);
            if (savedData.soci && Array.isArray(savedData.soci)) setSoci(savedData.soci);
            if (savedData.scaglioniIrpef && Array.isArray(savedData.scaglioniIrpef)) setScaglioniIrpef(savedData.scaglioniIrpef);
            if (savedData.aliqRegionale) setAliqRegionale(savedData.aliqRegionale);
            if (savedData.aliqComunale) setAliqComunale(savedData.aliqComunale);
        }
    }, []);

    // Salvataggio automatico dei dati nei cookie quando cambiano
    useEffect(() => {
        const dataToSave = {
            fatturato,
            costi,
            aliquotaIrap,
            aliquotaInps,
            soci,
            scaglioniIrpef,
            aliqRegionale,
            aliqComunale
        };
        setCookie('sas-simulator-data', dataToSave);
    }, [fatturato, costi, aliquotaIrap, aliquotaInps, soci, scaglioniIrpef, aliqRegionale, aliqComunale]);

    // Calcola i costi per soci operativi con dettaglio esente/non esente
    const costiInfo = calcolaCostiSociOperativi(soci);
    const costiSociOperativi = costiInfo.totale;

    // Estrae il dettaglio dei costi non esenti che impattano sull'utile aziendale
    const costiNonEsenti = costiInfo.dettaglio.buoniPastoNonEsenti + costiInfo.dettaglio.trasferteNonEsenti;

    // Calcola l'utile aziendale considerando i costi per soci operativi, ma solo la parte esente
    // La parte non esente impatta sull'imponibile del socio ma non sull'utile aziendale
    const utileAziendale = fatturato - costi - costiSociOperativi + costiNonEsenti;

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

    // Dati completi della simulazione (per export)
    const simulationData = {
        datiAzienda: {
            fatturato,
            costi,
            aliquotaIrap,
            aliquotaInps,
            costiSociOperativi,
            costiEsenti: costiSociOperativi - costiNonEsenti,
            costiNonEsenti,
            utileAziendale,
            irap,
            utileDopoIrap
        },
        tassazione: {
            scaglioniIrpef,
            aliqRegionale,
            aliqComunale
        },
        soci,
        risultati: risultatiSoci,
        dataSimulazione: new Date().toISOString(),
        versione: "1.0.0"
    };

    return (
        <div className="p-6 max-w-6xl mx-auto bg-gray-50 relative pb-16">
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
                costiEsenti={costiSociOperativi - costiNonEsenti}
                costiNonEsenti={costiNonEsenti}
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
                costiEsenti={costiSociOperativi - costiNonEsenti}
                costiNonEsenti={costiNonEsenti}
                utileAziendale={utileAziendale}
                irap={irap}
                utileDopoIrap={utileDopoIrap}
                risultatiSoci={risultatiSoci}
            />

            <div className="text-sm text-gray-500 mt-8">
                <p>Disclaimer: Questo simulatore fornisce una stima indicativa. Per calcoli precisi si consiglia di consultare un commercialista.</p>
                <p>Le aliquote IRPEF e i contributi INPS utilizzati sono configurabili ma potrebbero richiedere aggiornamenti in base alle normative vigenti.</p>
                <p className="mt-4 text-center font-semibold">2025 Key-Code. Tutti i diritti riservati.</p>
            </div>

            {/* Sidebar laterale su schermi grandi */}
            <Sidebar
                fatturato={fatturato}
                costi={costi}
                costiSociOperativi={costiSociOperativi}
                costiEsenti={costiSociOperativi - costiNonEsenti}
                costiNonEsenti={costiNonEsenti}
                utileAziendale={utileAziendale}
                irap={irap}
                utileDopoIrap={utileDopoIrap}
                soci={soci}
                risultatiSoci={risultatiSoci}
            />

            {/* Controlli per la sessione */}
            <SessionControls simulationData={simulationData} />
        </div>
    );
};

export default SASTaxSimulator;