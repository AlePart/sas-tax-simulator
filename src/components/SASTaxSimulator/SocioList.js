import React from 'react';
import SocioForm from './SocioForm';
import { creaNuovoSocio } from './utils';

/**
 * Componente per la gestione dei soci
 */
const SocioList = ({ soci, setSoci, totalPercentuale }) => {
    const aggiungiSocio = () => {
        const nuovoSocio = creaNuovoSocio(
            soci.length > 0 ? Math.max(...soci.map(s => s.id)) + 1 : 1
        );
        setSoci([...soci, nuovoSocio]);
    };

    const rimuoviSocio = (id) => {
        setSoci(soci.filter(socio => socio.id !== id));
    };

    const updateSocio = (id, campo, valore) => {
        setSoci(soci.map(socio => {
            if (socio.id === id) {
                return { ...socio, [campo]: valore };
            }
            return socio;
        }));
    };

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Soci</h2>
                <button
                    onClick={aggiungiSocio}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                    Aggiungi Socio
                </button>
            </div>

            {totalPercentuale !== 100 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                    Attenzione: La somma delle percentuali di partecipazione è {totalPercentuale}%. Il totale deve essere 100%.
                </div>
            )}

            {soci.map((socio) => (
                <SocioForm
                    key={socio.id}
                    socio={socio}
                    updateSocio={updateSocio}
                    rimuoviSocio={rimuoviSocio}
                />
            ))}
        </div>
    );
};

export default SocioList;