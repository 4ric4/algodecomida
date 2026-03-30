import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Review } from '../models'
import { reviewService } from '../services/review.service'

export const useReviewStore = defineStore('review', () => {
  const reviews = ref([])
  const currentReview = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const userReviews = ref([])
  const followingReviews = ref([])

  const allReviews = computed(() => reviews.value)
  const averageRating = computed(() => {
    if (reviews.value.length === 0) return 0
    const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0)
    return (sum / reviews.value.length).toFixed(1)
  })

  async function fetchReviews(options = {}) {
    isLoading.value = true
    error.value = null
    try {
      let data
      const { restaurantId = null, skip = 0, take = 20 } = options

      if (restaurantId) {
        data = await reviewService.getReviewsByRestaurant(restaurantId, { skip, take })
      } else {
        // Usar paginação
        data = await reviewService.getAllReviews({ skip, take })
      }

      // Se skip > 0, significa que estamos fazendo append (scroll infinito)
      if (skip > 0 && !restaurantId) {
        // Adicionar às reviews existentes
        reviews.value = [
          ...reviews.value,
          ...data.map(r => new Review(r))
        ]
      } else {
        // Primeira carga, substituir
        reviews.value = data.map(r => new Review(r))
      }

      return data
    } catch (err) {
      error.value = err.error || 'Erro ao carregar reviews'
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUserReviews(userId) {
    isLoading.value = true
    error.value = null
    try {
      const data = await reviewService.getReviewsByUser(userId)
      userReviews.value = data.map(r => new Review(r))
      return userReviews.value
    } catch (err) {
      error.value = err.error || 'Erro ao carregar reviews'
      return userReviews.value
    } finally {
      isLoading.value = false
    }
  }

  async function createReview(reviewData) {
    isLoading.value = true
    error.value = null
    try {
      const data = await reviewService.createReview(reviewData)
      const newReview = new Review(data)
      reviews.value.unshift(newReview)
      userReviews.value.unshift(newReview)
      return newReview
    } catch (err) {
      error.value = err.error || 'Erro ao criar review'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateReview(id, reviewData) {
    isLoading.value = true
    error.value = null
    try {
      const data = await reviewService.updateReview(id, reviewData)
      const updated = new Review(data)
      
      const index = reviews.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reviews.value[index] = updated
      }
      
      const userIndex = userReviews.value.findIndex(r => r.id === id)
      if (userIndex !== -1) {
        userReviews.value[userIndex] = updated
      }
      
      return updated
    } catch (err) {
      error.value = err.error || 'Erro ao atualizar review'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function deleteReview(id) {
    isLoading.value = true
    error.value = null
    try {
      await reviewService.deleteReview(id)
      reviews.value = reviews.value.filter(r => r.id !== id)
      userReviews.value = userReviews.value.filter(r => r.id !== id)
      return true
    } catch (err) {
      error.value = err.error || 'Erro ao deletar review'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function likeReview(id) {
    try {
      console.log('📤 Store.likeReview - ID:', { received: id, type: typeof id })
      const response = await reviewService.likeReview(id)
      // A response é um objeto Review com todas as propriedades
      const updatedReviewData = new Review(response)
      
      // Atualizar em reviews
      const reviewIndex = reviews.value.findIndex(r => r.id === reviewId)
      if (reviewIndex !== -1) {
        reviews.value[reviewIndex] = updatedReviewData
      }
      // Atualizar em userReviews
      const userReviewIndex = userReviews.value.findIndex(r => r.id === reviewId)
      if (userReviewIndex !== -1) {
        userReviews.value[userReviewIndex] = updatedReviewData
      }
      // Atualizar em followingReviews
      const followingReviewIndex = followingReviews.value.findIndex(r => r.id === reviewId)
      if (followingReviewIndex !== -1) {
        followingReviews.value[followingReviewIndex] = updatedReviewData
      }
      return true
    } catch (err) {
      error.value = err.error || 'Erro ao curtir review'
      return false
    }
  }

  async function unlikeReview(id) {
    try {
      console.log('📤 Store.unlikeReview - ID:', { received: id, type: typeof id })
      const response = await reviewService.unlikeReview(id)
      // A response é um objeto Review com todas as propriedades
      const updatedReviewData = new Review(response)
      
      // Atualizar em reviews
      const reviewIndex = reviews.value.findIndex(r => r.id === reviewId)
      if (reviewIndex !== -1) {
        reviews.value[reviewIndex] = updatedReviewData
      }
      // Atualizar em userReviews
      const userReviewIndex = userReviews.value.findIndex(r => r.id === reviewId)
      if (userReviewIndex !== -1) {
        userReviews.value[userReviewIndex] = updatedReviewData
      }
      // Atualizar em followingReviews
      const followingReviewIndex = followingReviews.value.findIndex(r => r.id === reviewId)
      if (followingReviewIndex !== -1) {
        followingReviews.value[followingReviewIndex] = updatedReviewData
      }
      return true
    } catch (err) {
      error.value = err.error || 'Erro ao descurtir review'
      return false
    }
  }

  async function fetchFollowingReviews() {
    isLoading.value = true
    error.value = null
    try {
      const data = await reviewService.getFollowingReviews()
      followingReviews.value = data.map(r => new Review(r))
      return followingReviews.value
    } catch (err) {
      error.value = err.error || 'Erro ao carregar reviews'
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    reviews,
    currentReview,
    isLoading,
    error,
    userReviews,
    followingReviews,
    allReviews,
    averageRating,
    fetchReviews,
    fetchUserReviews,
    fetchFollowingReviews,
    createReview,
    updateReview,
    deleteReview,
    likeReview,
    unlikeReview
  }
})
