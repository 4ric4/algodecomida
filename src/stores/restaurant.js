import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Restaurant } from '../models'
import { restaurantService } from '../services/restaurant.service'

export const useRestaurantStore = defineStore('restaurant', () => {
  // STATE
  const restaurants = ref([])
  const currentRestaurant = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const filters = ref({
    cuisine: [],
    priceRange: [],
    rating: 0,
    search: ''
  })

  // GETTERS
  const filteredRestaurants = computed(() => {
    return restaurants.value.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
                          r.cuisine.some(c => c.toLowerCase().includes(filters.value.search.toLowerCase()))

      const matchCuisine = filters.value.cuisine.length === 0 ||
                          r.cuisine.some(c => filters.value.cuisine.includes(c))

      const matchPrice = filters.value.priceRange.length === 0 ||
                        filters.value.priceRange.includes(r.priceRange)

      const matchRating = r.rating >= filters.value.rating

      return matchSearch && matchCuisine && matchPrice && matchRating
    })
  })

  // ACTIONS
  async function fetchRestaurants() {
    isLoading.value = true
    error.value = null
    try {
      const data = await restaurantService.getAllRestaurants()
      restaurants.value = data.map(r => new Restaurant(r))
      return restaurants.value
    } catch (err) {
      error.value = err.error || 'Erro ao carregar restaurantes'
      // Manter dados anteriores em caso de erro
      return restaurants.value
    } finally {
      isLoading.value = false
    }
  }

  async function fetchRestaurantById(id) {
    isLoading.value = true
    error.value = null
    try {
      const data = await restaurantService.getRestaurantById(id)
      currentRestaurant.value = new Restaurant(data)
      return currentRestaurant.value
    } catch (err) {
      error.value = err.error || 'Erro ao carregar restaurante'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function createRestaurant(restaurantData) {
    isLoading.value = true
    error.value = null
    try {
      const data = await restaurantService.createRestaurant(restaurantData)
      const newRestaurant = new Restaurant(data)
      restaurants.value.unshift(newRestaurant)
      return newRestaurant
    } catch (err) {
      error.value = err.error || 'Erro ao criar restaurante'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateRestaurant(id, restaurantData) {
    isLoading.value = true
    error.value = null
    try {
      const data = await restaurantService.updateRestaurant(id, restaurantData)
      const updated = new Restaurant(data)
      
      const index = restaurants.value.findIndex(r => r.id === id)
      if (index !== -1) {
        restaurants.value[index] = updated
      }
      
      if (currentRestaurant.value?.id === id) {
        currentRestaurant.value = updated
      }
      
      return updated
    } catch (err) {
      error.value = err.error || 'Erro ao atualizar restaurante'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function deleteRestaurant(id) {
    isLoading.value = true
    error.value = null
    try {
      await restaurantService.deleteRestaurant(id)
      restaurants.value = restaurants.value.filter(r => r.id !== id)
      if (currentRestaurant.value?.id === id) {
        currentRestaurant.value = null
      }
      return true
    } catch (err) {
      error.value = err.error || 'Erro ao deletar restaurante'
      return false
    } finally {
      isLoading.value = false
    }
  }

  function setFilter(filterType, value) {
    filters.value[filterType] = value
  }

  function clearFilters() {
    filters.value = {
      cuisine: [],
      priceRange: [],
      rating: 0,
      search: ''
    }
  }

  return {
    restaurants,
    currentRestaurant,
    isLoading,
    error,
    filters,
    filteredRestaurants,
    fetchRestaurants,
    fetchRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    setFilter,
    clearFilters
  }
})
