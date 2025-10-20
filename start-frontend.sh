#!/bin/bash

echo "🎨 Iniciando Frontend de Subasta Camaggi..."
echo ""

cd frontend

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

echo ""
echo "🚀 Iniciando servidor de desarrollo..."
npm run dev
