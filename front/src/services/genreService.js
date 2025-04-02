import api from '../api/api';

export const GenreService = {
  // Buscar todos os gêneros (com paginação)
  async getGenres(filters = {}) {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 10,
        search: filters.search
      };

      // Remove parâmetros undefined
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await api.get('/genres', { params });
      
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      };
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  },

  // Buscar um gênero por ID
  async getGenreById(id) {
    try {
      const response = await api.get(`/genres/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching genre ${id}:`, error);
      throw error;
    }
  },

  // Criar um novo gênero
  async createGenre(genreData) {
    try {
      const response = await api.post('/genres', genreData);
      return response.data;
    } catch (error) {
      console.error('Error creating genre:', error);
      throw error;
    }
  },
  
  // Atualizar um gênero
  async updateGenre(id, genreData) {
    try {
      const response = await api.put(`/genres/${id}`, genreData);
      return response.data;
    } catch (error) {
      console.error(`Error updating genre ${id}:`, error);
      throw error;
    }
  },

  // Deletar um gênero
  async deleteGenre(id) {
    try {
      const response = await api.delete(`/genres/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting genre ${id}:`, error);
      throw error;
    }
  }
};