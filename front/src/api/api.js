import axios from 'axios';

// Configuração base do Axios
const api = axios.create({
  baseURL: 'http://localhost:3001', // URL do seu backend
  timeout: 10000, // timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
    // Adicione outros headers globais se necessário
  }
});

// Interceptores para tratamento global de erros
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios error:', error);
    return Promise.reject(error);
  }
);

export default api;