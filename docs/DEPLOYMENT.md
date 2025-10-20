# 🚀 Guía de Deployment - Subasta Camaggi

## 📋 Tabla de Contenidos
- [Pre-requisitos](#pre-requisitos)
- [Configuración Inicial](#configuración-inicial)
- [Deployment del Frontend (Netlify)](#deployment-del-frontend-netlify)
- [Servidor Backend Local](#servidor-backend-local)
- [Exposición con ngrok](#exposición-con-ngrok)
- [Configuración Final](#configuración-final)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Pre-requisitos

### Software Necesario
- **Node.js** v18 o superior
- **npm** v9 o superior
- **ngrok** (para exponer el servidor local)
- Cuenta en **Netlify** (gratuita)

### Instalación de ngrok
```bash
# Opción 1: Descargar desde https://ngrok.com/download
# Opción 2: Con npm
npm install -g ngrok

# Configurar token de ngrok (obtener en https://dashboard.ngrok.com/get-started/your-authtoken)
ngrok config add-authtoken TU_TOKEN_AQUI
```

---

## ⚙️ Configuración Inicial

### 1. Clonar/Preparar el Proyecto

```bash
cd /ruta/a/tu/proyecto/subasta
```

### 2. Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### 3. Instalar Dependencias del Frontend

```bash
cd ../frontend
npm install
```

### 4. Configurar Variables de Entorno del Backend

Edita `backend/.env`:

```env
# Servidor
PORT=3001
NODE_ENV=production

# Base de datos
DATABASE_PATH=./database.sqlite

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=cumpleaños2025

# Seguridad
JWT_SECRET=tu-secreto-jwt-muy-seguro-cambialo

# Frontend (se actualizará después del deploy de Netlify)
FRONTEND_URL=http://localhost:5173
```

⚠️ **IMPORTANTE**: El `FRONTEND_URL` se actualizará después de deployar en Netlify.

---

## 🌐 Deployment del Frontend (Netlify)

### Opción A: Deploy desde Git (Recomendado)

1. **Sube tu código a GitHub/GitLab/Bitbucket**

2. **Ve a Netlify**
   - Ir a https://app.netlify.com/
   - Click en "Add new site" → "Import an existing project"

3. **Conecta tu repositorio**
   - Selecciona tu proveedor de Git
   - Autoriza el acceso
   - Selecciona el repositorio

4. **Configuración de Build**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

5. **Variables de Entorno en Netlify**
   - En el dashboard de Netlify: Site settings → Environment variables
   - Agregar variable:
     ```
     VITE_API_URL = https://TU-DOMINIO-NGROK.ngrok-free.app
     ```
   ⚠️ Este valor se actualizará después de configurar ngrok

6. **Deploy**
   - Click en "Deploy site"
   - Espera a que complete el build
   - Copia la URL del sitio (ej: `https://subasta-camaggi.netlify.app`)

### Opción B: Deploy Manual (Rápido)

1. **Build del Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy con Netlify CLI**
   ```bash
   # Instalar Netlify CLI
   npm install -g netlify-cli
   
   # Login
   netlify login
   
   # Deploy
   cd frontend
   netlify deploy --prod --dir=dist
   ```

3. **Copia la URL del sitio deployado**

---

## 💻 Servidor Backend Local

### 1. Inicializar Base de Datos

```bash
cd backend
npm run init-db
```

Esto creará la base de datos y mostrará los **tokens de los equipos**:

```
╔════════════════════════════════════════╗
║         TOKENS DE ACCESO               ║
╚════════════════════════════════════════╝

🔵 Equipo Azul:
   Token: abc123def456...

🔴 Equipo Rojo:
   Token: xyz789uvw012...

⚠️  GUARDA ESTOS TOKENS DE FORMA SEGURA
```

**⚠️ IMPORTANTE**: Guarda estos tokens para dar acceso a los equipos.

### 2. Actualizar FRONTEND_URL en el Backend

Edita `backend/.env` con la URL de Netlify:

```env
FRONTEND_URL=https://tu-sitio.netlify.app
```

### 3. Iniciar el Servidor Backend

```bash
cd backend
npm start
```

Deberías ver:

```
╔════════════════════════════════════════╗
║   🎉 Servidor de Subasta Iniciado     ║
╚════════════════════════════════════════╝

🌐 Puerto: 3001
🔧 Modo: production
📡 WebSocket: Activo
✅ Base de datos: Conectada
```

**⚠️ NO CIERRES ESTA TERMINAL** - El servidor debe estar corriendo durante todo el juego.

---

## 🌍 Exposición con ngrok

### 1. Abrir Nueva Terminal

Deja el servidor backend corriendo y abre una nueva terminal.

### 2. Iniciar ngrok

```bash
ngrok http 3001
```

Verás algo como:

```
ngrok                                                          (Ctrl+C to quit)

Session Status                online
Account                       tu-cuenta (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123def456.ngrok-free.app -> http://localhost:3001

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

### 3. Copiar la URL de Forwarding

Copia la URL HTTPS: `https://abc123def456.ngrok-free.app`

**⚠️ NO CIERRES ESTA TERMINAL** - ngrok debe estar corriendo durante todo el juego.

---

## 🔧 Configuración Final

### 1. Actualizar Variable de Entorno en Netlify

1. Ve a Netlify Dashboard → Tu sitio → Site settings → Environment variables
2. Edita `VITE_API_URL`:
   ```
   VITE_API_URL = https://abc123def456.ngrok-free.app
   ```
3. **Redeploy el sitio**:
   - Ve a "Deploys"
   - Click en "Trigger deploy" → "Deploy site"

### 2. Verificar Conexión

1. Abre tu sitio de Netlify en el navegador
2. Verifica en la consola del navegador (F12) que no haya errores CORS
3. Prueba el login de espectador

---

## 📊 Flujo Completo de Inicio

### El Día del Evento

#### Terminal 1: Backend
```bash
cd /ruta/a/subasta/backend
npm start
```

#### Terminal 2: ngrok
```bash
ngrok http 3001
```

#### Verificación
1. ✅ Backend corriendo en `localhost:3001`
2. ✅ ngrok mostrando URL pública
3. ✅ Frontend en Netlify con `VITE_API_URL` actualizada
4. ✅ Tokens de equipos guardados

---

## 🎮 Credenciales de Acceso

### Admin
- **Usuario**: `admin`
- **Contraseña**: `cumpleaños2025`
- **URL**: `https://tu-sitio.netlify.app`

### Equipos
- **Equipo Azul**: Token generado en `npm run init-db`
- **Equipo Rojo**: Token generado en `npm run init-db`
- **URL**: `https://tu-sitio.netlify.app`

### Espectadores
- **Sin credenciales** - Acceso directo desde la pantalla de login
- **URL**: `https://tu-sitio.netlify.app`

---

## 🐛 Troubleshooting

### Error: CORS en el navegador

**Problema**: Errores como `blocked by CORS policy`

**Solución**:
1. Verifica que `FRONTEND_URL` en `backend/.env` coincida EXACTAMENTE con la URL de Netlify
2. Reinicia el servidor backend
3. Verifica que `VITE_API_URL` en Netlify apunte a la URL de ngrok
4. Redeploy el frontend en Netlify

### Error: 429 Too Many Requests

**Problema**: Demasiadas peticiones bloqueadas

**Solución**:
- En desarrollo: Ya configurado para permitir 1000 req/min
- En producción: Configurado para 100 req/min (suficiente para el juego)

### ngrok: Session expired

**Problema**: URL de ngrok cambia después de 2 horas (plan gratuito)

**Solución**:
1. Reinicia ngrok (la URL cambiará)
2. Copia la nueva URL
3. Actualiza `VITE_API_URL` en Netlify
4. Redeploy el frontend

**Mejor opción**: Suscripción a ngrok Pro para URLs fijas.

### Backend no conecta a la base de datos

**Problema**: Error al iniciar el servidor

**Solución**:
```bash
cd backend
rm database.sqlite
npm run init-db
npm start
```

### Frontend muestra página en blanco

**Problema**: Build del frontend falló

**Solución**:
```bash
cd frontend
rm -rf dist node_modules
npm install
npm run build
```

Luego redeploy en Netlify.

---

## 🔐 Seguridad para Producción

### Antes del Evento

1. **Cambia la contraseña de admin** en `backend/.env`
2. **Cambia el JWT_SECRET** a un valor aleatorio largo
3. **No compartas los tokens** de los equipos públicamente
4. **Backup de la base de datos** después de crear las rondas

### Durante el Evento

1. **Monitorea ngrok** - asegúrate de que la conexión esté activa
2. **Monitorea el backend** - revisa la terminal por errores
3. **Ten los tokens** a mano para dar acceso a los equipos

---

## 📝 Checklist Pre-Evento

- [ ] Backend instalado y probado
- [ ] Frontend deployado en Netlify
- [ ] ngrok instalado y configurado
- [ ] Variables de entorno configuradas
- [ ] Base de datos inicializada
- [ ] Tokens de equipos guardados
- [ ] Rondas creadas desde el panel de admin
- [ ] Probado login de admin
- [ ] Probado login de equipos
- [ ] Probado vista de espectador
- [ ] Probado ciclo completo de una subasta

---

## 🎉 ¡Listo!

Tu sistema de subastas está deployado y listo para el evento. Los espectadores podrán ver las subastas en vivo desde cualquier dispositivo, y los equipos podrán pujar desde sus dispositivos móviles o computadoras.

**URLs Finales**:
- 🌐 **Frontend**: `https://tu-sitio.netlify.app`
- 🔌 **Backend**: `http://localhost:3001` (local)
- 🌍 **Backend Público**: `https://tu-dominio.ngrok-free.app`

---

**Documentación adicional**:
- [README.md](../README.md) - Información general del proyecto
- [API.md](./API.md) - Documentación de la API del backend
- [FRONTEND.md](./FRONTEND.md) - Documentación del frontend
