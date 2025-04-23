import React, { Suspense } from 'react';
import LoadingIndicator from './LoadingIndicator';

/**
 * Componente contenitore per gestire il caricamento dei componenti mediante Suspense
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componenti figli da caricare
 * @param {string} props.loadingMessage - Messaggio da visualizzare durante il caricamento
 * @param {string} props.loadingType - Tipo di indicatore di caricamento ('bar' o 'spinner')
 */
const SuspenseContainer = ({
    children,
    loadingMessage = "Caricamento in corso...",
    loadingType = 'spinner'
}) => {
    return (
        <Suspense
            fallback={
                <LoadingIndicator
                    type={loadingType}
                    isIndeterminate={true}
                    message={loadingMessage}
                />
            }
        >
            {children}
        </Suspense>
    );
};

export default SuspenseContainer;