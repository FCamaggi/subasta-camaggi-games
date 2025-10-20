import { io } from 'socket.io-client';
import { API_URL } from './api';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(API_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('✅ Conectado al servidor');
    });

    socket.on('disconnect', () => {
      console.log('❌ Desconectado del servidor');
    });

    socket.on('error', (error) => {
      console.error('Error de socket:', error);
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
