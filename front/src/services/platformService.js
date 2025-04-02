import api from '../api/api';

export const PlatformService = {
  // Buscar todas as plataformas (com paginação e filtros)
  async getPlatforms(filters = {}) {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 10,
        search: filters.search
      };

      // Remove parâmetros undefined
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await api.get('/platforms', { params });
      
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      };
    } catch (error) {
      console.error('Error fetching platforms:', error);
      throw error;
    }
  },

  // Buscar uma plataforma por ID
  async getPlatformById(id) {
    try {
      const response = await api.get(`/platforms/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching platform ${id}:`, error);
      throw error;
    }
  },

  // Criar uma nova plataforma
  async createPlatform(platformData) {
    try {
      const response = await api.post('/platforms', platformData);
      return response.data;
    } catch (error) {
      console.error('Error creating platform:', error);
      throw error;
    }
  },
  
  // Atualizar uma plataforma
  async updatePlatform(id, platformData) {
    try {
      const response = await api.put(`/platforms/${id}`, platformData);
      return response.data;
    } catch (error) {
      console.error(`Error updating platform ${id}:`, error);
      throw error;
    }
  },

  // Deletar uma plataforma
  async deletePlatform(id) {
    try {
      const response = await api.delete(`/platforms/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting platform ${id}:`, error);
      throw error;
    }
  }
};