import axios from 'axios';

// Configuração base do Axios
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Adicione '/api' se seu backend usa essa base
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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