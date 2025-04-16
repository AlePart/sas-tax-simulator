import React from 'react';

/**
 * Form per i dettagli del socio
 */
const SocioForm = ({ socio, updateSocio, rimuoviSocio }) => {
    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
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
                        Reddito Esterno (&euro;)
                    </label>
                    <input
                        type="number"
                        value={socio.redditoEsterno}
                        onChange={(e) => updateSocio(socio.id, 'redditoEsterno', Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                {socio.tipo === "operativo" && (
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
                )}
            </div>

            {socio.tipo === "operativo" && (
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
                                    <label className="block text-xs text-gray-600">Valore (&euro;/giorno)</label>
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
                                    <label className="block text-xs text-gray-600">Esente fino a (&euro;)</label>
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
                                    <label className="block text-xs text-gray-600">&euro;/giorno</label>
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
                                    <label className="block text-xs text-gray-600">Esente fino a (&euro;)</label>
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
            )}
        </div>
    );
};

export default SocioForm;