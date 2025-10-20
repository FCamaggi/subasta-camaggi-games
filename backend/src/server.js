require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { initDatabase } = require('./models');
const SocketHandler = require('./sockets/socketHandler');

// Rutas
const authRoutes = require('./routes/auth');
const teamsRoutes = require('./routes/teams');
const roundsRoutes = require('./routes/rounds');
const bidsRoutes = require('./routes/bids');

const app = express();
const server = http.createServer(app);

// Configurar CORS
const corsOptions = {
    origin: function (origin, callback) {
        // Permitir peticiones sin origin (como mobile apps o curl)
        if (!origin) return callback(null, true);

        // Lista de orígenes permitidos
        const allowedOrigins = [
            // Desarrollo local
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            // Producción (URL de Netlify)
            process.env.FRONTEND_URL,
            // Permite subdominios de Netlify si usas preview deploys
            ...(process.env.NETLIFY_URL ? [process.env.NETLIFY_URL] : [])
        ].filter(Boolean);

        // En desarrollo, permitir todos los orígenes
        if (process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }

        // En producción, validar contra lista
        if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
            callback(null, true);
        } else {
            console.log('❌ CORS bloqueado para origen:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Rate limiting - más permisivo en desarrollo
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 en dev, 100 en prod
    message: 'Demasiadas peticiones, intenta de nuevo más tarde',
    standardHeaders: true,
    legacyHeaders: false,
});

// Solo aplicar rate limiting en producción o a rutas específicas
if (process.env.NODE_ENV === 'production') {
    app.use('/api/', limiter);
}

// Socket.io
const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            const allowedOrigins = [
                // Desarrollo local
                'http://localhost:5173',
                'http://localhost:3000',
                'http://127.0.0.1:5173',
                // Producción
                process.env.FRONTEND_URL,
                ...(process.env.NETLIFY_URL ? [process.env.NETLIFY_URL] : [])
            ].filter(Boolean);

            // En desarrollo, permitir todos
            if (process.env.NODE_ENV === 'development') {
                return callback(null, true);
            }

            // En producción, validar
            if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
                callback(null, true);
            } else {
                console.log('❌ WebSocket bloqueado para origen:', origin);
                callback(null, false);
            }
        },
        credentials: true,
        methods: ['GET', 'POST']
    }
});

const socketHandler = new SocketHandler(io);
socketHandler.initialize();

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/rounds', roundsRoutes);
app.use('/api/bids', bidsRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        await initDatabase();

        server.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════╗
║   🎉 Servidor de Subasta Iniciado     ║
╚════════════════════════════════════════╝

🌐 Puerto: ${PORT}
🔧 Modo: ${process.env.NODE_ENV || 'development'}
📡 WebSocket: Activo
✅ Base de datos: Conectada

Para exponer con ngrok:
  ngrok http ${PORT}

Luego actualiza FRONTEND_URL en .env
      `);
        });
    } catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
        process.exit(1);
    }
};

startServer();

module.exports = { app, server, io };
