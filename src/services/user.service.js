import api from './api'

export const userService = {
  /**
   * Obter usu�rio atual
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/users/me')
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao obter usu�rio' }
    }
  },

  /**
   * Obter perfil de um usu�rio
   */
  async getUserProfile(username) {
    try {
      const response = await api.get(`/users/profile/${username}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao obter perfil' }
    }
  },

  /**
   * Atualizar perfil
   */
  async updateProfile(id, data) {
    try {
      // Validar que apenas campos permitidos s�o enviados
      const allowedFields = ['username', 'bio', 'avatar']
      const updateData = {}
      
      for (const field of allowedFields) {
        if (field in data) {
          updateData[field] = data[field]
        }
      }
      
      const response = await api.put(`/users/${id}`, updateData)
      
      // Atualizar dados no localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const updatedUser = { ...user, ...response.data }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar perfil' }
    }
  },

  /**
   * Obter estat�sticas do usu�rio
   */
  async getUserStats(id) {
    try {
      const response = await api.get(`/users/${id}/stats`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao obter estat�sticas' }
    }
  },

  /**
   * Seguir usu�rio
   */
  async followUser(id) {
    try {
      const response = await api.post(`/users/${id}/follow`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao seguir usu�rio' }
    }
  },

  /**
   * Deixar de seguir usu�rio
   */
  async unfollowUser(id) {
    try {
      const response = await api.post(`/users/${id}/unfollow`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao deixar de seguir' }
    }
  },

  /**
   * Verificar se está seguindo usuário
   */
  async checkFollowing(id) {
    try {
      const response = await api.get(`/users/${id}/following`)
      return response.data
    } catch (error) {
      throw error.response?.data || { following: false }
    }
  },

  /**
   * Obter lista de seguidores
   */
  async getFollowers(id) {
    try {
      const response = await api.get(`/users/${id}/followers`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao obter seguidores' }
    }
  },

  /**
   * Obter lista de seguindo
   */
  async getFollowing(id) {
    try {
      const response = await api.get(`/users/${id}/following-list`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao obter seguindo' }
    }
  },

  /**
   * Remover seguidor
   */
  async removeFollower(userId, followerId) {
    try {
      const response = await api.delete(`/users/${userId}/followers/${followerId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao remover seguidor' }
    }
  }
}
