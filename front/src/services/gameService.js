import api from '../api/api';

export const GameService = {
  // Buscar todos os jogos (com filtros opcionais)
  async getGames(filters = {}) {
    try {
      const response = await api.get('/games', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  },

  // Buscar um jogo por ID
  async getGameById(id) {
    try {
      const response = await api.get(`/games/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching game ${id}:`, error);
      throw error;
    }
  },

  // Criar um novo jogo
  async createGame(gameData) {
    try {
      const response = await api.post('/games', gameData);
      return response.data;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  },

  // Atualizar um jogo
  async updateGame(id, gameData) {
    try {
      const response = await api.put(`/games/${id}`, gameData);
      return response.data;
    } catch (error) {
      console.error(`Error updating game ${id}:`, error);
      throw error;
    }
  },

  // Deletar um jogo
  async deleteGame(id) {
    try {
      const response = await api.delete(`/games/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting game ${id}:`, error);
      throw error;
    }
  }
};