import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useRecommendationStore = defineStore('recommendation', () => {
  // STATE
  const recommendations = ref([])
  const personalizationData = ref({
    favoritesCuisines: [],
    viewedRestaurants: [],
    likedReviews: [],
    ratedRestaurants: []
  })

  // MOCK ALGORITHM
  const cuisinieAffinityScores = ref({
    'Italiana': 0,
    'Japonesa': 0,
    'Brasileira': 0,
    'Americana': 0,
    'Francesa': 0,
    'Asiática': 0,
    'Mexicana': 0
  })

  // GETTERS
  const topRecommendations = computed(() => {
    return recommendations.value.slice(0, 5)
  })

  // ACTIONS
  function recordView(restaurantId, cuisines) {
    if (!personalizationData.value.viewedRestaurants.includes(restaurantId)) {
      personalizationData.value.viewedRestaurants.push(restaurantId)
      updateCuisineAffinity(cuisines, 1)
    }
  }

  function recordRating(restaurantId, cuisines, rating) {
    if (!personalizationData.value.ratedRestaurants.includes(restaurantId)) {
      personalizationData.value.ratedRestaurants.push(restaurantId)
    }
    // Dar mais peso a ratings altos
    const weight = rating >= 4 ? 3 : rating >= 3 ? 1 : -1
    updateCuisineAffinity(cuisines, weight)
  }

  function updateCuisineAffinity(cuisines, weight = 1) {
    cuisines.forEach(cuisine => {
      if (cuisinieAffinityScores.value.hasOwnProperty(cuisine)) {
        cuisinieAffinityScores.value[cuisine] += weight
      }
    })
  }

  function recordLike(reviewId) {
    if (!personalizationData.value.likedReviews.includes(reviewId)) {
      personalizationData.value.likedReviews.push(reviewId)
    }
  }

  function addToFavorites(cuisine) {
    if (!personalizationData.value.favoritesCuisines.includes(cuisine)) {
      personalizationData.value.favoritesCuisines.push(cuisine)
      updateCuisineAffinity([cuisine], 5)
    }
  }

  function generateRecommendations(allRestaurants) {
    // Algoritmo simples de recomendação
    const scored = allRestaurants.map(restaurant => {
      let score = restaurant.rating * 10 // Base score

      // Bonus por cuisines preferidas
      restaurant.cuisine.forEach(cuisine => {
        score += cuisinieAffinityScores.value[cuisine] || 0
      })

      // Penalidade se já visto
      if (personalizationData.value.viewedRestaurants.includes(restaurant.id)) {
        score -= 10
      }

      // Bonus se favoritos
      if (restaurant.cuisine.some(c => personalizationData.value.favoritesCuisines.includes(c))) {
        score += 20
      }

      return { ...restaurant, recommendationScore: score }
    })

    recommendations.value = scored
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 10)
  }

  function getContentBasedRec(currentRestaurant, allRestaurants) {
    // Recomenda baseado em similaridade de cuisine/preço
    return allRestaurants
      .filter(r => r.id !== currentRestaurant.id)
      .map(r => {
        let similarity = 0
        const sharedCuisines = r.cuisine.filter(c => currentRestaurant.cuisine.includes(c))
        similarity += sharedCuisines.length * 5

        if (r.priceRange === currentRestaurant.priceRange) {
          similarity += 3
        }

        const ratingSim = Math.abs(r.rating - currentRestaurant.rating)
        similarity += Math.max(0, 5 - ratingSim)

        return { ...r, similarity }
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)
  }

  function getCollaborativeRec(userProfile, reviews) {
    // Simular recomendação colaborativa: encontrar usuários similares
    // e recomendar o que eles gostaram
    return reviews
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5)
  }

  return {
    recommendations,
    personalizationData,
    cuisinieAffinityScores,
    topRecommendations,
    recordView,
    recordRating,
    updateCuisineAffinity,
    recordLike,
    addToFavorites,
    generateRecommendations,
    getContentBasedRec,
    getCollaborativeRec
  }
})
