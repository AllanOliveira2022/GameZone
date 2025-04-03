import api from '../api/api';

export const BuyService = {
  // Buscar todas as compras (com paginação)
  async getBuys(page = 1, limit = 10) {
    try {
      const response = await api.get('/buys', {
        params: { page, limit }
      });
      
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      };
    } catch (error) {
      console.error('Error fetching buys:', error);
      throw error;
    }
  },

  // Buscar uma compra por ID
  async getBuyById(id) {
    try {
      const response = await api.get(`/buys/${id}`);
      return response.data.buy;
    } catch (error) {
      console.error(`Error fetching buy ${id}:`, error);
      throw error;
    }
  },

  // Criar uma nova compra
  async createBuy(buyData) {
    try {
      const response = await api.post('/buys', buyData);
      return {
        success: true,
        message: 'Compra criada com sucesso!',
        buy: response.data.buy
      };
    } catch (error) {
      console.error('Error creating buy:', error);
      
      // Tratamento específico para jogos inválidos
      if (error.response && error.response.data.invalidGames) {
        throw {
          ...error,
          invalidGames: error.response.data.invalidGames
        };
      }
      
      throw error;
    }
  },
  
  // Atualizar uma compra
  async updateBuy(id, buyData) {
    try {
      const response = await api.put(`/buys/${id}`, buyData);
      return {
        success: true,
        message: 'Compra atualizada com sucesso!',
        buy: response.data.buy
      };
    } catch (error) {
      console.error(`Error updating buy ${id}:`, error);
      throw error;
    }
  },

  // Deletar uma compra
  async deleteBuy(id) {
    try {
      await api.delete(`/buys/${id}`);
      return {
        success: true,
        message: 'Compra deletada com sucesso!'
      };
    } catch (error) {
      console.error(`Error deleting buy ${id}:`, error);
      throw error;
    }
  },

  // Método adicional para buscar compras de um usuário específico
  async getUserBuys(userId, page = 1, limit = 10) {
    try {
      const response = await api.get(`/users/${userId}/buys`, {
        params: { page, limit }
      });
      
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      };
    } catch (error) {
      console.error(`Error fetching buys for user ${userId}:`, error);
      throw error;
    }
  }
};