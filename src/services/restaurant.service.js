import api from './api'

export const restaurantService = {
  /**
   * Obter todos os restaurantes
   */
  async getAllRestaurants(params = {}) {
    try {
      const response = await api.get('/restaurants', { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao obter restaurantes' }
    }
  },

  /**
   * Obter restaurante por ID
   */
  async getRestaurantById(id) {
    try {
      const response = await api.get(`/restaurants/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao obter restaurante' }
    }
  },

  /**
   * Criar novo restaurante
   */
  async createRestaurant(data) {
    try {
      const response = await api.post('/restaurants', data)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar restaurante' }
    }
  },

  /**
   * Atualizar restaurante
   */
  async updateRestaurant(id, data) {
    try {
      const response = await api.put(`/restaurants/${id}`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar restaurante' }
    }
  },

  /**
   * Deletar restaurante
   */
  async deleteRestaurant(id) {
    try {
      const response = await api.delete(`/restaurants/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao deletar restaurante' }
    }
  },

  /**
   * Buscar restaurantes por culinária
   */
  async searchRestaurants(cuisine) {
    try {
      const response = await api.get('/restaurants', {
        params: { cuisine }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar restaurantes' }
    }
  },

  /**
   * Favoritar restaurante
   */
  async favoriteRestaurant(id) {
    try {
      const response = await api.post(`/restaurants/${id}/favorite`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao favoritar' }
    }
  },

  /**
   * Remover de favoritos
   */
  async unfavoriteRestaurant(id) {
    try {
      const response = await api.post(`/restaurants/${id}/unfavorite`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao remover de favoritos' }
    }
  }
}
