import React from 'react';
import { formatCurrency } from '../../components/SASTaxSimulator/utils';

/**
 * Barra laterale riepilogativa 
 * Visibile solo su schermi PC
 */
const Sidebar = ({ fatturato, costi, costiSociOperativi, utileAziendale, irap, utileDopoIrap, soci, risultatiSoci }) => {
    const totaleImposte = risultatiSoci.reduce((acc, r) => acc + r.totaleImposte, 0);
    const totaleNettoPercepito = risultatiSoci.reduce((acc, r) => acc + r.nettoPercepito, 0);

    return (
        <div className="hidden xl:block fixed right-4 top-4 w-64 bg-white shadow-lg rounded-lg p-4 border-l-4 border-blue-500 h-[calc(100vh-2rem)] overflow-y-auto">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 border-b pb-2">Riepilogo Simulazione</h3>

            <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded">
                    <h4 className="font-medium text-sm text-gray-600">Dati Aziendali</h4>
                    <ul className="mt-2 space-y-1 text-sm">
                        <li className="flex justify-between">
                            <span>Fatturato:</span>
                            <span className="font-medium">{formatCurrency(fatturato)}</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Costi base:</span>
                            <span className="font-medium">{formatCurrency(costi)}</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Costi soci:</span>
                            <span className="font-medium">{formatCurrency(costiSociOperativi)}</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Utile:</span>
                            <span className="font-medium">{formatCurrency(utileAziendale)}</span>
                        </li>
                        <li className="flex justify-between">
                            <span>IRAP:</span>
                            <span className="font-medium">{formatCurrency(irap)}</span>
                        </li>
                        <li className="flex justify-between font-semibold text-green-700">
                            <span>Utile netto:</span>
                            <span>{formatCurrency(utileDopoIrap)}</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium text-sm text-gray-600">Soci ({soci.length})</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                        {risultatiSoci.map((risultato, index) => (
                            <li key={index} className="border-b pb-1 last:border-b-0">
                                <div className="font-medium flex justify-between">
                                    <span>{risultato.socio.nome}</span>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                                        {risultato.socio.tipo === 'operativo' ? 'Operativo' : 'Capitale'}
                                    </span>
                                </div>
                                <div className="text-xs flex justify-between mt-1">
                                    <span>Quota {risultato.socio.percentuale}%:</span>
                                    <span>{formatCurrency(risultato.quotaUtile)}</span>
                                </div>
                                <div className="text-xs flex justify-between">
                                    <span>Imposte:</span>
                                    <span className="text-red-600">{formatCurrency(risultato.totaleImposte)}</span>
                                </div>
                                <div className="text-xs flex justify-between font-medium">
                                    <span>Netto:</span>
                                    <span className="text-green-600">{formatCurrency(risultato.nettoPercepito)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-green-50 p-3 rounded">
                    <h4 className="font-medium text-sm text-gray-600">Totali</h4>
                    <ul className="mt-2 space-y-1 text-sm">
                        <li className="flex justify-between text-red-600">
                            <span>Imposte totali:</span>
                            <span className="font-medium">{formatCurrency(totaleImposte)}</span>
                        </li>
                        <li className="flex justify-between text-green-600 font-semibold">
                            <span>Netto totale:</span>
                            <span>{formatCurrency(totaleNettoPercepito)}</span>
                        </li>
                        <li className="flex justify-between mt-2 pt-2 border-t text-xs">
                            <span>Pressione fiscale:</span>
                            <span>{((totaleImposte / fatturato) * 100).toFixed(1)}%</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-6 text-center border-t pt-4">
                <button
                    onClick={() => window.print()}
                    className="bg-blue-500 text-white text-sm py-2 px-3 rounded hover:bg-blue-600 transition-colors"
                >
                    Stampa simulazione
                </button>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
                2025 Key-Code
            </div>
        </div>
    );
};

export default Sidebar;