import api from './api'

export const authService = {
  /**
   * Registrar novo usuário
   */
  async register(email, password, fullName, username) {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        fullName,
        username
      })
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao registrar' }
    }
  },

  /**
   * Login
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      })
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao fazer login' }
    }
  },

  /**
   * Refresh token
   */
  async refreshToken(token) {
    try {
      const response = await api.post('/auth/refresh', { token })
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token)
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao renovar token' }
    }
  },

  /**
   * Logout
   */
  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  }
}
