import axios from 'axios';
import { axiosConfig } from '../config/api.js';

// Crear instancia de Axios con configuración
const api = axios.create(axiosConfig);

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log('API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    // Log de errores
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
