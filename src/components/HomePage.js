import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-2xl">
                <h1 className="text-3xl font-bold text-blue-800 mb-6">Benvenuto</h1>
                <p className="text-lg mb-6">
                    Questo sito contiene strumenti utili per la gestione fiscale.
                </p>
                <div className="mt-8">
                    <Link
                        to="/sasSim"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition duration-300"
                    >
                        Accedi al Simulatore SAS
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HomePage;