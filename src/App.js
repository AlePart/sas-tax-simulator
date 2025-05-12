import React, { lazy, Suspense, useEffect } from 'react';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Caricamento pigro del componente principale
const SASTaxSimulator = lazy(() =>
    import('./components/SASTaxSimulator')
);

function App() {
    // Effetto per rimuovere lo spinner iniziale HTML
    useEffect(() => {
        // Rimuovi lo spinner di caricamento iniziale
        if (window.removeInitialLoadingSpinner) {
            // Breve ritardo per garantire che l'app React sia pronta
            const timer = setTimeout(() => {
                window.removeInitialLoadingSpinner();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <div className="App">
            {/* Contenitore principale con padding-bottom per lasciare spazio al footer */}
            <div className="pb-24">
                <Suspense fallback={
                    <div className="fixed inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                            <h2 className="text-xl font-semibold text-blue-800 mb-4">
                                Inizializzazione Simulatore Tassazione SAS...
                            </h2>
                            <div className="flex justify-center py-4">
                                <LoadingSpinner size="large" color="primary" />
                            </div>
                            <div className="text-center mt-4 text-sm text-gray-500">
                                Simulatore Tassazione SAS | Key-Code
                            </div>
                        </div>
                    </div>
                }>
                    <SASTaxSimulator />
                </Suspense>
            </div>

            {/* Footer semplice con link a 3eurotools.it */}
            <div className="mt-12 bg-blue-800 text-white py-4 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="text-sm">Simulatore Tassazione SAS | Key-Code</p>
                        </div>
                        <div className="flex flex-col md:flex-row items-center">
                            <p className="text-sm mr-4 mb-2 md:mb-0">Strumenti utili:</p>
                            <a
                                href="https://3eurotools.it/calcolatore-stipendio-netto"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-blue-800 px-4 py-2 rounded text-sm font-medium hover:bg-blue-100 transition duration-200 mb-2 md:mb-0 md:mr-2"
                            >
                                Calcolo IRPEF Dipendenti
                            </a>
                            <a
                                href="https://3eurotools.it"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-blue-800 px-4 py-2 rounded text-sm font-medium hover:bg-blue-100 transition duration-200"
                            >
                                Altri strumenti
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;