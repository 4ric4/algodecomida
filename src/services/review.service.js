import api from './api'

export const reviewService = {
  /**
   * Obter todos os reviews
   */
  async getAllReviews(params = {}) {
    try {
      const response = await api.get('/reviews', { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao obter reviews' }
    }
  },

  /**
   * Obter review por ID
   */
  async getReviewById(id) {
    try {
      const response = await api.get(`/reviews/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao obter review' }
    }
  },

  /**
   * Obter reviews de um restaurante
   */
  async getReviewsByRestaurant(restaurantId, params = {}) {
    try {
      const response = await api.get(`/reviews/restaurant/${restaurantId}`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao obter reviews' }
    }
  },

  /**
   * Obter reviews de um usu�rio
   */
  async getReviewsByUser(userId, params = {}) {
    try {
      const response = await api.get(`/reviews/user/${userId}`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao obter reviews' }
    }
  },

  /**
   * Criar novo review
   */
  async createReview(data) {
    try {
      const response = await api.post('/reviews', data)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar review' }
    }
  },

  /**
   * Atualizar review
   */
  async updateReview(id, data) {
    try {
      const response = await api.put(`/reviews/${id}`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar review' }
    }
  },

  /**
   * Deletar review
   */
  async deleteReview(id) {
    try {
      const response = await api.delete(`/reviews/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao deletar review' }
    }
  },

  /**
   * Buscar reviews da galera que voc� segue
   */
  async getFollowingReviews(params = {}) {
    try {
      const response = await api.get('/reviews/feed/following', { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao obter reviews' }
    }
  },

  /**
   * Dar like em um review
   */
  async likeReview(id) {
    try {
      console.log('🔗 reviewService.likeReview - ID:', { received: id, type: typeof id })
      const response = await api.post(`/reviews/${id}/like`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao curtir review' }
    }
  },

  /**
   * Remover like de um review
   */
  async unlikeReview(id) {
    try {
      console.log('🔗 reviewService.unlikeReview - ID:', { received: id, type: typeof id })
      const response = await api.delete(`/reviews/${id}/like`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao descurtir review' }
    }
  },

  /**
   * Obter comentarios de um review
   */
  async getComments(reviewId) {
    try {
      const response = await api.get(`/reviews/${reviewId}/comments`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao obter comentarios' }
    }
  },

  /**
   * Criar ou atualizar comentario em um review (1 por usuario por review)
   */
  async createComment(reviewId, data) {
    try {
      const response = await api.post(`/reviews/${reviewId}/comments`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao adicionar comentario' }
    }
  },

  /**
   * Deletar um comentario
   */
  async deleteComment(reviewId, commentId) {
    try {
      const response = await api.delete(`/reviews/${reviewId}/comments/${commentId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao deletar comentario' }
    }
  }
}
