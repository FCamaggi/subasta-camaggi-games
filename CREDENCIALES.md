# 🔑 Credenciales de Acceso - Sistema de Subastas Camaggi

**⚠️ IMPORTANTE**: Este archivo contiene información sensible. NO lo compartas públicamente.

---

## 👤 Administrador

### Credenciales
- **Usuario**: `admin`
- **Contraseña**: `cumpleaños2025`
- **URL**: Tu dominio de Netlify o http://localhost:5173

### Acceso
1. Ir a la página de login
2. Seleccionar modo "Admin"
3. Ingresar usuario y contraseña
4. Click en "Iniciar Sesión"

---

## 🎯 Equipos

### Equipo Azul 🔵
- **Token**: `16792f573cf2f685517eb379fde2fb82`
- **Balance Inicial**: $10,000.00
- **Color**: #3B82F6

### Equipo Rojo 🔴
- **Token**: `56dfd6950eec9fe73b06fb5671ed2277`
- **Balance Inicial**: $10,000.00
- **Color**: #EF4444

### Acceso
1. Ir a la página de login
2. Seleccionar modo "Equipo"
3. Pegar el token correspondiente
4. Click en "Acceder"

---

## 👥 Espectadores

### Acceso
1. Ir a la página de login
2. Modo "Espectador" ya está seleccionado por defecto
3. Click en "Ver como Espectador"
4. No requiere credenciales

---

## 🔄 Regenerar Tokens

Si necesitas regenerar la base de datos y obtener nuevos tokens:

```bash
cd backend
rm database.sqlite
npm run init-db
```

Esto mostrará los nuevos tokens en la terminal.

---

## 📝 Notas

- Los tokens de los equipos son **persistentes** y no expiran
- El token de admin (JWT) expira en **24 horas**
- Los tokens se generan aleatoriamente en cada inicialización
- Guarda este archivo de forma segura durante el evento

---

**Última actualización de tokens**: 20 de octubre, 2025
