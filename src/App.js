import React, { lazy } from 'react';
import SuspenseContainer from './components/UI/SuspenseContainer';

// Caricamento pigro del componente principale
const SASTaxSimulator = lazy(() =>
    // Aggiungo un ritardo artificiale minimo per evitare flash del caricamento 
    // in casi di caricamento molto veloce
    new Promise(resolve => {
        import('./components/SASTaxSimulator').then(module => {
            // Simula un po' di tempo per il caricamento dei dati
            setTimeout(() => {
                resolve(module);
            }, 300);
        });
    })
);

function App() {
    return (
        <div className="App">
            <SuspenseContainer
                loadingMessage="Inizializzazione Simulatore Tassazione SAS..."
            >
                <SASTaxSimulator />
            </SuspenseContainer>
        </div>
    );
}

export default App;