import api from '../api/api';

const UserService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao realizar login' };
    }
  },

  signup: async (userData) => {
    try {
      const response = await api.post('/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao criar usuário' };
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao obter dados do usuário' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
  },

  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao listar usuários' };
    }
  },

  // NOVA FUNÇÃO ADICIONADA
  getUserGames: async () => {
    try {
      const response = await api.get('/users/games');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar jogos do usuário' };
    }
  }
};

export default UserService;
