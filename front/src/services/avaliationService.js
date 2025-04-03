import api from '../api/api';

export const AvaliationService = {
  // Buscar todas as avaliações (com paginação e filtros)
  async getAvaliations(filters = {}) {
    try {
      const params = {
        userId: filters.userId,
        gameId: filters.gameId,
        minScore: filters.minScore,
        maxScore: filters.maxScore,
        search: filters.search,
        page: filters.page || 1,
        limit: filters.limit || 10
      };

      // Remove parâmetros undefined
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await api.get('/avaliations', { params });
      
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      };
    } catch (error) {
      console.error('Error fetching avaliations:', error);
      throw error;
    }
  },

  // Buscar uma avaliação por ID
  async getAvaliationById(id) {
    try {
      const response = await api.get(`/avaliations/${id}`);
      return response.data.avaliation;
    } catch (error) {
      console.error(`Error fetching avaliation ${id}:`, error);
      throw error;
    }
  },

  // Criar uma nova avaliação
  async createAvaliation(avaliationData) {
    try {
      // Validação básica no frontend
      if (!avaliationData.userId || !avaliationData.gameId || 
          !avaliationData.score || !avaliationData.comment) {
        throw new Error('userId, gameId, score e comment são obrigatórios');
      }

      if (avaliationData.score < 1 || avaliationData.score > 5) {
        throw new Error('Score deve estar entre 1 e 5');
      }

      const response = await api.post('/avaliations', avaliationData);
      return {
        success: true,
        message: 'Avaliação criada com sucesso!',
        avaliation: response.data.avaliation
      };
    } catch (error) {
      console.error('Error creating avaliation:', error);
      throw error;
    }
  },
  
  // Atualizar uma avaliação
  async updateAvaliation(id, avaliationData) {
    try {
      // Validação do score se estiver sendo atualizado
      if (avaliationData.score && (avaliationData.score < 1 || avaliationData.score > 5)) {
        throw new Error('Score deve estar entre 1 e 5');
      }

      const response = await api.put(`/avaliations/${id}`, avaliationData);
      return {
        success: true,
        message: 'Avaliação atualizada com sucesso!',
        avaliation: response.data.avaliation
      };
    } catch (error) {
      console.error(`Error updating avaliation ${id}:`, error);
      throw error;
    }
  },

  // Deletar uma avaliação
  async deleteAvaliation(id) {
    try {
      await api.delete(`/avaliations/${id}`);
      return {
        success: true,
        message: 'Avaliação deletada com sucesso!'
      };
    } catch (error) {
      console.error(`Error deleting avaliation ${id}:`, error);
      throw error;
    }
  },

  // Buscar avaliações por comentário
  async getAvaliationsByComment(comment, page = 1, limit = 10) {
    try {
      if (!comment) {
        throw new Error('Parâmetro comment é obrigatório');
      }

      const response = await api.get('/avaliations/search', {
        params: { comment, page, limit }
      });
      
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      };
    } catch (error) {
      console.error('Error searching avaliations by comment:', error);
      throw error;
    }
  },

  // Buscar avaliações de um usuário específico
  async getUserAvaliations(userId, page = 1, limit = 10) {
    try {
      const response = await api.get(`/users/${userId}/avaliations`, {
        params: { page, limit }
      });
      
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      };
    } catch (error) {
      console.error(`Error fetching avaliations for user ${userId}:`, error);
      throw error;
    }
  },

  // Buscar avaliações de um jogo específico
  async getGameAvaliations(gameId, page = 1, limit = 10) {
    try {
      const response = await api.get(`/games/${gameId}/avaliations`, {
        params: { page, limit }
      });
      
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      };
    } catch (error) {
      console.error(`Error fetching avaliations for game ${gameId}:`, error);
      throw error;
    }
  }
};