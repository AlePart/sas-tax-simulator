import React from 'react';
import InfoBox from '../UI/InfoBox';
import { formatCurrency } from './utils';

/**
 * Componente per visualizzare i risultati di un socio
 */
const SocioResults = ({ risultato }) => {
    const { socio, quotaUtile, importoBuoniPasto, importoTrasferte, contributiInps,
        irpef, addizionaleRegionale, addizionaleComunale, totaleImposte, nettoPercepito } = risultato;

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
                            label="Buoni Pasto:"
                            value={formatCurrency(importoBuoniPasto)}
                        />
                        <InfoBox
                            label="Rimborsi Trasferta:"
                            value={formatCurrency(importoTrasferte)}
                        />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <InfoBox
                    label="Contributi INPS:"
                    value={formatCurrency(contributiInps)}
                    bgColor="bg-yellow-50"
                />
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
        </div>
    );
};

export default SocioResults;