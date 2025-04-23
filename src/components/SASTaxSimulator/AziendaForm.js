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
    costiSociOperativi,
    costiEsenti,
    costiNonEsenti
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
                    label="Costi Soci Operativi Totali:"
                    value={formatCurrency(costiSociOperativi)}
                />
                <InfoBox
                    label="di cui Esenti:"
                    value={formatCurrency(costiEsenti)}
                    bgColor="bg-green-50"
                />
                <InfoBox
                    label="di cui Non Esenti:"
                    value={formatCurrency(costiNonEsenti)}
                    bgColor="bg-yellow-50"
                />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoBox
                    label="Utile Aziendale:"
                    value={formatCurrency(utileAziendale)}
                />
                <InfoBox
                    label={`IRAP (${aliquotaIrap}%):`}
                    value={formatCurrency(irap)}
                />
                <InfoBox
                    label="Utile dopo IRAP:"
                    value={formatCurrency(utileDopoIrap)}
                    bgColor="bg-green-50"
                />
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded">
                <p className="text-sm text-gray-600">
                    <strong>Nota:</strong> L&apos;utile aziendale &egrave; calcolato sottraendo dal fatturato i costi base e solo i costi esenti dei soci operativi.
                    La parte non esente di buoni pasto e trasferte &egrave; invece considerata come parte del reddito imponibile dei singoli soci.
                </p>
            </div>
        </Card>
    );
};

export default AziendaForm;