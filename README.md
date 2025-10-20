# 🎉 Sistema de Subastas Camaggi

Sistema de subastas en tiempo real para eventos, con panel de administración, interfaces para equipos competidores y vista pública para espectadores.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![Socket.io](https://img.shields.io/badge/Socket.io-4.6-black)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Descripción

Sistema completo de subastas que permite:

- **👥 Espectadores**: Visualización en tiempo real de las subastas sin necesidad de autenticación
- **🎯 Equipos**: Interfaz para participar en subastas (normales y especiales)
- **⚙️ Administrador**: Panel para gestionar rondas, equipos y visualizar estadísticas

### Tipos de Subastas

1. **Subasta Normal** 🔼
   - Los equipos pujan montos crecientes
   - Gana quien puje más alto
   - Incremento mínimo configurable

2. **Subasta Especial** 🔽
   - El precio desciende automáticamente cada segundo
   - El primer equipo en presionar STOP compra al precio actual
   - Requiere decisión rápida

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
│                  Deployado en Netlify                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Espectador   │  │   Equipos    │  │    Admin     │     │
│  │   (Público)  │  │  (Autent.)   │  │  (Autent.)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
             HTTP/REST            WebSocket (Socket.io)
                │                       │
┌───────────────┴───────────────────────┴────────────────────┐
│              Backend (Node.js + Express)                    │
│                Servidor Local + ngrok                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   REST API   │  │  WebSockets  │  │     Auth     │     │
│  │              │  │              │  │  (JWT/Token) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                            │                                │
│                    ┌───────┴────────┐                      │
│                    │  SQLite + ORM  │                      │
│                    │   (Sequelize)  │                      │
│                    └────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Instalación

```bash
# Clonar el repositorio
git clone <tu-repo>
cd subasta

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### Configuración Rápida

```bash
# Backend: Copiar y configurar .env
cd backend
cp .env.example .env
# Editar .env con tus valores

# Inicializar base de datos
npm run init-db

# Iniciar backend
npm start
```

```bash
# Frontend (en otra terminal)
cd frontend
npm run dev
```

### Acceder

- **Frontend Local**: http://localhost:5173
- **Backend Local**: http://localhost:3001

---

## 📦 Stack Tecnológico

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **WebSockets**: Socket.io 4.6
- **Base de Datos**: SQLite3 con Sequelize ORM
- **Autenticación**: JWT (admin) + Tokens únicos (equipos)
- **Seguridad**: bcrypt, CORS, rate limiting

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Estilos**: TailwindCSS 3.3
- **Routing**: React Router DOM 6.20
- **HTTP Client**: Axios 1.6
- **WebSockets**: Socket.io Client 4.6

---

## 📁 Estructura del Proyecto

```
subasta/
├── backend/
│   ├── src/
│   │   ├── models/          # Modelos de Sequelize (Team, Round, Bid, Transaction)
│   │   ├── routes/          # Rutas de la API REST
│   │   ├── sockets/         # Handlers de WebSocket
│   │   ├── auth/            # Lógica de autenticación
│   │   ├── middleware/      # Middlewares personalizados
│   │   ├── config/          # Configuración de la BD
│   │   ├── scripts/         # Scripts de inicialización
│   │   └── server.js        # Punto de entrada
│   ├── .env                 # Variables de entorno
│   ├── package.json
│   └── database.sqlite      # Base de datos (generada)
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Componentes de páginas
│   │   ├── services/        # API y Socket services
│   │   ├── hooks/           # Custom hooks (useAuth)
│   │   ├── App.jsx          # Componente principal
│   │   └── main.jsx         # Punto de entrada
│   ├── public/
│   ├── .env                 # Variables de entorno
│   ├── package.json
│   └── tailwind.config.js
│
└── docs/
    ├── DEPLOYMENT.md        # Guía de deployment
    ├── API.md              # Documentación de la API
    └── FRONTEND.md         # Documentación del frontend
```

---

## 🎮 Funcionalidades

### Panel de Administrador
- ✅ Crear rondas de subasta (normal/especial)
- ✅ Iniciar/cerrar rondas
- ✅ Visualizar estado en tiempo real
- ✅ Ver historial de transacciones
- ✅ Gestionar balances de equipos

### Dashboard de Equipos
- ✅ Ver balance actual
- ✅ Ver ronda activa
- ✅ Pujar en subastas normales
- ✅ Presionar STOP en subastas especiales
- ✅ Ver historial de pujas propias
- ✅ Notificaciones en tiempo real

### Vista de Espectador
- ✅ Ver todas las rondas (activas, completadas, pendientes)
- ✅ Ver pujas en tiempo real
- ✅ Ver balance de equipos
- ✅ Ver ganadores de rondas
- ✅ Sin necesidad de login

---

## 🔐 Autenticación

### Admin
- **Tipo**: JWT
- **Método**: Usuario y contraseña
- **Credenciales por defecto**: 
  - Usuario: `admin`
  - Contraseña: `cumpleaños2025`

### Equipos
- **Tipo**: Token único persistente
- **Método**: Token generado en la inicialización
- **Obtención**: Ejecutar `npm run init-db` muestra los tokens

### Espectadores
- **Tipo**: Sin autenticación
- **Acceso**: Público, solo lectura

---

## 📡 Comunicación en Tiempo Real

### Eventos WebSocket

#### Servidor → Clientes
- `round:started` - Ronda iniciada
- `round:closed` - Ronda cerrada con ganador
- `bid:new` - Nueva puja realizada
- `round:priceUpdate` - Actualización de precio (subastas especiales)
- `teams:updated` - Balances actualizados

#### Clientes → Servidor
- `team:bid` - Realizar puja (subastas normales)
- `team:stop` - Presionar STOP (subastas especiales)
- `admin:startRound` - Iniciar ronda
- `admin:closeRound` - Cerrar ronda

---

## 🚀 Deployment

### Desarrollo Local
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm run dev
```

### Producción

Ver guía completa en [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

**Resumen**:
1. Deploy del frontend en Netlify
2. Servidor backend local con ngrok
3. Configurar variables de entorno
4. Listo para el evento

---

## 📚 Documentación

- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Guía completa de deployment (Netlify + ngrok)
- **[API.md](./docs/API.md)** - Documentación de endpoints y WebSockets
- **[FRONTEND.md](./docs/FRONTEND.md)** - Documentación de componentes y servicios

---

## 🐛 Troubleshooting

### Error CORS
```bash
# Verificar que FRONTEND_URL en backend/.env coincida con la URL de Netlify
# Reiniciar el backend después de cambios
```

### Base de datos corrupta
```bash
cd backend
rm database.sqlite
npm run init-db
```

### Puerto ocupado
```bash
# Cambiar PORT en backend/.env
# O liberar el puerto
lsof -ti:3001 | xargs kill -9
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👥 Créditos

Desarrollado para el evento Camaggi 2025.

---

## 📞 Soporte

Para preguntas o problemas:
1. Revisa la [documentación](./docs/)
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles

---

**¡Que comience la subasta! 🎉**
