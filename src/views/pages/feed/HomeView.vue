<template>
  <div class="space-y-6">
    <!-- Welcome Banner -->
    <div class="card p-8 bg-gradient-to-r from-primary to-primary-container text-on-primary">
      <h1 class="font-display font-bold text-3xl mb-2">Bem-vindo, {{ authStore.user?.fullName }}! 👋</h1>
      <p class="text-on-primary opacity-90">
        Confira as reviews mais recentes dos seus seguidores
      </p>
    </div>

    <!-- Feed -->
    <div v-if="reviewStore.allReviews.length > 0" class="space-y-6">
      <ReviewCard
        v-for="review in reviewStore.allReviews"
        :key="review.id"
        :review="review"
        @like="handleLike"
        @toggle-like="handleToggleLike"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="card p-12 text-center">
      <div class="text-5xl mb-4">📭</div>
      <h3 class="font-display font-bold text-xl mb-2">Nenhuma review para mostrar</h3>
      <p class="text-on-surface-variant mb-6">
        Comece a seguir outros usuários ou explore restaurantes para ver reviews
      </p>
      <router-link
        to="/discover"
        class="btn-primary inline-flex"
      >
        Explorar Restaurantes
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '../../../stores/auth'
import { useReviewStore } from '../../../stores/review'
import ReviewCard from '../../components/ReviewCard.vue'

const authStore = useAuthStore()
const reviewStore = useReviewStore()

onMounted(async () => {
  await reviewStore.fetchReviews()
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
