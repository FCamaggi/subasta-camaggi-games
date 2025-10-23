# 🎬 Período de Presentación - Documentación

## Resumen

El período de presentación es una mecánica que permite dar 30 segundos al inicio de cada ronda para que el anfitrión explique el item sin que se puedan hacer pujas ni corra el timer de inactividad.

## ⚙️ Configuración

- **Duración**: 30 segundos (configurable en `Round.presentationTime`)
- **Timer de inactividad**: 3 minutos (configurado en `socketHandler.js`)
- **Comportamiento**: Durante la presentación NO se puede pujar y NO corre el timer de auto-cierre

## 🔄 Flujo de Funcionamiento

### 1. Inicio de Ronda

```
Admin hace clic en "Iniciar Ronda"
    ↓
Backend calcula presentationEndsAt = now + 30 segundos
    ↓
Se emite evento round:presentationStarted
    ↓
Frontend muestra PresentationTimer (contador amarillo)
    ↓
Pujas BLOQUEADAS
    ↓
Timer de inactividad NO INICIA
```

### 2. Durante Presentación (0-30 segundos)

```
Equipo intenta pujar
    ↓
Backend valida presentationEndsAt
    ↓
Si presentationEndsAt > now:
    ❌ Rechaza puja
    📤 Emite error: "Debes esperar X segundos"
    
Si presentationEndsAt <= now:
    ✅ Acepta puja
```

### 3. Fin de Presentación (30 segundos)

```
Timer de presentación expira
    ↓
Backend emite round:presentationEnded
    ↓
Frontend oculta PresentationTimer
    ↓
Se inicia timer de inactividad (3 minutos)
    ↓
Pujas DESBLOQUEADAS
```

## 📁 Archivos Modificados

### Backend

#### `backend/src/models/Round.js`
```javascript
// Nuevos campos
presentationTime: {
  type: DataTypes.INTEGER,
  allowNull: false,
  defaultValue: 30000 // 30 segundos en ms
},
presentationEndsAt: {
  type: DataTypes.DATE,
  allowNull: true
}
```

#### `backend/src/sockets/socketHandler.js`

**Constantes**:
```javascript
INACTIVITY_TIMEOUT = 3 * 60 * 1000 // 3 minutos
this.presentationTimers = new Map()
```

**Evento `admin:startRound`** (líneas 35-89):
- Calcula `presentationEndsAt`
- Guarda en base de datos
- Inicia timer de presentación
- Emite `round:presentationStarted`
- Al expirar: emite `round:presentationEnded` e inicia timer de inactividad

**Evento `team:bid`** (líneas 204-227):
```javascript
// Validación de presentación
if (round.presentationEndsAt && new Date() < new Date(round.presentationEndsAt)) {
  const remainingSeconds = Math.ceil((new Date(round.presentationEndsAt) - new Date()) / 1000);
  socket.emit('bid:error', {
    message: `⏳ Debes esperar ${remainingSeconds} segundos hasta que termine la presentación del item`
  });
  return;
}
```

**Función `cancelInactivityTimer()`**:
- También cancela `presentationTimers` si existen

#### `backend/src/scripts/initDb.js`
- 10 rondas personalizadas con `presentationTime: 30000`

### Frontend

#### `frontend/src/components/PresentationTimer.jsx` (NUEVO)
```jsx
// Componente visual de contador
- Fondo amarillo con animate-pulse
- Emoji 🎬
- Mensaje: "Presentando el Item"
- Contador de segundos
- Actualización cada 100ms
```

#### `frontend/src/pages/AdminDashboard.jsx`
- Importado `PresentationTimer`
- Estado: `presentationTimers`
- Listeners: `round:presentationStarted`, `round:presentationEnded`
- Lógica condicional: muestra PresentationTimer si hay presentación, sino InactivityTimer

#### `frontend/src/pages/TeamDashboard.jsx`
- Igual que AdminDashboard
- Bloqueo visual de input de pujas (backend ya valida)

#### `frontend/src/pages/SpectatorView.jsx`
- Igual que AdminDashboard

## 🎯 Eventos Socket.io

