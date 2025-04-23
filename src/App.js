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
    );
}

export default App;