# 📚 Índice de Documentación - Sistema de Subastas Camaggi

Documentación completa del sistema de subastas en tiempo real.

---

## 📄 Documentos Principales

### 🏠 [README.md](../README.md)
**Información general del proyecto**
- Descripción del sistema
- Stack tecnológico
- Quick start
- Estructura del proyecto
- Funcionalidades
- Troubleshooting

👉 **Lee esto primero** para entender el proyecto.

---

### 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md)
**Guía completa de deployment**
- Pre-requisitos (Node.js, ngrok, Netlify)
- Configuración inicial
- Deploy del frontend en Netlify
- Configuración del servidor backend local
- Exposición con ngrok
- Troubleshooting de deployment
- Checklist pre-evento

👉 **Lee esto** cuando vayas a deployar para el evento.

---

### 📡 [API.md](./API.md)
**Documentación completa de la API**
- Endpoints REST (auth, teams, rounds, bids)
- Eventos WebSocket (servidor ↔ cliente)
- Modelos de datos (Team, Round, Bid, Transaction)
- Códigos de error
- Ejemplos de uso
- Testing con cURL

👉 **Lee esto** si necesitas entender cómo funciona el backend.

---

### 🎨 [FRONTEND.md](./FRONTEND.md)
**Documentación del frontend**
- Arquitectura y estructura
- Componentes y páginas (Login, Admin, Team, Spectator)
- Servicios (API, Socket)
- Hooks personalizados (useAuth)
- Routing y protección de rutas
- Estilos con TailwindCSS
- Gestión de estado

👉 **Lee esto** si necesitas entender cómo funciona el frontend.

---

### 🔑 [CREDENCIALES.md](../CREDENCIALES.md)
**Credenciales de acceso**
- Usuario y contraseña de admin
- Tokens de los equipos
- Instrucciones de acceso
- Cómo regenerar tokens

👉 **Lee esto** para obtener las credenciales de acceso.

⚠️ **CONFIDENCIAL** - No compartas este archivo públicamente.

---

## 🗂️ Estructura de Archivos

```
subasta/
├── README.md                    # 👈 Empieza aquí
├── CREDENCIALES.md             # 🔑 Credenciales de acceso
│
├── docs/                       # 📚 Documentación
│   ├── DEPLOYMENT.md           # 🚀 Guía de deployment
│   ├── API.md                  # 📡 Documentación de API
│   └── FRONTEND.md             # 🎨 Documentación de frontend
│
├── backend/                    # 🔧 Servidor Node.js
│   ├── src/
│   │   ├── models/            # Modelos de BD
│   │   ├── routes/            # Rutas REST
│   │   ├── sockets/           # WebSocket handlers
│   │   ├── auth/              # Autenticación
│   │   ├── middleware/        # Middlewares
│   │   ├── config/            # Configuración
│   │   ├── scripts/           # Scripts de inicialización
│   │   └── server.js          # Punto de entrada
│   ├── .env                   # Variables de entorno
│   ├── package.json
│   └── database.sqlite        # Base de datos
│
├── frontend/                   # 🎨 App React
│   ├── src/
│   │   ├── pages/             # Componentes de páginas
│   │   ├── services/          # API y Socket
│   │   ├── hooks/             # Hooks personalizados
│   │   ├── App.jsx            # Componente raíz
│   │   └── main.jsx           # Punto de entrada
│   ├── .env                   # Variables de entorno
│   └── package.json
│
├── start-backend.sh            # Script para iniciar backend
└── start-frontend.sh           # Script para iniciar frontend
```

---

## 🚦 Flujo de Lectura Recomendado

### Para Desarrolladores

1. **[README.md](../README.md)** - Visión general y quick start
2. **[FRONTEND.md](./FRONTEND.md)** - Arquitectura del frontend
3. **[API.md](./API.md)** - Arquitectura del backend
4. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy en producción

### Para Deployment

1. **[README.md](../README.md)** - Quick start local
2. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía completa de deployment
3. **[CREDENCIALES.md](../CREDENCIALES.md)** - Obtener credenciales

### Para Troubleshooting

1. **[README.md](../README.md)** - Sección de troubleshooting
2. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Troubleshooting de deployment
3. **[API.md](./API.md)** - Códigos de error y debugging

---

## 🎯 Accesos Rápidos

### Comandos Frecuentes

```bash
# Inicializar base de datos
cd backend && npm run init-db

# Iniciar backend
cd backend && npm start

# Iniciar frontend
cd frontend && npm run dev

# Build de producción
cd frontend && npm run build

# Exponer backend con ngrok
ngrok http 3001
```

### URLs Importantes

- **Frontend Dev**: http://localhost:5173
- **Backend Dev**: http://localhost:3001
- **Frontend Prod**: Tu dominio de Netlify
- **Backend Prod**: Tu URL de ngrok

---

## 📞 Soporte

### Encontraste un Bug?

1. Revisa la sección de **Troubleshooting** en [README.md](../README.md)
2. Revisa [DEPLOYMENT.md](./DEPLOYMENT.md) si es un problema de deployment
3. Revisa [API.md](./API.md) para errores de API

### Necesitas Ayuda?

1. Revisa la documentación correspondiente
2. Busca en los issues existentes del repositorio
3. Crea un nuevo issue con detalles

---

## ✅ Checklist de Documentación

- [x] README.md - Información general
- [x] DEPLOYMENT.md - Guía de deployment completa
- [x] API.md - Documentación completa de la API
- [x] FRONTEND.md - Documentación del frontend
- [x] CREDENCIALES.md - Credenciales de acceso
- [x] Código comentado y organizado
- [x] Scripts de automatización
- [x] Variables de entorno documentadas

---

## 🎉 Todo Listo!

La documentación está completa y organizada. Tienes todo lo necesario para:

✅ Entender el proyecto  
✅ Desarrollar nuevas features  
✅ Deployar en producción  
✅ Troubleshooting de problemas  
✅ Acceder al sistema  

**¡Que comience la subasta!** 🎊

---

**Última actualización**: 20 de octubre, 2025
