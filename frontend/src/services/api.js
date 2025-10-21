import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

console.log('🌐 API Service - Configuración:');
console.log('  📍 API_URL:', API_URL);
console.log('  📍 Base URL completa:', `${API_URL}/api`);

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir el token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log(`📤 API Request - ${config.method.toUpperCase()} ${config.url}`);
    console.log('  🔑 Token presente:', !!token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para loguear respuestas
api.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response - ${response.config.method.toUpperCase()} ${response.config.url}`);
        console.log('  📦 Status:', response.status);
        console.log('  📦 Data type:', Array.isArray(response.data) ? `Array[${response.data.length}]` : typeof response.data);
        return response;
    },
    (error) => {
        console.error(`❌ API Error - ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
        console.error('  ⚠️ Status:', error.response?.status);
        console.error('  ⚠️ Message:', error.response?.data?.error || error.message);
        return Promise.reject(error);
    }
);

export const authAPI = {
    loginAdmin: (username, password) => api.post('/auth/login', { username, password }),
    loginTeam: (token) => api.post('/teams/login', { token }),
};

export const teamsAPI = {
    getAll: () => api.get('/teams'),
    getById: (id) => api.get(`/teams/${id}`),
};

export const roundsAPI = {
    getAll: () => api.get('/rounds'),
    getById: (id) => api.get(`/rounds/${id}`),
    create: (data) => api.post('/rounds', data),
    update: (id, data) => api.put(`/rounds/${id}`, data),
    delete: (id) => api.delete(`/rounds/${id}`),
};

export const bidsAPI = {
    getByRound: (roundId) => api.get(`/bids/round/${roundId}`),
    create: (data) => api.post('/bids', data),
};

export { API_URL };
export default api;
