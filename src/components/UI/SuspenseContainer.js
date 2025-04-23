import React, { Suspense, useState, useEffect } from 'react';
import LoadingIndicator from './LoadingIndicator';

/**
 * Componente contenitore che implementa Suspense con un LoadingIndicator intelligente
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - I componenti da renderizzare
 * @param {number} props.minDelay - Delay minimo in ms per mostrare il loader
 * @param {number} props.maxProgress - Progresso massimo simulato per il loader (default: 95)
 * @param {string} props.loadingMessage - Messaggio personalizzato per il caricamento
 */
const SuspenseContainer = ({
    children,
    minDelay = 500,
    maxProgress = 95,
    loadingMessage = "Caricamento dei dati in corso..."
}) => {
    const [progress, setProgress] = useState(0);
    const [computedProgress, setComputedProgress] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);

    // Effetto per simulare il progresso del caricamento
    useEffect(() => {
        let startTime = Date.now();
        let isActive = true;

        // Imposta un timer per incrementare il progresso simulato
        const timer = setInterval(() => {
            if (!isActive) return;

            const elapsed = Date.now() - startTime;
            setTimeElapsed(elapsed);

            // Calcola un progresso che inizia veloce e poi rallenta, 
            // senza mai raggiungere il 100% finché non è effettivamente caricato
            const calculatedProgress = Math.min(
                maxProgress,
                Math.log(1 + elapsed / 200) * 20
            );

            setProgress(calculatedProgress);
        }, 50);

        return () => {
            isActive = false;
            clearInterval(timer);
        };
    }, [maxProgress]);

    // Effetto per rendere fluida l'animazione della barra di progresso
    useEffect(() => {
        let frameId;
        const animateProgress = () => {
            setComputedProgress(prev => {
                // Fa in modo che il computedProgress insegua il progress
                // in modo fluido per migliorare la percezione visiva
                const diff = progress - prev;
                if (Math.abs(diff) < 0.1) return progress;
                return prev + diff * 0.1;
            });
            frameId = requestAnimationFrame(animateProgress);
        };

        frameId = requestAnimationFrame(animateProgress);
        return () => cancelAnimationFrame(frameId);
    }, [progress]);

    // Fallback component che include un breve ritardo per evitare flash
    const FallbackWithDelay = () => {
        const [shouldShow, setShouldShow] = useState(false);

        useEffect(() => {
            const timer = setTimeout(() => {
                setShouldShow(true);
            }, minDelay);

            return () => clearTimeout(timer);
        }, []);

        if (!shouldShow) return null;

        return (
            <LoadingIndicator
                progress={computedProgress}
                message={loadingMessage}
                isIndeterminate={timeElapsed > 10000} // Passa a indeterminato se ci mette troppo
            />
        );
    };

    return (
        <Suspense fallback={<FallbackWithDelay />}>
            {children}
        </Suspense>
    );
};

export default SuspenseContainer;