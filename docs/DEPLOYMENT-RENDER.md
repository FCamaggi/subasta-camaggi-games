# 🚀 Guía de Deployment en Render

## Paso 1: Preparar el Repositorio

Ya tienes el código en Git. Asegúrate de hacer push de todos los cambios:

```bash
cd /home/fabrizio/code/cumpleaños/actividades/subasta
git add .
git commit -m "Preparando para deployment en Render"
git push
```

## Paso 2: Crear cuenta en Render

1. Ve a: https://render.com
2. Regístrate o inicia sesión (puedes usar tu cuenta de GitHub)

## Paso 3: Crear el Servicio de Backend

### Opción A: Usando render.yaml (Recomendado)

1. En el dashboard de Render, haz clic en **"New +"** → **"Blueprint"**
2. Conecta tu repositorio de GitHub
3. Render detectará automáticamente el archivo `render.yaml`
4. Haz clic en **"Apply"**

### Opción B: Manual

1. En el dashboard de Render, haz clic en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Configura lo siguiente:

**Configuración Básica:**
- Name: `subasta-camaggi-backend`
- Region: `Oregon` (o el más cercano a tu ubicación)
- Branch: `master` (o `main`)
- Root Directory: `.` (raíz del proyecto)

**Build & Deploy:**
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && ./start-render.sh`

**Environment Variables:**
```
NODE_ENV=production
PORT=3001
ADMIN_PASSWORD=cumpleaños2025
FRONTEND_URL=https://subasta-camaggi-games.netlify.app
```

**Plan:**
- Selecciona el plan **Free** (suficiente para empezar)

4. Haz clic en **"Create Web Service"**

## Paso 4: Obtener la URL del Backend

Una vez que el servicio se despliegue (tomará unos minutos), verás una URL como:

```
https://subasta-camaggi-backend.onrender.com
```

**¡Guarda esta URL!** La necesitarás para el siguiente paso.

## Paso 5: Actualizar el Frontend en Netlify

1. En tu computadora, actualiza el archivo `.env.production`:

```bash
cd /home/fabrizio/code/cumpleaños/actividades/subasta/frontend
```

Edita `.env.production` y pon la URL de Render:

```
VITE_API_URL=https://subasta-camaggi-backend.onrender.com
```

2. Haz el build del frontend:

```bash
npm run build
```

3. Ve a Netlify y actualiza la variable de entorno:
   - Ve a: https://app.netlify.com/sites/subasta-camaggi-games/settings/deploys
   - En **Environment variables**, actualiza `VITE_API_URL` con la URL de Render
   - Haz un nuevo deploy arrastrando la carpeta `dist/`

## Paso 6: Obtener los Tokens de los Equipos

La primera vez que el backend se inicie en Render, creará la base de datos y generará los tokens.

Para ver los logs y obtener los tokens:

1. En el dashboard de Render, ve a tu servicio
2. Haz clic en **"Logs"**
3. Busca las líneas que dicen:

```
✅ Equipos creados:
  - Equipo Azul: [TOKEN_AZUL]
  - Equipo Rojo: [TOKEN_ROJO]
```

**¡Guarda estos tokens!** Los necesitarás para que los equipos puedan hacer login.

## Notas Importantes

### Plan Free de Render:
- El servicio se **duerme después de 15 minutos** de inactividad
- La primera petición después de dormir tomará ~30 segundos
- Suficiente para el evento, pero ten en cuenta el delay inicial

### Base de Datos SQLite:
- Render usa almacenamiento efímero en el plan free
- Si el servicio se reinicia, se perderá la base de datos
- Para producción real, considera actualizar a plan de pago con disco persistente

### CORS:
- Ya está configurado para permitir `*.netlify.app`
- Si cambias el dominio del frontend, actualiza `FRONTEND_URL` en Render

## Troubleshooting

### El servicio no inicia:
- Revisa los logs en Render
- Verifica que `start-render.sh` tenga permisos de ejecución
- Asegúrate de que todas las dependencias estén en `package.json`

### Error de CORS:
- Verifica que `FRONTEND_URL` en Render apunte a Netlify
- Asegúrate de que la URL no tenga `/` al final

### La base de datos se borra:
- Esto es normal en el plan free cuando el servicio se reinicia
- Considera agregar un script que haga backup de `database.sqlite`
- O usar un servicio de base de datos externo (PostgreSQL en Render)

## Comandos Útiles

**Ver logs en tiempo real:**
```bash
# Desde el dashboard de Render → Logs
```

**Reiniciar el servicio:**
```bash
# Desde el dashboard de Render → Manual Deploy → Deploy latest commit
```

**Actualizar variables de entorno:**
```bash
# Desde el dashboard de Render → Environment → Edit
```

## URLs Finales

Después de completar todos los pasos:

- **Backend**: https://subasta-camaggi-backend.onrender.com
- **Frontend**: https://subasta-camaggi-games.netlify.app
- **Admin Login**: admin / cumpleaños2025
- **Equipo Azul**: [TOKEN generado en logs]
- **Equipo Rojo**: [TOKEN generado en logs]

¡Listo! 🎉
