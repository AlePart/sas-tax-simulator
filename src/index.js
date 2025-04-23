import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Inietta lo spinner di caricamento direttamente nel DOM prima di qualsiasi rendering React
// Questo verrà mostrato immediatamente durante il caricamento del JavaScript
const injectLoadingSpinner = () => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
        rootElement.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; background-color: rgba(255, 255, 255, 0.8); z-index: 9999;">
        <div style="background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center; max-width: 400px; width: 100%;">
          <h2 style="font-size: 1.25rem; font-weight: 600; color: #1e40af; margin-bottom: 1rem;">Caricamento...</h2>
          <div style="display: flex; justify-content: center; padding: 1rem 0;">
            <svg style="width: 3rem; height: 3rem; color: #2563eb; animation: spin 1s linear infinite;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <style>
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          </style>
        </div>
      </div>
    `;
    }
};

// Mostra immediatamente lo spinner
injectLoadingSpinner();

// Poi inizializza l'applicazione React con un leggero ritardo
// per assicurare che lo spinner sia visibile
setTimeout(() => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );

    reportWebVitals();
}, 50); // Un piccolo ritardo per garantire che lo spinner sia visibile