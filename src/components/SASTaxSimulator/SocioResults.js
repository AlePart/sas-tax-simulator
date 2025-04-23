import React from 'react';
import InfoBox from '../UI/InfoBox';
import { formatCurrency } from './utils';

/**
 * Componente per visualizzare i risultati di un socio
 */
const SocioResults = ({ risultato }) => {
    const {
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
    } = risultato;

    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2 border-b pb-2">
                {socio.nome} - {socio.tipo === "operativo" ? "Socio Operativo" : "Socio di Capitale"} ({socio.percentuale}%)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <InfoBox
                    label="Quota Utile:"
                    value={formatCurrency(quotaUtile)}
                />

                {socio.tipo === "operativo" && (
                    <>
                        <InfoBox
                            label="Buoni Pasto Totali:"
                            value={formatCurrency(importoBuoniPasto)}
                        />
                        <InfoBox
                            label="Rimborsi Trasferta Totali:"
                            value={formatCurrency(importoTrasferte)}
                        />
                    </>
                )}
            </div>

            {socio.tipo === "operativo" && importoBuoniPasto > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InfoBox
                        label="Buoni Pasto Esenti:"
                        value={formatCurrency(importoBuoniPastoEsenti)}
                        bgColor="bg-green-50"
                    />
                    <InfoBox
                        label="Buoni Pasto Non Esenti:"
                        value={formatCurrency(importoBuoniPastoNonEsenti)}
                        bgColor="bg-yellow-50"
                    />
                </div>
            )}

            {socio.tipo === "operativo" && importoTrasferte > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InfoBox
                        label="Trasferte Esenti:"
                        value={formatCurrency(importoTrasferteEsenti)}
                        bgColor="bg-green-50"
                    />
                    <InfoBox
                        label="Trasferte Non Esenti:"
                        value={formatCurrency(importoTrasferteNonEsenti)}
                        bgColor="bg-yellow-50"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <InfoBox
                    label="Reddito Imponibile Totale:"
                    value={formatCurrency(redditoImponibileTotale)}
                    bgColor="bg-blue-50"
                />
                <InfoBox
                    label="Contributi INPS:"
                    value={formatCurrency(contributiInps)}
                    bgColor="bg-yellow-50"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <InfoBox
                    label="IRPEF:"
                    value={formatCurrency(irpef)}
                    bgColor="bg-yellow-50"
                />
                <InfoBox
                    label="Addizionale Regionale:"
                    value={formatCurrency(addizionaleRegionale)}
                    bgColor="bg-yellow-50"
                />
                <InfoBox
                    label="Addizionale Comunale:"
                    value={formatCurrency(addizionaleComunale)}
                    bgColor="bg-yellow-50"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoBox
                    label="Totale Imposte:"
                    value={formatCurrency(totaleImposte)}
                    bgColor="bg-red-50"
                />
                <InfoBox
                    label="Netto Percepito:"
                    value={formatCurrency(nettoPercepito)}
                    bgColor="bg-green-50"
                />
            </div>

            {socio.tipo === "operativo" && (
                <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <p>Il netto percepito include: la quota di utile al netto delle imposte, pi&ugrave; la parte esente di buoni pasto e trasferte.</p>
                    <p>La parte non esente &egrave; inclusa nel reddito imponibile e quindi gi&agrave; considerata nel calcolo delle imposte.</p>
                </div>
            )}
        </div>
    );
};

export default SocioResults;