#!/bin/bash

# Script per il deploy del simulatore SAS su GitHub Pages

# Installa dipendenze
npm install

# Build dell'applicazione
npm run build

# Commit e push del codice
git add .
git commit -m "Aggiornamento del simulatore"
git push origin main

# Deploy su GitHub Pages
npm run deploy

echo "Deploy completato! Il sito sarà disponibile tra pochi minuti su GitHub Pages."