### `round:presentationStarted`
**Emitido por**: Backend (al iniciar ronda)  
**Payload**: 
```javascript
{
  roundId: number,
  presentationEndsAt: string (ISO date)
}
```
**Escuchado por**: AdminDashboard, TeamDashboard, SpectatorView

### `round:presentationEnded`
**Emitido por**: Backend (después de 30 segundos)  
**Payload**: 
```javascript
{
  roundId: number
}
```
**Escuchado por**: AdminDashboard, TeamDashboard, SpectatorView

### `bid:error`
**Emitido por**: Backend (cuando intenta pujar en presentación)  
**Payload**: 
```javascript
{
  message: string // "⏳ Debes esperar X segundos..."
}
```
**Escuchado por**: TeamDashboard

## 🧪 Testing

### Casos de Prueba

1. **Inicio de presentación**
   - [ ] Admin inicia ronda
   - [ ] Se muestra contador de 30 segundos en todas las vistas
   - [ ] Fondo amarillo con mensaje "Presentando el Item"

2. **Durante presentación**
   - [ ] Equipo intenta pujar
   - [ ] Recibe mensaje de error con segundos restantes
   - [ ] Pujas son rechazadas

3. **Fin de presentación**
   - [ ] Contador llega a 0
   - [ ] PresentationTimer desaparece
   - [ ] Inicia InactivityTimer (3 minutos)
   - [ ] Pujas son permitidas

4. **Sincronización**
   - [ ] Usuario entra tarde durante presentación
   - [ ] Ve el contador con tiempo restante correcto

5. **Rondas especiales**
   - [ ] Presentación funciona igual
   - [ ] Después de presentación inicia descenso de precio

## 📝 Notas Importantes

1. **No confundir timers**:
   - `presentationTimers`: 30 segundos de presentación
   - `inactivityTimers`: 3 minutos de auto-cierre
   - Son independientes y secuenciales

2. **Orden de eventos**:
   ```
   Inicio → Presentación (30s) → Timer inactividad (3min) → Auto-cierre
   ```

3. **Pujas durante presentación**:
   - Backend siempre valida `presentationEndsAt`
   - No depende del estado del frontend
   - Mensaje de error dinámico con segundos restantes

4. **Limpieza de timers**:
   - Al cerrar ronda manualmente se cancelan AMBOS timers
   - Al expirar presentación se limpia su timer
   - Al expirar inactividad se auto-cierra la ronda

## 🚀 Deploy

1. **Backend (Render)**:
   ```bash
   # Render auto-deploya al hacer push a master
   # Después del deploy, reinicializar BD para crear nuevas rondas:
   rm database.sqlite && npm run init-db
   ```

2. **Frontend (Netlify)**:
   ```bash
   # Netlify auto-deploya al hacer push a master
   # Build se hace automáticamente
   ```

## 🐛 Troubleshooting

### Problema: Contador no aparece
- Verificar listeners en useEffect
- Verificar import de PresentationTimer
- Verificar estado `presentationEndsAt`

### Problema: Pujas permitidas durante presentación
- Verificar validación en backend (team:bid)
- Verificar que `presentationEndsAt` se guardó en BD
- Verificar sincronización de tiempo entre cliente/servidor

### Problema: Timer de inactividad inicia antes de tiempo
- Verificar que `startInactivityTimer()` se llama DESPUÉS de presentación
- Verificar logs en backend: "🎬 Presentación finalizada"
- Verificar que timer de presentación no se cancela prematuramente

## ✅ Checklist de Implementación

- [x] Modelo Round con campos de presentación
- [x] Lógica backend de presentación en socketHandler
- [x] Validación de pujas durante presentación
- [x] Componente PresentationTimer
- [x] Integración en AdminDashboard
- [x] Integración en TeamDashboard
- [x] Integración en SpectatorView
- [x] Listeners socket en todas las vistas
- [x] Limpieza de listeners en cleanup
- [x] Build y deploy de frontend
- [ ] Reinicializar BD en producción
- [ ] Testing en producción

## 📚 Referencias

- Sistema de auto-cierre: `docs/CHANGELOG-AUTO-CLOSE.md`
- Rondas personalizadas: `backend/src/scripts/initDb.js` líneas 60-163
- Documentación de deployment: `docs/DEPLOYMENT-RENDER.md`
