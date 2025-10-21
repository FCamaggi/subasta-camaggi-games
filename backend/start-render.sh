#!/bin/bash

echo "🎉 Iniciando Backend en Render..."

# Verificar si la base de datos existe
if [ ! -f "database.sqlite" ]; then
    echo "🗄️  Inicializando base de datos..."
    npm run init-db
fi

echo "🚀 Iniciando servidor..."
npm start
