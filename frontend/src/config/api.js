// Configuración de la API según el entorno
const getApiUrl = () => {
  // En desarrollo, usar el proxy de Vite
  if (import.meta.env.DEV) {
    return '/api';
  }
  
  // En producción, usar la URL del backend desplegado
  // Cambia esta URL por la URL real de tu backend
  return import.meta.env.VITE_API_URL || 'https://gamificacion-kallpaia-kappa.vercel.app/';
};

export const API_BASE_URL = getApiUrl();

// Configuración de Axios
export const axiosConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};
