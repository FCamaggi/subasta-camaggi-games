import { io } from 'socket.io-client';
import { API_URL } from './api';

let socket = null;

export const initSocket = () => {
    if (!socket) {
        console.log('🔌 Socket - Inicializando conexión');
        console.log('  📍 URL:', API_URL);

        socket = io(API_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            console.log('✅ Socket - Conectado al servidor');
            console.log('  🆔 Socket ID:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket - Desconectado del servidor');
        });

        socket.on('connect_error', (error) => {
            console.error('⚠️ Socket - Error de conexión:', error.message);
        });

        socket.on('error', (error) => {
            console.error('❌ Socket - Error:', error);
        });

        // Log de eventos recibidos
        socket.onAny((eventName, ...args) => {
            console.log(`📨 Socket - Evento recibido: ${eventName}`, args);
        });
    }

    return socket;
};

export const getSocket = () => {
    if (!socket) {
        return initSocket();
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export default {
    initSocket,
    getSocket,
    disconnectSocket,
};
