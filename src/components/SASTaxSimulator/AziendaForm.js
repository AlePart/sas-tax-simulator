import React from 'react';
import Card from '../UI/Card';
import InfoBox from '../UI/InfoBox';
import { formatCurrency } from './utils';
/**
 * Form per i dati aziendali
 */
const AziendaForm = ({
    fatturato,
    setFatturato,
    costi,
    setCosti,
    aliquotaIrap,
    setAliquotaIrap,
    aliquotaInps,
    setAliquotaInps,
    utileAziendale,
    irap,
    utileDopoIrap,
    costiSociOperativi
}) => {
    return (
        <Card title="Dati Aziendali">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fatturato Aziendale (&euro;)
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
                        Costi Aziendali Base (&euro;)
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
                        Aliquota IRAP (%)
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={aliquotaIrap}
                        onChange={(e) => setAliquotaIrap(Number(e.target.value))}
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
                <InfoBox
                    label="Costi Buoni Pasto/Trasferte:"
                    value={formatCurrency(costiSociOperativi)}
                />
                <InfoBox
                    label="Utile Aziendale:"
                    value={formatCurrency(utileAziendale)}
                />
                <InfoBox
                    label={`IRAP (${aliquotaIrap}%):`}
                    value={formatCurrency(irap)}
                />
            </div>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-1 gap-4">
                <InfoBox
                    label="Utile dopo IRAP:"
                    value={formatCurrency(utileDopoIrap)}
                    bgColor="bg-green-50"
                />
            </div>
        </Card>
    );
};

export default AziendaForm;