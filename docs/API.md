# 📡 Documentación de la API - Backend

## 📋 Tabla de Contenidos
- [Información General](#información-general)
- [Autenticación](#autenticación)
- [REST API Endpoints](#rest-api-endpoints)
- [WebSocket Events](#websocket-events)
- [Modelos de Datos](#modelos-de-datos)
- [Códigos de Error](#códigos-de-error)

---

## 🌐 Información General

### Base URL
- **Desarrollo**: `http://localhost:3001`
- **Producción**: `https://tu-dominio.ngrok-free.app`

### Configuración
- **CORS**: Configurado dinámicamente según `FRONTEND_URL`
- **Rate Limiting**: 
  - Desarrollo: Sin límite
  - Producción: 100 req/min por IP
- **WebSocket**: Socket.io en el mismo puerto

---

## 🔐 Autenticación

### Tipos de Autenticación

#### 1. Admin (JWT)
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "cumpleaños2025"
}
```

**Respuesta**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "admin"
}
```

**Uso del Token**:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 2. Equipos (Token Único)
```http
POST /api/teams/login
Content-Type: application/json

{
  "token": "16792f573cf2f685517eb379fde2fb82"
}
```

**Respuesta**:
```json
{
  "token": "16792f573cf2f685517eb379fde2fb82",
  "team": {
    "id": 1,
    "name": "Equipo Azul",
    "color": "#3B82F6",
    "balance": 10000.00
  }
}
```

**Uso del Token**:
```http
x-team-token: 16792f573cf2f685517eb379fde2fb82
```

#### 3. Espectadores
Sin autenticación. Acceso público a endpoints de solo lectura.

---

## 📡 REST API Endpoints

### 🔑 Autenticación

#### POST `/api/auth/login`
Login de administrador.

**Body**:
```json
{
  "username": "admin",
  "password": "cumpleaños2025"
}
```

**Respuesta 200**:
```json
{
  "token": "jwt-token-here",
  "role": "admin"
}
```

**Errores**:
- `401`: Credenciales inválidas

---

### 👥 Equipos

#### POST `/api/teams/login`
Login de equipo con token único.

**Body**:
```json
{
  "token": "16792f573cf2f685517eb379fde2fb82"
}
```

**Respuesta 200**:
```json
{
  "token": "16792f573cf2f685517eb379fde2fb82",
  "team": {
    "id": 1,
    "name": "Equipo Azul",
    "color": "#3B82F6",
    "balance": 10000.00
  }
}
```

**Errores**:
- `401`: Token inválido
- `500`: Error del servidor

---

#### GET `/api/teams`
Obtener lista de todos los equipos (información pública).

**Headers**: No requiere autenticación

**Respuesta 200**:
```json
[
  {
    "id": 1,
    "name": "Equipo Azul",
    "color": "#3B82F6",
    "balance": 8500.00
  },
  {
    "id": 2,
    "name": "Equipo Rojo",
    "color": "#EF4444",
    "balance": 9200.00
  }
]
```

---

#### GET `/api/teams/:id`
Obtener información de un equipo específico.

**Headers**: No requiere autenticación

**Parámetros**:
- `id` (number): ID del equipo

**Respuesta 200**:
```json
{
  "id": 1,
  "name": "Equipo Azul",
  "color": "#3B82F6",
  "balance": 8500.00
}
```

**Errores**:
- `404`: Equipo no encontrado

---

### 🎯 Rondas

#### GET `/api/rounds`
Obtener todas las rondas.

**Headers**: No requiere autenticación

**Respuesta 200**:
```json
[
  {
    "id": 1,
    "title": "Ronda 1: Primera Subasta",
    "type": "normal",
    "status": "completed",
    "minPrice": 100.00,
    "maxPrice": 1000.00,
    "minIncrement": 10.00,
    "currentPrice": 450.00,
    "duration": null,
    "winnerId": 1,
    "winnerTeam": {
      "name": "Equipo Azul",
      "color": "#3B82F6"
    }
  },
  {
    "id": 2,
    "title": "Ronda 2: Subasta Especial",
    "type": "special",
    "status": "active",
    "minPrice": 50.00,
    "maxPrice": 800.00,
    "currentPrice": 650.00,
    "decrementRate": 10.00,
    "duration": 60,
    "winnerId": null,
    "startedAt": "2025-10-20T15:30:00.000Z"
  }
]
```

---

#### GET `/api/rounds/:id`
Obtener detalles de una ronda específica con pujas.

**Headers**: No requiere autenticación

**Parámetros**:
- `id` (number): ID de la ronda

**Respuesta 200**:
```json
{
  "id": 1,
  "title": "Ronda 1: Primera Subasta",
  "type": "normal",
  "status": "active",
  "minPrice": 100.00,
  "maxPrice": 1000.00,
  "minIncrement": 10.00,
  "currentPrice": 350.00,
  "duration": null,
  "winnerId": null,
  "bids": [
    {
      "id": 1,
      "amount": 350.00,
      "timestamp": "2025-10-20T15:32:15.000Z",
      "team": {
        "id": 1,
        "name": "Equipo Azul",
        "color": "#3B82F6"
      }
    },
    {
      "id": 2,
      "amount": 320.00,
      "timestamp": "2025-10-20T15:31:45.000Z",
      "team": {
        "id": 2,
        "name": "Equipo Rojo",
        "color": "#EF4444"
      }
    }
  ]
}
```

**Errores**:
- `404`: Ronda no encontrada

---

#### POST `/api/rounds` 🔒
Crear nueva ronda (solo admin).

**Headers**:
```http
Authorization: Bearer <jwt-token>
```

**Body (Subasta Normal)**:
```json
{
  "title": "Ronda 1: Primera Subasta",
  "type": "normal",
  "minPrice": 100.00,
  "maxPrice": 1000.00,
  "minIncrement": 10.00
}
```

**Body (Subasta Especial)**:
```json
{
  "title": "Ronda 2: Subasta Rápida",
  "type": "special",
  "minPrice": 50.00,
  "maxPrice": 800.00,
  "decrementRate": 10.00,
  "duration": 60
}
```

**Respuesta 201**:
```json
{
  "id": 3,
  "title": "Ronda 1: Primera Subasta",
  "type": "normal",
  "status": "pending",
  "minPrice": 100.00,
  "maxPrice": 1000.00,
  "minIncrement": 10.00,
  "currentPrice": 100.00,
  "winnerId": null
}
```

**Validaciones**:
- `title`: Requerido, string
- `type`: Requerido, "normal" | "special"
- `minPrice`: Requerido, número > 0
- `maxPrice`: Requerido, número > minPrice
- `minIncrement`: Requerido para "normal", número > 0
- `decrementRate`: Requerido para "special", número > 0
- `duration`: Requerido para "special", número > 0 (segundos)

**Errores**:
- `401`: No autorizado
- `400`: Datos inválidos

---

### 💰 Pujas

#### GET `/api/bids`
Obtener todas las pujas.

**Headers**: No requiere autenticación

**Query Params** (opcionales):
- `roundId` (number): Filtrar por ronda
- `teamId` (number): Filtrar por equipo

**Respuesta 200**:
```json
[
  {
    "id": 1,
    "amount": 350.00,
    "timestamp": "2025-10-20T15:32:15.000Z",
    "roundId": 1,
    "teamId": 1,
    "team": {
      "name": "Equipo Azul",
      "color": "#3B82F6"
    },
    "round": {
      "title": "Ronda 1: Primera Subasta",
      "type": "normal"
    }
  }
]
```

---

#### GET `/api/bids/:id`
Obtener detalles de una puja específica.

**Headers**: No requiere autenticación

**Parámetros**:
- `id` (number): ID de la puja

**Respuesta 200**:
```json
{
  "id": 1,
  "amount": 350.00,
  "timestamp": "2025-10-20T15:32:15.000Z",
  "roundId": 1,
  "teamId": 1,
  "team": {
    "id": 1,
    "name": "Equipo Azul",
    "color": "#3B82F6"
  },
  "round": {
    "id": 1,
    "title": "Ronda 1: Primera Subasta",
    "type": "normal"
  }
}
```

**Errores**:
- `404`: Puja no encontrada

---

## 🔌 WebSocket Events

### Conexión

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('Conectado:', socket.id);
});
```

---

### 📡 Eventos del Servidor → Cliente

#### `round:started`
Se emite cuando el admin inicia una ronda.

**Payload**:
```json
{
  "id": 2,
  "title": "Ronda 2: Subasta Especial",
  "type": "special",
  "status": "active",
  "minPrice": 50.00,
  "maxPrice": 800.00,
  "currentPrice": 800.00,
  "decrementRate": 10.00,
  "duration": 60,
  "startedAt": "2025-10-20T15:30:00.000Z"
}
```

---

#### `round:closed`
Se emite cuando se cierra una ronda con un ganador.

**Payload**:
```json
{
  "id": 1,
  "title": "Ronda 1: Primera Subasta",
  "status": "completed",
  "winnerId": 1,
  "winnerTeam": {
    "id": 1,
    "name": "Equipo Azul",
    "color": "#3B82F6"
  },
  "currentPrice": 450.00
}
```

---

#### `bid:new`
Se emite cuando un equipo realiza una puja.

**Payload**:
```json
{
  "id": 15,
  "roundId": 1,
  "teamId": 2,
  "amount": 380.00,
  "timestamp": "2025-10-20T15:33:20.000Z",
  "team": {
    "name": "Equipo Rojo",
    "color": "#EF4444"
  }
}
```

---

#### `round:priceUpdate`
Se emite durante subastas especiales cuando el precio desciende.

**Payload**:
```json
{
  "roundId": 2,
  "currentPrice": 640.00
}
```

**Frecuencia**: Cada segundo durante subastas especiales activas.

---

#### `teams:updated`
Se emite cuando los balances de los equipos cambian.

**Payload**:
```json
[
  {
    "id": 1,
    "name": "Equipo Azul",
    "color": "#3B82F6",
    "balance": 8100.00
  },
  {
    "id": 2,
    "name": "Equipo Rojo",
    "color": "#EF4444",
    "balance": 9500.00
  }
]
```

---

### 📤 Eventos del Cliente → Servidor

#### `admin:startRound`
Iniciar una ronda (solo admin).

**Envío**:
```javascript
socket.emit('admin:startRound', {
  roundId: 2,
  adminToken: 'jwt-token-here'
});
```

**Respuesta**: 
- Evento `round:started` a todos los clientes
- Error en consola del servidor si falla

---

#### `admin:closeRound`
Cerrar una ronda manualmente (solo admin).

**Envío**:
```javascript
socket.emit('admin:closeRound', {
  roundId: 1,
  adminToken: 'jwt-token-here'
});
```

**Respuesta**:
- Evento `round:closed` a todos los clientes
- Evento `teams:updated` con nuevos balances

---

#### `team:bid`
Realizar una puja en subasta normal.

**Envío**:
```javascript
socket.emit('team:bid', {
  roundId: 1,
  teamId: 1,
  amount: 420.00,
  clientTimestamp: new Date().toISOString()
});
```

**Validaciones del Servidor**:
- Ronda debe estar activa
- Debe ser subasta tipo "normal"
- Monto >= currentPrice + minIncrement
- Equipo debe tener balance suficiente

**Respuesta**:
- Evento `bid:new` a todos los clientes
- Error en consola si falla validación

---

#### `team:stop`
Presionar STOP en subasta especial.

**Envío**:
```javascript
socket.emit('team:stop', {
  roundId: 2,
  teamId: 1,
  clientTimestamp: new Date().toISOString()
});
```

**Validaciones del Servidor**:
- Ronda debe estar activa
- Debe ser subasta tipo "special"
- Equipo debe tener balance suficiente para el precio actual
- Precio calculado según timestamp del cliente

**Respuesta**:
- Evento `round:closed` a todos los clientes
- Evento `teams:updated` con nuevos balances

---

## 📊 Modelos de Datos

### Team (Equipo)

```typescript
{
  id: number;              // ID único
  name: string;            // Nombre del equipo
  color: string;           // Color en hex (#3B82F6)
  token: string;           // Token único de autenticación
  balance: number;         // Balance actual
  initialBalance: number;  // Balance inicial
  createdAt: Date;
  updatedAt: Date;
}
```

---

### Round (Ronda)

```typescript
{
  id: number;              // ID único
  title: string;           // Título descriptivo
  type: 'normal' | 'special';  // Tipo de subasta
  status: 'pending' | 'active' | 'completed';  // Estado
  minPrice: number;        // Precio mínimo
  maxPrice: number;        // Precio máximo (inicial para special)
  currentPrice: number;    // Precio actual
  
  // Solo para subastas normales
  minIncrement?: number;   // Incremento mínimo de puja
  
  // Solo para subastas especiales
  decrementRate?: number;  // Cantidad que baja por segundo
  duration?: number;       // Duración en segundos
  
  winnerId?: number;       // ID del equipo ganador
  startedAt?: Date;        // Momento de inicio
  closedAt?: Date;         // Momento de cierre
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

### Bid (Puja)

```typescript
{
  id: number;              // ID único
  roundId: number;         // ID de la ronda
  teamId: number;          // ID del equipo
  amount: number;          // Monto de la puja
  timestamp: Date;         // Momento de la puja
  clientTimestamp?: string; // Timestamp del cliente
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

### Transaction (Transacción)

```typescript
{
  id: number;              // ID único
  teamId: number;          // ID del equipo
  roundId: number;         // ID de la ronda
  type: 'win' | 'refund';  // Tipo de transacción
  amount: number;          // Monto (negativo para gasto)
  balanceBefore: number;   // Balance antes de la transacción
  balanceAfter: number;    // Balance después de la transacción
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

## ⚠️ Códigos de Error

### HTTP Status Codes

| Código | Descripción | Uso |
|--------|-------------|-----|
| 200 | OK | Petición exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos inválidos o incompletos |
| 401 | Unauthorized | No autenticado o token inválido |
| 403 | Forbidden | No tiene permisos suficientes |
| 404 | Not Found | Recurso no encontrado |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Error del servidor |

---

### Mensajes de Error Comunes

#### Autenticación
```json
{
  "error": "Token inválido"
}
```

```json
{
  "error": "Credenciales inválidas"
}
```

#### Validación
```json
{
  "error": "Balance insuficiente"
}
```

```json
{
  "error": "La puja debe ser mayor al precio actual + incremento mínimo"
}
```

```json
{
  "error": "La ronda no está activa"
}
```

#### Recursos
```json
{
  "error": "Ronda no encontrada"
}
```

```json
{
  "error": "Equipo no encontrado"
}
```

---

## 🔒 Seguridad

### Rate Limiting

**Desarrollo** (`NODE_ENV=development`):
- Sin límite de requests

**Producción** (`NODE_ENV=production`):
- 100 requests por minuto por IP
- Aplica a todas las rutas `/api/*`

### CORS

**Desarrollo**:
- Acepta cualquier origen `localhost:*` o `127.0.0.1:*`

**Producción**:
- Solo acepta el origen configurado en `FRONTEND_URL`
- Credenciales permitidas
- Métodos: GET, POST, PUT, DELETE, OPTIONS

### Tokens

- **JWT Admin**: Expira en 24 horas
- **Team Tokens**: Persistentes, no expiran
- Los tokens se validan en cada petición que requiere autenticación

---

## 📝 Ejemplos de Uso

### Ejemplo: Flujo Completo de una Subasta Normal

```javascript
// 1. Admin crea ronda
const response = await fetch('http://localhost:3001/api/rounds', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + adminToken
  },
  body: JSON.stringify({
    title: 'Ronda de Prueba',
    type: 'normal',
    minPrice: 100,
    maxPrice: 1000,
    minIncrement: 10
  })
});
const round = await response.json();

// 2. Admin inicia ronda via WebSocket
socket.emit('admin:startRound', {
  roundId: round.id,
  adminToken: adminToken
});

// 3. Equipo realiza puja
socket.emit('team:bid', {
  roundId: round.id,
  teamId: 1,
  amount: 150,
  clientTimestamp: new Date().toISOString()
});

// 4. Admin cierra ronda
socket.emit('admin:closeRound', {
  roundId: round.id,
  adminToken: adminToken
});
```

---

### Ejemplo: Subasta Especial

```javascript
// 1. Crear subasta especial
const response = await fetch('http://localhost:3001/api/rounds', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + adminToken
  },
  body: JSON.stringify({
    title: 'Subasta Rápida',
    type: 'special',
    minPrice: 50,
    maxPrice: 500,
    decrementRate: 10,
    duration: 45
  })
});

// 2. Iniciar ronda
socket.emit('admin:startRound', {
  roundId: roundId,
  adminToken: adminToken
});

// 3. Escuchar actualizaciones de precio
socket.on('round:priceUpdate', ({ roundId, currentPrice }) => {
  console.log('Precio actual:', currentPrice);
});

// 4. Equipo presiona STOP
socket.emit('team:stop', {
  roundId: roundId,
  teamId: 1,
  clientTimestamp: new Date().toISOString()
});
```

---

## 🧪 Testing

### Con cURL

```bash
# Login admin
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"cumpleaños2025"}'

# Obtener equipos
curl http://localhost:3001/api/teams

# Obtener rondas
curl http://localhost:3001/api/rounds

# Crear ronda (con token de admin)
curl -X POST http://localhost:3001/api/rounds \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Round",
    "type": "normal",
    "minPrice": 100,
    "maxPrice": 1000,
    "minIncrement": 10
  }'
```

---

**🎉 ¡API lista para subastas en tiempo real!**
