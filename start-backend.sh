#!/bin/bash

echo "🎉 Iniciando Backend de Subasta Camaggi..."
echo ""

cd backend

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Verificar si la base de datos existe
if [ ! -f "database.sqlite" ]; then
    echo "🗄️  Inicializando base de datos..."
    npm run init-db
    echo ""
    echo "⚠️  IMPORTANTE: Guarda los tokens que se mostraron arriba!"
    echo ""
    read -p "Presiona Enter para continuar..."
fi

echo ""
echo "🚀 Iniciando servidor..."
npm start
