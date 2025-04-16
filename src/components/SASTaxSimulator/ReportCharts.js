import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from '../UI/Card';
import { formatCurrency } from './utils';

/**
 * Componente per i grafici a torta e tabella riepilogativa
 */
const ReportCharts = ({
    fatturato,
    costi,
    costiSociOperativi,
    utileAziendale,
    irap,
    utileDopoIrap,
    risultatiSoci
}) => {
    return (
        <Card title="Report Grafico">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-medium mb-3">Ripartizione Aziendale</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Costi Base', value: costi },
                                        { name: 'Costi Soci Operativi', value: costiSociOperativi },
                                        { name: 'IRAP', value: irap },
                                        { name: 'Utile Netto', value: utileDopoIrap }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    <Cell fill="#FF8042" />
                                    <Cell fill="#00C49F" />
                                    <Cell fill="#FFBB28" />
                                    <Cell fill="#0088FE" />
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-3">Ripartizione delle Quote</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={risultatiSoci.map(risultato => ({
                                        name: risultato.socio.nome,
                                        value: risultato.quotaUtile,
                                        tipo: risultato.socio.tipo
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {risultatiSoci.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.socio.tipo === 'operativo' ? '#0088FE' : '#00C49F'} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-medium mb-3">Dettaglio Fiscale</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voce</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importo</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentuale</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Fatturato</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(fatturato)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">100%</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Costi Base</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(costi)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{((costi / fatturato) * 100).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Costi Soci Operativi</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(costiSociOperativi)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{((costiSociOperativi / fatturato) * 100).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Utile Aziendale</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(utileAziendale)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{((utileAziendale / fatturato) * 100).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">IRAP</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(irap)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{((irap / fatturato) * 100).toFixed(2)}%</td>
                            </tr>
                            <tr className="bg-green-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Utile dopo IRAP</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{formatCurrency(utileDopoIrap)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{((utileDopoIrap / fatturato) * 100).toFixed(2)}%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );
};

export default ReportCharts;