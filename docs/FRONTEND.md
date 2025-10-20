# 🎨 Documentación del Frontend

## 📋 Tabla de Contenidos
- [Información General](#información-general)
- [Arquitectura](#arquitectura)
- [Estructura de Directorios](#estructura-de-directorios)
- [Páginas y Componentes](#páginas-y-componentes)
- [Servicios](#servicios)
- [Hooks Personalizados](#hooks-personalizados)
- [Estilos](#estilos)
- [Routing](#routing)
- [Estado y Gestión de Datos](#estado-y-gestión-de-datos)

---

## 🌐 Información General

### Stack
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Estilos**: TailwindCSS 3.3.6
- **Router**: React Router DOM 6.20.1
- **HTTP Client**: Axios 1.6.2
- **WebSocket**: Socket.io Client 4.6.1

### URLs
- **Desarrollo**: `http://localhost:5173`
- **Producción**: Tu dominio de Netlify

### Variables de Entorno

Archivo `.env`:
```env
VITE_API_URL=http://localhost:3001
```

En producción (Netlify):
```env
VITE_API_URL=https://tu-dominio.ngrok-free.app
```

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                         App.jsx                             │
│                    (Router Principal)                        │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
    ┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
    │    Login     │ │   Admin    │ │   Team     │
    │              │ │ Dashboard  │ │ Dashboard  │
    └──────────────┘ └────────────┘ └────────────┘
            │
    ┌───────▼──────┐
    │  Spectator   │
    │     View     │
    └──────────────┘
            │
    ┌───────┴────────┐
    │                │
┌───▼────┐    ┌──────▼─────┐
│   API  │    │   Socket   │
│ Service│    │  Service   │
└────────┘    └────────────┘
```

---

## 📁 Estructura de Directorios

```
frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── pages/           # Componentes de páginas
│   │   ├── Login.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── TeamDashboard.jsx
│   │   └── SpectatorView.jsx
│   │
│   ├── services/        # Servicios de comunicación
│   │   ├── api.js       # Cliente HTTP (Axios)
│   │   └── socket.js    # Cliente WebSocket (Socket.io)
│   │
│   ├── hooks/           # Hooks personalizados
│   │   └── useAuth.js   # Hook de autenticación
│   │
│   ├── App.jsx          # Componente raíz con router
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
│
├── .env                 # Variables de entorno
├── index.html           # HTML principal
├── tailwind.config.js   # Configuración de Tailwind
├── vite.config.js       # Configuración de Vite
└── package.json
```

---

## 📄 Páginas y Componentes

### 1. Login.jsx

**Ruta**: `/`

**Propósito**: Pantalla de autenticación multi-modo (Espectador, Equipo, Admin).

**Props**:
```typescript
interface LoginProps {
  onLogin: (role: string, user: object, token: string) => void;
}
```

**Estado Local**:
```javascript
const [mode, setMode] = useState('spectator'); // 'spectator' | 'team' | 'admin'
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [teamToken, setTeamToken] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
```

**Funciones Principales**:

```javascript
// Login de administrador
const handleAdminLogin = async (e) => {
  const response = await authAPI.loginAdmin(username, password);
  onLogin('admin', { username }, response.data.token);
  navigate('/admin');
};

// Login de equipo
const handleTeamLogin = async (e) => {
  const response = await authAPI.loginTeam(teamToken);
  onLogin('team', response.data.team, response.data.token);
  navigate('/team');
};

// Acceso de espectador (sin autenticación)
const handleSpectatorAccess = () => {
  navigate('/spectator');
};
```

**Características**:
- ✅ Tres modos de acceso en una sola pantalla
- ✅ Validación de formularios
- ✅ Manejo de errores
- ✅ Loading states
- ✅ Diseño responsive

---

### 2. AdminDashboard.jsx

**Ruta**: `/admin` (protegida)

**Propósito**: Panel de control para administradores.

**Estado Local**:
```javascript
const [rounds, setRounds] = useState([]);
const [teams, setTeams] = useState([]);
const [activeRound, setActiveRound] = useState(null);
const [showCreateForm, setShowCreateForm] = useState(false);
const [newRound, setNewRound] = useState({
  title: '',
  type: 'normal',
  minPrice: '',
  maxPrice: '',
  minIncrement: '',
  decrementRate: '',
  duration: ''
});
const [loading, setLoading] = useState(true);
```

**Funciones Principales**:

```javascript
// Crear nueva ronda
const handleCreateRound = async (e) => {
  const roundData = {
    title: newRound.title,
    type: newRound.type,
    minPrice: parseFloat(newRound.minPrice),
    maxPrice: parseFloat(newRound.maxPrice),
    ...(newRound.type === 'normal' 
      ? { minIncrement: parseFloat(newRound.minIncrement) }
      : {
          decrementRate: parseFloat(newRound.decrementRate),
          duration: parseInt(newRound.duration)
        }
    )
  };
  
  await roundsAPI.create(roundData);
  loadData();
};

// Iniciar ronda
const handleStartRound = (roundId) => {
  const socket = getSocket();
  socket.emit('admin:startRound', {
    roundId,
    adminToken: localStorage.getItem('token')
  });
};

// Cerrar ronda
const handleCloseRound = (roundId) => {
  const socket = getSocket();
  socket.emit('admin:closeRound', {
    roundId,
    adminToken: localStorage.getItem('token')
  });
};
```

**WebSocket Listeners**:
```javascript
useEffect(() => {
  const socket = getSocket();
  
  socket.on('round:started', (round) => {
    setActiveRound(round);
    setRounds(prev => prev.map(r => r.id === round.id ? round : r));
  });
  
  socket.on('round:closed', (round) => {
    if (activeRound?.id === round.id) setActiveRound(null);
    setRounds(prev => prev.map(r => r.id === round.id ? round : r));
  });
  
  socket.on('teams:updated', (updatedTeams) => {
    setTeams(updatedTeams);
  });
}, [activeRound]);
```

**Características**:
- ✅ Crear rondas (normales y especiales)
- ✅ Iniciar/cerrar rondas
- ✅ Ver estado en tiempo real
- ✅ Gestión de equipos
- ✅ Historial de rondas
- ✅ Logout

---

### 3. TeamDashboard.jsx

**Ruta**: `/team` (protegida)

**Propósito**: Interfaz para que los equipos participen en subastas.

**Estado Local**:
```javascript
const [rounds, setRounds] = useState([]);
const [activeRound, setActiveRound] = useState(null);
const [myTeam, setMyTeam] = useState(null);
const [bidAmount, setBidAmount] = useState('');
const [loading, setLoading] = useState(true);
```

**Funciones Principales**:

```javascript
// Realizar puja en subasta normal
const handleBid = () => {
  const amount = parseFloat(bidAmount);
  const currentPrice = parseFloat(activeRound.currentPrice || activeRound.minPrice);
  const minIncrement = parseFloat(activeRound.minIncrement);
  const minimumBid = currentPrice + minIncrement;

  // Validación
  if (amount < minimumBid) {
    alert(`La puja mínima es $${minimumBid.toFixed(2)}`);
    return;
  }

  if (amount > myTeam.balance) {
    alert('Balance insuficiente');
    return;
  }

  // Enviar puja
  const socket = getSocket();
  socket.emit('team:bid', {
    roundId: activeRound.id,
    teamId: myTeam.id,
    amount,
    clientTimestamp: new Date().toISOString()
  });

  setBidAmount('');
};

// Presionar STOP en subasta especial
const handleStop = () => {
  const currentPrice = parseFloat(activeRound.currentPrice);
  
  if (currentPrice > myTeam.balance) {
    alert('Balance insuficiente para el precio actual');
    return;
  }

  const socket = getSocket();
  socket.emit('team:stop', {
    roundId: activeRound.id,
    teamId: myTeam.id,
    clientTimestamp: new Date().toISOString()
  });
};
```

**WebSocket Listeners**:
```javascript
useEffect(() => {
  const socket = getSocket();
  
  socket.on('round:started', (round) => {
    setActiveRound(round);
    setRounds(prev => prev.map(r => r.id === round.id ? round : r));
  });
  
  socket.on('round:closed', (round) => {
    if (activeRound?.id === round.id) setActiveRound(null);
    setRounds(prev => prev.map(r => r.id === round.id ? round : r));
  });
  
  socket.on('bid:new', (bid) => {
    if (activeRound && bid.roundId === activeRound.id) {
      setActiveRound(prev => ({
        ...prev,
        currentPrice: bid.amount,
        bids: [bid, ...(prev.bids || [])]
      }));
    }
  });
  
  socket.on('round:priceUpdate', ({ roundId, currentPrice }) => {
    if (activeRound?.id === roundId) {
      setActiveRound(prev => ({ ...prev, currentPrice }));
    }
  });
  
  socket.on('teams:updated', (updatedTeams) => {
    const myUpdatedTeam = updatedTeams.find(t => t.id === myTeam.id);
    if (myUpdatedTeam) setMyTeam(myUpdatedTeam);
  });
}, [activeRound, myTeam]);
```

**Características**:
- ✅ Ver balance actual
- ✅ Ver ronda activa en tiempo real
- ✅ Pujar en subastas normales con validación
- ✅ STOP en subastas especiales
- ✅ Ver precio descendente en tiempo real
- ✅ Historial de pujas
- ✅ Notificaciones de cambios
- ✅ Logout

---

### 4. SpectatorView.jsx

**Ruta**: `/spectator` (pública)

**Propósito**: Vista pública para espectadores sin autenticación.

**Estado Local**:
```javascript
const [rounds, setRounds] = useState([]);
const [teams, setTeams] = useState([]);
const [activeRound, setActiveRound] = useState(null);
const [loading, setLoading] = useState(true);
```

**Funciones Principales**:

```javascript
// Cargar datos iniciales
const loadData = async () => {
  try {
    const [roundsRes, teamsRes] = await Promise.all([
      roundsAPI.getAll(),
      teamsAPI.getAll()
    ]);
    
    setRounds(roundsRes.data);
    setTeams(teamsRes.data);
    
    // Buscar ronda activa
    const active = roundsRes.data.find(r => r.status === 'active');
    if (active) {
      const fullRound = await roundsAPI.getById(active.id);
      setActiveRound(fullRound.data);
    }
  } catch (error) {
    console.error('Error cargando datos:', error);
  } finally {
    setLoading(false);
  }
};
```

**WebSocket Listeners**:
```javascript
useEffect(() => {
  loadData();
  const socket = getSocket();

  socket.on('round:started', (round) => {
    setActiveRound(round);
    setRounds(prev => prev.map(r => r.id === round.id ? round : r));
  });

  socket.on('round:closed', (round) => {
    if (activeRound?.id === round.id) setActiveRound(null);
    setRounds(prev => prev.map(r => r.id === round.id ? round : r));
  });

  socket.on('bid:new', (bid) => {
    if (activeRound && bid.roundId === activeRound.id) {
      setActiveRound(prev => ({
        ...prev,
        currentPrice: bid.amount,
        bids: [bid, ...(prev.bids || [])]
      }));
    }
  });

  socket.on('round:priceUpdate', ({ roundId, currentPrice }) => {
    if (activeRound?.id === roundId) {
      setActiveRound(prev => ({ ...prev, currentPrice }));
    }
  });

  socket.on('teams:updated', (updatedTeams) => {
    setTeams(updatedTeams);
  });

  return () => {
    socket.off('round:started');
    socket.off('round:closed');
    socket.off('bid:new');
    socket.off('round:priceUpdate');
    socket.off('teams:updated');
  };
}, [activeRound]);
```

**Características**:
- ✅ Ver ronda activa en tiempo real
- ✅ Ver todas las rondas (pendientes, activas, completadas)
- ✅ Ver balance de equipos
- ✅ Ver pujas en tiempo real
- ✅ Ver ganadores
- ✅ Sin necesidad de login
- ✅ Actualización automática

---

## 🔧 Servicios

### api.js

Cliente HTTP para comunicación REST con el backend.

```javascript
import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (token && role === 'admin') {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (token && role === 'team') {
    config.headers['x-team-token'] = token;
  }
  
  return config;
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**APIs Disponibles**:

```javascript
// Autenticación
export const authAPI = {
  loginAdmin: (username, password) => 
    api.post('/api/auth/login', { username, password }),
  loginTeam: (token) => 
    api.post('/api/teams/login', { token })
};

// Equipos
export const teamsAPI = {
  getAll: () => api.get('/api/teams'),
  getById: (id) => api.get(`/api/teams/${id}`)
};

// Rondas
export const roundsAPI = {
  getAll: () => api.get('/api/rounds'),
  getById: (id) => api.get(`/api/rounds/${id}`),
  create: (data) => api.post('/api/rounds', data)
};

// Pujas
export const bidsAPI = {
  getAll: (params) => api.get('/api/bids', { params }),
  getById: (id) => api.get(`/api/bids/${id}`)
};
```

---

### socket.js

Cliente WebSocket para comunicación en tiempo real.

```javascript
import { io } from 'socket.io-client';

let socket = null;

// Inicializar conexión Socket.io
export const initSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('✅ Socket conectado:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket desconectado');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión:', error);
    });
  }
  
  return socket;
};

// Obtener instancia del socket
export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

// Desconectar socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
```

**Uso en Componentes**:

```javascript
import { getSocket } from '../services/socket';

// En el componente
useEffect(() => {
  const socket = getSocket();
  
  socket.on('round:started', (data) => {
    console.log('Ronda iniciada:', data);
  });
  
  return () => {
    socket.off('round:started');
  };
}, []);
```

---

## 🪝 Hooks Personalizados

### useAuth.js

Hook para gestionar autenticación y estado del usuario.

```javascript
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos de autenticación al montar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedRole && storedToken) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      setToken(storedToken);
    }
    
    setLoading(false);
  }, []);

  // Login
  const login = (newRole, newUser, newToken) => {
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('role', newRole);
    localStorage.setItem('token', newToken);
    
    setUser(newUser);
    setRole(newRole);
    setToken(newToken);
  };

  // Logout
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
    setToken(null);
  };

  return {
    user,
    role,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    logout
  };
};
```

**Uso**:

```javascript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, role, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>No autenticado</div>;
  }
  
  return (
    <div>
      <p>Usuario: {user.name}</p>
      <p>Rol: {role}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

---

## 🎨 Estilos

### TailwindCSS

Configuración en `tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#EF4444',
      }
    },
  },
  plugins: [],
}
```

### Clases Personalizadas

En `index.css`:

```css
/* Botones */
.btn-primary {
  @apply bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-danger {
  @apply bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Inputs */
.input-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500;
}

/* Cards */
.card {
  @apply bg-white rounded-xl shadow-lg p-6;
}

/* Badges */
.badge {
  @apply inline-block px-3 py-1 rounded-full text-sm font-semibold;
}

.badge-success {
  @apply badge bg-green-100 text-green-800;
}

.badge-warning {
  @apply badge bg-yellow-100 text-yellow-800;
}

.badge-danger {
  @apply badge bg-red-100 text-red-800;
}
```

---

## 🛣️ Routing

### Configuración en App.jsx

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

function App() {
  const { login, role } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login onLogin={login} />} />
        <Route path="/spectator" element={<SpectatorView />} />
        
        {/* Rutas protegidas */}
        <Route 
          path="/admin" 
          element={
            role === 'admin' 
              ? <AdminDashboard /> 
              : <Navigate to="/" />
          } 
        />
        <Route 
          path="/team" 
          element={
            role === 'team' 
              ? <TeamDashboard /> 
              : <Navigate to="/" />
          } 
        />
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 📊 Estado y Gestión de Datos

### Estrategia de Estado

**Local State** (useState):
- Datos específicos de cada componente
- Formularios
- UI state (loading, errors)

**localStorage**:
- Autenticación (user, role, token)
- Persiste entre recargas

**WebSocket State**:
- Actualizaciones en tiempo real
- Sincronización automática con el servidor

### Flujo de Datos

```
1. Usuario interactúa con UI
   ↓
2. Evento dispara función handler
   ↓
3. Se valida la acción localmente
   ↓
4. Se envía petición al backend (HTTP o WebSocket)
   ↓
5. Backend procesa y responde/emite evento
   ↓
6. Frontend recibe respuesta/evento
   ↓
7. Se actualiza el estado local
   ↓
8. React re-renderiza componentes afectados
```

---

## 🔄 Ciclo de Vida de una Subasta

### Frontend Perspective

```javascript
// 1. Admin crea ronda (HTTP)
await roundsAPI.create(roundData);

// 2. Admin inicia ronda (WebSocket)
socket.emit('admin:startRound', { roundId, adminToken });

// 3. Todos reciben evento (WebSocket)
socket.on('round:started', (round) => {
  setActiveRound(round);
});

// 4a. Subasta Normal: Equipos pujan (WebSocket)
socket.emit('team:bid', { roundId, teamId, amount, clientTimestamp });

// 4b. Todos reciben nueva puja (WebSocket)
socket.on('bid:new', (bid) => {
  updateCurrentPrice(bid.amount);
});

// 5. Admin cierra ronda (WebSocket)
socket.emit('admin:closeRound', { roundId, adminToken });

// 6. Todos reciben cierre (WebSocket)
socket.on('round:closed', (round) => {
  showWinner(round.winnerId);
});

// 7. Todos reciben balances actualizados (WebSocket)
socket.on('teams:updated', (teams) => {
  updateTeamsBalance(teams);
});
```

---

## 🐛 Debugging

### Herramientas

**React DevTools**:
- Inspeccionar componentes
- Ver props y state
- Profiler de rendimiento

**Console Logs**:
```javascript
// En desarrollo, el socket loggea automáticamente
socket.on('connect', () => console.log('✅ Conectado'));
socket.on('disconnect', () => console.log('❌ Desconectado'));
```

**Network Tab**:
- Ver peticiones HTTP
- Ver errores CORS
- Verificar payloads

---

## 🚀 Build y Deploy

### Build Local

```bash
cd frontend
npm run build
```

Genera carpeta `dist/` con archivos estáticos optimizados.

### Preview Local

```bash
npm run preview
```

Sirve el build en `http://localhost:4173`

### Deploy en Netlify

Ver guía completa en [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📝 Mejores Prácticas

### Componentes
- ✅ Un componente por archivo
- ✅ Nombres descriptivos (PascalCase)
- ✅ Props con PropTypes o TypeScript
- ✅ Destructurar props

### Estado
- ✅ Estado lo más cerca posible de donde se usa
- ✅ No duplicar estado
- ✅ Limpiar listeners de WebSocket en cleanup

### Performance
- ✅ Usar `useCallback` para funciones pasadas como props
- ✅ Usar `useMemo` para cálculos costosos
- ✅ Cleanup de efectos (return en useEffect)

### Seguridad
- ✅ Nunca exponer tokens en el código
- ✅ Validar inputs del usuario
- ✅ Sanitizar datos antes de renderizar
- ✅ Usar HTTPS en producción

---

**🎨 ¡Frontend listo para subastas increíbles!**
