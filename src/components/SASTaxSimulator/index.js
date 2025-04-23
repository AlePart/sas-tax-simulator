import React, { useState, useEffect, useCallback } from 'react';
import AziendaForm from './AziendaForm';
import SocioList from './SocioList';
import SocioResults from './SocioResults';
import ReportCharts from './ReportCharts';
import Sidebar from '../UI/Sidebar';
import SessionControls from '../UI/SessionControls';
import LoadingIndicator from '../UI/LoadingIndicator';
import {
    calcolaCostiSociOperativi,
    calcolaRisultatiSocio,
    creaNuovoSocio
} from './utils';
import { saveAutoData, loadAutoData, clearAutoData } from '../../utils/autoSaveUtils';

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

    // Stato di inizializzazione
    const [isInitialized, setIsInitialized] = useState(false);
    // Stato per tenere traccia delle modifiche
    const [hasChanges, setHasChanges] = useState(false);
    // Stati per il caricamento
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('Inizializzazione del simulatore...');
    // Stato per il reset
    const [isResetting, setIsResetting] = useState(false);

    // Funzione per impostare i valori predefiniti
    const setDefaultValues = useCallback(() => {
        setFatturato(100000);
        setCosti(40000);
        setAliquotaIrap(3.9);
        setAliquotaInps(23.1);
        setSoci([
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
        setScaglioniIrpef([
            { limite: 15000, aliquota: 23 },
            { limite: 28000, aliquota: 25 },
            { limite: 50000, aliquota: 35 },
            { limite: Infinity, aliquota: 43 }
        ]);
        setAliqRegionale(1.73);
        setAliqComunale(0.8);
    }, []);

    // Funzione per raccogliere tutti i dati correnti
    const collectCurrentData = useCallback(() => {
        return {
            fatturato,
            costi,
            aliquotaIrap,
            aliquotaInps,
            soci,
            scaglioniIrpef,
            aliqRegionale,
            aliqComunale
        };
    }, [fatturato, costi, aliquotaIrap, aliquotaInps, soci, scaglioniIrpef, aliqRegionale, aliqComunale]);

    // Funzione per gestire il reset
    const handleReset = useCallback(() => {
        // Imposta immediatamente lo stato di reset e loading
        setIsResetting(true);
        setIsLoading(true);
        setLoadingMessage('Reset in corso...');
        setLoadingProgress(0);

        // Avvia la simulazione del progresso
        const progressInterval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return prev;
                }
                return prev + 5;
            });
        }, 50);

        // Esegue il reset effettivo con un piccolo ritardo per mostrare l'UI
        setTimeout(() => {
            try {
                // Pulisci i dati salvati
                const resetSuccess = clearAutoData();

                if (resetSuccess) {
                    setLoadingMessage('Ripristino valori predefiniti...');
                    setLoadingProgress(95);

                    // Ripristina i valori predefiniti
                    setDefaultValues();

                    console.log('Reset completato con successo');
                } else {
                    setLoadingMessage('Errore durante il reset. Ripristino valori predefiniti...');
                    console.error('Errore durante il reset dei dati');

                    // Comunque ripristina i valori predefiniti
                    setDefaultValues();
                }

                // Completa il processo di reset
                setLoadingProgress(100);
                setTimeout(() => {
                    setIsLoading(false);
                    setIsResetting(false);
                    setHasChanges(false); // Resetta anche lo stato delle modifiche
                    setIsInitialized(true); // Assicurati che il componente sia ancora inizializzato
                }, 500);

            } catch (error) {
                console.error('Errore critico durante il reset:', error);
                setLoadingMessage('Si è verificato un errore. Ripristino forzato...');

                // In caso di errore, comunque ripristina i valori predefiniti
                setDefaultValues();

                setTimeout(() => {
                    setIsLoading(false);
                    setIsResetting(false);
                    setIsInitialized(true);
                }, 1000);
            } finally {
                clearInterval(progressInterval);
            }
        }, 500);

        // Restituisci true per indicare che il reset è stato avviato
        return true;
    }, [setDefaultValues]);

    // Caricamento dati all'avvio
    useEffect(() => {
        const loadSavedData = () => {
            try {
                setIsLoading(true);
                setLoadingMessage('Caricamento dati salvati...');
                setLoadingProgress(10);

                // Simula progressi graduali del caricamento
                const progressInterval = setInterval(() => {
                    setLoadingProgress(prev => {
                        if (prev >= 90) {
                            clearInterval(progressInterval);
                            return prev;
                        }
                        return prev + 5;
                    });
                }, 100);

                setTimeout(() => {
                    const savedData = loadAutoData();
                    setLoadingProgress(95);

                    if (savedData) {
                        setLoadingMessage('Elaborazione dati...');

                        // Carica i dati salvati se disponibili
                        if (savedData.fatturato !== undefined) setFatturato(Number(savedData.fatturato));
                        if (savedData.costi !== undefined) setCosti(Number(savedData.costi));
                        if (savedData.aliquotaIrap !== undefined) setAliquotaIrap(Number(savedData.aliquotaIrap));
                        if (savedData.aliquotaInps !== undefined) setAliquotaInps(Number(savedData.aliquotaInps));

                        if (savedData.soci && Array.isArray(savedData.soci)) {
                            // Assicuriamoci che tutti i soci abbiano un ID valido
                            const validSoci = savedData.soci.map((socio, index) => ({
                                ...socio,
                                id: socio.id || index + 1
                            }));
                            setSoci(validSoci);
                        }

                        if (savedData.scaglioniIrpef && Array.isArray(savedData.scaglioniIrpef)) {
                            setScaglioniIrpef(savedData.scaglioniIrpef);
                        }

                        if (savedData.aliqRegionale !== undefined) setAliqRegionale(Number(savedData.aliqRegionale));
                        if (savedData.aliqComunale !== undefined) setAliqComunale(Number(savedData.aliqComunale));

                        console.log('Dati caricati con successo.');
                    } else {
                        setLoadingMessage('Configurazione predefinita...');
                        console.log('Nessun dato salvato trovato, utilizzo valori predefiniti.');
                    }

                    setLoadingProgress(100);

                    // Imposta lo stato di inizializzazione
                    setTimeout(() => {
                        setIsInitialized(true);
                        setIsLoading(false);
                        clearInterval(progressInterval);
                    }, 500);
                }, 800);
            } catch (error) {
                console.error('Errore durante il caricamento dei dati:', error);
                setLoadingMessage('Si è verificato un errore. Utilizzo valori predefiniti...');
                // In caso di errore, manteniamo i valori predefiniti

                // Anche in caso di errore, terminiamo il caricamento dopo un certo tempo
                setTimeout(() => {
                    setIsInitialized(true);
                    setIsLoading(false);
                }, 1500);
            }
        };

        loadSavedData();
    }, []);

    // Salvataggio automatico quando cambiano i dati (ma solo dopo l'inizializzazione)
    useEffect(() => {
        // Non salviamo durante l'inizializzazione o il reset per evitare di sovrascrivere i dati
        if (!isInitialized || isResetting) return;

        // Segnala che ci sono modifiche da salvare
        setHasChanges(true);
    }, [fatturato, costi, aliquotaIrap, aliquotaInps, soci, scaglioniIrpef, aliqRegionale, aliqComunale, isInitialized, isResetting]);

    // Effettua il salvataggio dopo un breve ritardo dall'ultima modifica
    useEffect(() => {
        if (!hasChanges || !isInitialized || isResetting) return;

        const saveTimeout = setTimeout(() => {
            const currentData = collectCurrentData();
            const saveResult = saveAutoData(currentData);

            if (saveResult) {
                console.log('Salvataggio automatico completato:', new Date().toLocaleTimeString());
                setHasChanges(false);
            } else {
                console.warn('Salvataggio automatico non riuscito');
            }
        }, 1000); // Attende 1 secondo dall'ultima modifica prima di salvare

        // Pulizia del timeout se i dati cambiano nuovamente prima del salvataggio
        return () => clearTimeout(saveTimeout);
    }, [hasChanges, isInitialized, isResetting, collectCurrentData]);

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
            {(isLoading || isResetting) && (
                <LoadingIndicator
                    progress={loadingProgress}
                    message={loadingMessage}
                />
            )}

            <h1 className="text-2xl font-bold mb-6 text-blue-800">Simulatore Tassazione SAS</h1>

            {/* Indicatore di salvataggio automatico */}
            {hasChanges && isInitialized && !isResetting && (
                <div className="fixed top-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm shadow-md z-50">
                    Salvataggio in corso...
                </div>
            )}

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
            <SessionControls
                simulationData={simulationData}
                onReset={handleReset}
                onResetComplete={() => {
                    // Eventuali operazioni aggiuntive da eseguire al completamento del reset
                    console.log('Reset completato e UI aggiornata');
                }}
            />
        </div>
    );
};

export default SASTaxSimulator;