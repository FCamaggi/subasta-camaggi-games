import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
