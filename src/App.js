import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SASTaxSimulator from './components/SASTaxSimulator';
import HomePage from './components/HomePage';

function App() {
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sasSim" element={<SASTaxSimulator />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;