<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 backdrop-blur-md bg-slate-900/95 border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-2 text-2xl font-bold">
            <span class="text-orange-500">🍽️</span>
            <span class="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              GastroLog
            </span>
          </div>
          <div class="flex items-center gap-6">
            <router-link to="/" class="text-slate-300 hover:text-white transition font-medium">Home</router-link>
            <router-link to="/discover" class="text-slate-300 hover:text-white transition font-medium">Descobrir</router-link>
            <router-link to="/feed" class="text-slate-300 hover:text-white transition font-medium">Feed</router-link>
            <router-link to="/profile" class="text-slate-300 hover:text-white transition font-medium">
              Perfil
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div v-if="restaurantStore.isLoading" class="p-12 text-center">
        <div class="animate-spin text-4xl mb-4">⏳</div>
      </div>

      <template v-else-if="currentRestaurant">
        <!-- Header with Image -->
        <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg overflow-hidden">
          <div class="h-80 overflow-hidden">
            <img
              :src="currentRestaurant.image"
              :alt="currentRestaurant.name"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Restaurant Info -->
          <div class="p-8">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h1 class="font-bold text-4xl mb-2 text-white">{{ currentRestaurant.name }}</h1>
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl text-yellow-400">⭐</span>
                    <span class="text-xl font-bold text-white">{{ currentRestaurant.rating }}</span>
                    <span class="text-slate-400 text-sm">
                      ({{ currentRestaurant.reviewsCount }} reviews)
                    </span>
                  </div>
                  <span class="text-slate-400">{{ currentRestaurant.priceRange }}</span>
                </div>
              </div>

              <div class="flex gap-3">
                <button class="p-3 bg-slate-700 hover:bg-orange-500 text-white rounded-lg transition">
                  ❤️
                </button>
                <button class="p-3 bg-slate-700 hover:bg-orange-500 text-white rounded-lg transition">
                  🔗
                </button>
              </div>
            </div>

            <!-- Description -->
            <p class="text-slate-300 text-lg mb-6 leading-relaxed">
              {{ currentRestaurant.description }}
            </p>

            <!-- Info Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-slate-700/50">
              <div>
                <div class="text-sm text-slate-400 mb-1">Culinária</div>
                <div class="font-semibold text-white">{{ currentRestaurant.cuisine.join(', ') }}</div>
              </div>
              <div>
                <div class="text-sm text-slate-400 mb-1">Horário</div>
                <div class="font-semibold text-white">{{ currentRestaurant.hours.open }} - {{ currentRestaurant.hours.close }}</div>
              </div>
              <div>
                <div class="text-sm text-slate-400 mb-1">Localização</div>
                <div class="font-semibold text-white">{{ currentRestaurant.location.city }}, {{ currentRestaurant.location.state }}</div>
              </div>
              <div>
                <div class="text-sm text-slate-400 mb-1">Tags</div>
                <div class="font-semibold text-sm text-white">{{ currentRestaurant.tags.slice(0, 2).join(', ') }}</div>
              </div>
            </div>

            <!-- CTA -->
            <router-link
              :to="`/review/new/${currentRestaurant.id}`"
              class="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-orange-500/50 transition"
            >
              ✍️ Escrever Review
            </router-link>
          </div>
        </div>

        <!-- Reviews Section -->
        <section class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="font-bold text-2xl text-white">Reviews</h2>
            <div class="text-slate-400 text-sm">
              Média: {{ reviewStore.averageRating }} ⭐
            </div>
          </div>

          <div class="space-y-4">
            <ReviewCard
              v-for="review in reviewStore.allReviews"
              :key="review.id"
              :review="review"
              @like="handleLike"
              @toggle-like="handleToggleLike"
            />
          </div>
        </section>

        <!-- Recommendations Section -->
        <section class="space-y-6">
          <h2 class="font-bold text-2xl text-white">Restaurantes Similares</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <router-link
              v-for="rec in recommendations"
              :key="rec.id"
              :to="`/restaurant/${rec.id}`"
              class="group overflow-hidden rounded-lg hover:shadow-xl hover:shadow-orange-500/20 transition cursor-pointer"
            >
              <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg overflow-hidden">
                <div class="h-32 overflow-hidden">
                  <img
                    :src="rec.image"
                    :alt="rec.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div class="p-4">
                  <h3 class="font-bold mb-1 text-white">{{ rec.name }}</h3>
                  <div class="flex items-center gap-2 text-sm text-slate-400">
                    <span class="text-yellow-400">⭐</span>
                    <span>{{ rec.rating }}</span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRestaurantStore } from '../../../stores/restaurant'
import { useReviewStore } from '../../../stores/review'
import { useRecommendationStore } from '../../../stores/recommendation'
import ReviewCard from '../../components/ReviewCard.vue'

const route = useRoute()
const restaurantStore = useRestaurantStore()
const reviewStore = useReviewStore()
const recommendationStore = useRecommendationStore()

const currentRestaurant = computed(() => restaurantStore.currentRestaurant)

const recommendations = computed(() => {
  if (!currentRestaurant.value) return []
  return recommendationStore.getContentBasedRec(
    currentRestaurant.value,
    restaurantStore.restaurants
  )
})

onMounted(async () => {
  const restaurantId = route.params.id
  await restaurantStore.fetchRestaurantById(restaurantId)
  await reviewStore.fetchReviews(parseInt(restaurantId))

  if (currentRestaurant.value) {
    recommendationStore.recordView(
      currentRestaurant.value.id,
      currentRestaurant.value.cuisine
    )
  }
})

const handleLike = async (reviewId) => {
  await reviewStore.likeReview(reviewId)
}

const handleToggleLike = (data) => {
  const { reviewId, liked } = data
  const review = reviewStore.allReviews.find(r => r.id === reviewId)
  if (review) {
    review.likes_by_user = liked
    review.likes += liked ? 1 : -1
  }
}
</script>
