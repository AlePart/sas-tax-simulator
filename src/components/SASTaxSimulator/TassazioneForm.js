import React, { useState } from 'react';
import Card from '../UI/Card';

/**
 * Form per le configurazioni fiscali
 */
const TassazioneForm = ({
    scaglioniIrpef,
    setScaglioniIrpef,
    aliqRegionale,
    setAliqRegionale,
    aliqComunale,
    setAliqComunale
}) => {
    // Stato per gestire apertura/chiusura della card
    const [isExpanded, setIsExpanded] = useState(false);

    // Aggiorna uno scaglione IRPEF 
    const updateScaglioneIrpef = (index, campo, valore) => {
        const nuoviScaglioni = [...scaglioniIrpef];
        nuoviScaglioni[index] = { ...nuoviScaglioni[index], [campo]: valore };
        setScaglioniIrpef(nuoviScaglioni);
    };

    return (
        <Card title={
            <div className="flex justify-between items-center w-full cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <span>Configurazione Tassazione</span>
                <button className="text-blue-600 hover:text-blue-800">
                    {isExpanded ? '▲ Chiudi' : '▼ Apri'}
                </button>
            </div>
        }>
            {isExpanded && (
                <>
                    <div className="mb-4">
                        <h3 className="text-lg font-medium mb-2">Scaglioni IRPEF</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {scaglioniIrpef.map((scaglione, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Limite (&euro;)</label>
                                        <input
                                            type="number"
                                            value={scaglione.limite === Infinity ? 999999999 : scaglione.limite}
                                            onChange={(e) => updateScaglioneIrpef(index, 'limite', e.target.value === '999999999' ? Infinity : Number(e.target.value))}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            disabled={index === scaglioniIrpef.length - 1}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Aliquota (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={scaglione.aliquota}
                                            onChange={(e) => updateScaglioneIrpef(index, 'aliquota', Number(e.target.value))}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Addizionale Regionale (%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={aliqRegionale}
                                onChange={(e) => setAliqRegionale(Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Addizionale Comunale (%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={aliqComunale}
                                onChange={(e) => setAliqComunale(Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>
                </>
            )}
        </Card>
    );
};

export default TassazioneForm;