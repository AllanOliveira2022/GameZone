import api from '../api/api';

export const DeveloperService = {
  // Buscar todos os desenvolvedores (com paginação e filtros)
  async getDevelopers(filters = {}) {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 10,
        search: filters.search,
        cnpj: filters.cnpj
      };

      // Remove parâmetros undefined
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await api.get('/developers', { params });
      
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      };
    } catch (error) {
      console.error('Error fetching developers:', error);
      throw error;
    }
  },

  // Buscar um desenvolvedor por ID
  async getDeveloperById(id) {
    try {
      const response = await api.get(`/developers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching developer ${id}:`, error);
      throw error;
    }
  },

  // Criar um novo desenvolvedor
  async createDeveloper(developerData) {
    try {
      // Validação deve ser feita no backend
      const response = await api.post('/developers', developerData);
      return response.data;
    } catch (error) {
      console.error('Error creating developer:', error);
      throw error;
    }
  },
  
  // Atualizar um desenvolvedor
  async updateDeveloper(id, developerData) {
    try {
      const response = await api.put(`/developers/${id}`, developerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating developer ${id}:`, error);
      throw error;
    }
  },

  // Deletar um desenvolvedor
  async deleteDeveloper(id) {
    try {
      const response = await api.delete(`/developers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting developer ${id}:`, error);
      throw error;
    }
  }
};