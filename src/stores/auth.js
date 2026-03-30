import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { User } from '../models'
import { authService } from '../services/auth.service'
import { userService } from '../services/user.service'

export const useAuthStore = defineStore('auth', () => {
  // STATE
  const currentUser = ref(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref(null)
  const initialized = ref(localStorage.getItem('auth_initialized') === 'true')

  // GETTERS
  const user = computed(() => currentUser.value)
  const isLoggedIn = computed(() => isAuthenticated.value)

  // ACTIONS
  async function initializeAuth() {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          currentUser.value = new User(JSON.parse(savedUser))
          isAuthenticated.value = true
        } else {
          try {
            const userData = await userService.getCurrentUser()
            currentUser.value = new User(userData)
            isAuthenticated.value = true
            localStorage.setItem('user', JSON.stringify(userData))
          } catch (err) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user')
          }
        }
      }
      initialized.value = true
      localStorage.setItem('auth_initialized', 'true')
    } catch (err) {
      error.value = err.message || 'Erro ao inicializar autenticacao'
      initialized.value = true
      localStorage.setItem('auth_initialized', 'true')
    }
  }

  async function register(email, password, fullName, username) {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.register(email, password, fullName, username)
      currentUser.value = new User(response.user)
      isAuthenticated.value = true
      return true
    } catch (err) {
      error.value = err.error || err.message || 'Erro ao registrar'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function login(email, password) {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.login(email, password)
      currentUser.value = new User(response.user)
      isAuthenticated.value = true
      return true
    } catch (err) {
      error.value = err.error || err.message || 'Erro ao fazer login'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      currentUser.value = null
      isAuthenticated.value = false
      initialized.value = false
      localStorage.removeItem('auth_initialized')
    }
  }

  async function updateProfile(updates) {
    if (currentUser.value) {
      try {
        const updated = await userService.updateProfile(currentUser.value.id, updates)
        
        // Garantir que o avatar base64 foi recebido do backend
        const newUser = new User({ 
          ...currentUser.value, 
          ...updated,
          // Se o backend retornou um avatar, usar ele
          avatar: updated.avatar || currentUser.value.avatar
        })
        
        currentUser.value = newUser
        
        // Salvar no localStorage tamb�m, incluindo o avatar
        localStorage.setItem('user', JSON.stringify({
          ...newUser,
          avatar: newUser.avatar
        }))
        
        return true
      } catch (err) {
        error.value = err.error || 'Erro ao atualizar perfil'
        return false
      }
    }
  }

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    initialized,
    user,
    isLoggedIn,
    initializeAuth,
    register,
    login,
    logout,
    updateProfile
  }
})
