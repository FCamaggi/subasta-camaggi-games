# 🚀 Inicio Rápido - Sistema de Subastas Camaggi

## ⚡ TL;DR - Empezar en 2 Minutos

```bash
# 1. Backend
cd backend
npm install
npm run init-db
npm start

# 2. Frontend (en otra terminal)
cd frontend
npm install
npm run dev

# 3. Abrir navegador
# http://localhost:5173
```

**Credenciales**:
- Admin: `admin` / `cumpleaños2025`
- Tokens de equipos: Ver en la terminal después de `npm run init-db`

---

## 📚 Navegación Rápida

### Documentación

| Documento | Descripción | Cuándo Leer |
|-----------|-------------|-------------|
| **[README.md](./README.md)** | Información general | 👈 Empieza aquí |
| **[docs/INDEX.md](./docs/INDEX.md)** | Índice completo | Para navegación |
| **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** | Guía de deployment | Antes del evento |
| **[docs/API.md](./docs/API.md)** | Doc de la API | Para desarrollo |
| **[docs/FRONTEND.md](./docs/FRONTEND.md)** | Doc del frontend | Para desarrollo |
| **[CREDENCIALES.md](./CREDENCIALES.md)** | Accesos al sistema | Para login |
| **[RESUMEN-FINAL.md](./RESUMEN-FINAL.md)** | Estado del proyecto | Resumen ejecutivo |

---

## 🎯 Casos de Uso Comunes

### Caso 1: Primera Vez - Probar el Sistema

```bash
# 1. Instalar
cd backend && npm install
cd ../frontend && npm install

# 2. Inicializar BD (guarda los tokens que aparecen)
cd backend && npm run init-db

# 3. Iniciar (2 terminales)
cd backend && npm start
cd frontend && npm run dev

# 4. Abrir http://localhost:5173
# Login como Admin: admin / cumpleaños2025
```

---

### Caso 2: Día del Evento - Deployment

```bash
# 1. Iniciar backend
cd backend && npm start

# 2. Exponer con ngrok (otra terminal)
ngrok http 3001

# 3. Deploy frontend en Netlify
# - Conectar repo de GitHub
# - Build: npm run build
# - Publish: frontend/dist
# - Variable: VITE_API_URL = https://tu-url-ngrok.app

# 4. Compartir URL de Netlify con participantes
```

Ver guía completa: **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)**

---

### Caso 3: Base de Datos Corrupta

```bash
cd backend
rm database.sqlite
npm run init-db
npm start
```

**Importante**: Guarda los nuevos tokens que aparecen.

---

### Caso 4: Necesito Nuevos Tokens

```bash
cd backend
npm run init-db
```

Copia los tokens que aparecen en la terminal y guárdalos en `CREDENCIALES.md`

---

## 🔑 Accesos Rápidos

### URLs

| Entorno | Frontend | Backend |
|---------|----------|---------|
| **Desarrollo** | http://localhost:5173 | http://localhost:3001 |
| **Producción** | Tu URL de Netlify | Tu URL de ngrok |

### Credenciales

| Rol | Usuario/Token | Dónde Ver |
|-----|---------------|-----------|
| **Admin** | `admin` / `cumpleaños2025` | `CREDENCIALES.md` |
| **Equipo Azul** | Token generado | Terminal después de `npm run init-db` |
| **Equipo Rojo** | Token generado | Terminal después de `npm run init-db` |
| **Espectador** | Sin credenciales | N/A |

---

## 🛠️ Comandos Útiles

### Backend

```bash
# Instalar dependencias
npm install

# Inicializar base de datos
npm run init-db

# Iniciar servidor
npm start

# Eliminar base de datos
rm database.sqlite
```

### Frontend

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

### ngrok

```bash
# Exponer puerto 3001
ngrok http 3001

# Con subdomain (plan de pago)
ngrok http 3001 --subdomain=subasta-camaggi
```

---

## 🐛 Problemas Comunes

### Error: Puerto 3001 ocupado

```bash
# Encontrar proceso
lsof -ti:3001

# Matar proceso
kill -9 $(lsof -ti:3001)

# O cambiar puerto en backend/.env
PORT=3002
```

### Error: CORS

```bash
# Verificar FRONTEND_URL en backend/.env
FRONTEND_URL=http://localhost:5173

# Reiniciar backend
cd backend && npm start
```

### Error: Cannot find module

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: Database locked

```bash
# Cerrar backend y eliminar BD
cd backend
rm database.sqlite
npm run init-db
npm start
```

---

## 📱 Probar el Sistema

### 1. Como Admin

1. Ir a http://localhost:5173
2. Modo "Admin"
3. Login: `admin` / `cumpleaños2025`
4. Crear una ronda
5. Iniciar la ronda

### 2. Como Equipo

1. Abrir nueva ventana en http://localhost:5173
2. Modo "Equipo"
3. Pegar token del equipo
4. Ver ronda activa
5. Realizar puja o presionar STOP

### 3. Como Espectador

1. Abrir nueva ventana en http://localhost:5173
2. Modo "Espectador" (por defecto)
3. Click en "Ver como Espectador"
4. Ver ronda activa en tiempo real

---

## 📞 Necesitas Ayuda?

1. **Troubleshooting**: Ver [README.md](./README.md#troubleshooting)
2. **Deployment**: Ver [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)
3. **API**: Ver [docs/API.md](./docs/API.md)
4. **Frontend**: Ver [docs/FRONTEND.md](./docs/FRONTEND.md)

---

## ✅ Checklist Pre-Evento

- [ ] Backend funciona localmente
- [ ] Frontend funciona localmente
- [ ] Puedo crear rondas como admin
- [ ] Puedo pujar como equipo
- [ ] Vista de espectador muestra todo en tiempo real
- [ ] Tengo cuenta en Netlify
- [ ] Tengo ngrok instalado
- [ ] He guardado las credenciales
- [ ] He leído [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## 🎉 ¡Listo!

El sistema está completo y funcionando. 

**Siguiente paso**: Leer [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) para preparar el deployment del día del evento.

**¡Que comience la subasta! 🎊**
