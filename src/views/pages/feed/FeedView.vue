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
            <router-link to="/profile" class="text-slate-300 hover:text-white transition font-medium">Perfil</router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
    <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6">
      <h1 class="font-bold text-3xl text-white">Feed de Reviews 🍽️</h1>
      <p class="text-slate-400 mt-2">Todas as reviews da comunidade</p>
    </div>

    <!-- Reviews Container -->
    <div v-if="allReviews.length > 0" ref="feedContainer" class="space-y-6">
      <ReviewCard
        v-for="review in allReviews"
        :key="review.id"
        :review="review"
        @like="handleLike"
        @toggle-like="handleToggleLike"
      />

      <!-- Loading Indicator -->
      <div v-if="isLoadingMore" class="flex justify-center py-8">
        <div class="text-center">
          <div class="animate-spin text-5xl mb-4">⏳</div>
          <p class="text-slate-400">Carregando mais reviews...</p>
        </div>
      </div>

      <!-- End of Feed -->
      <div v-if="!isLoadingMore && !hasMore && allReviews.length > 0" class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-12 text-center">
        <div class="text-5xl mb-4">🎉</div>
        <h3 class="font-bold text-xl text-white mb-2">Você viu todas as reviews!</h3>
        <p class="text-slate-400">
          Volte mais tarde para ver novas reviews da comunidade
        </p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading" class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-12 text-center">
      <div class="text-5xl mb-4">📭</div>
      <h3 class="font-bold text-xl text-white mb-2">Nenhuma review para mostrar</h3>
      <p class="text-slate-400 mb-6">
        Comece a seguir outros usuários ou explore restaurantes para ver reviews
      </p>
      <router-link to="/discover" class="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium">
        Explorar Restaurantes
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-else class="flex justify-center py-12">
      <div class="animate-spin text-5xl">⏳</div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useReviewStore } from '../../../stores/review'
import ReviewCard from '../../components/ReviewCard.vue'

const reviewStore = useReviewStore()
const feedContainer = ref(null)
const isLoading = ref(false)
const isLoadingMore = ref(false)
const hasMore = ref(true)
const skip = ref(0)
const take = ref(20)

// Computed property para todas as reviews
const allReviews = computed(() => reviewStore.allReviews)

// Função para detectar quando usuário scrollou até o final
const handleScroll = () => {
  if (!feedContainer.value) return

  const scrollElement = window
  const scrollPosition = scrollElement.scrollY + scrollElement.innerHeight
  const pageHeight = document.documentElement.scrollHeight

  // Se scrollou 500px antes do final, carrega mais
  if (scrollPosition >= pageHeight - 500 && !isLoadingMore.value && hasMore.value && !isLoading.value) {
    loadMoreReviews()
  }
}

// Carregar mais reviews
const loadMoreReviews = async () => {
  if (isLoadingMore.value || !hasMore.value) return

  isLoadingMore.value = true
  skip.value += take.value

  try {
    const newReviews = await reviewStore.fetchReviews({
      skip: skip.value,
      take: take.value
    })

    // Se retornou menos de `take`, chegou ao final
    if (!newReviews || newReviews.length < take.value) {
      hasMore.value = false
    }
  } catch (error) {
    console.error('Erro ao carregar mais reviews:', error)
    hasMore.value = false
  } finally {
    isLoadingMore.value = false
  }
}

// Handle like
const handleLike = async (reviewId) => {
  await reviewStore.likeReview(reviewId)
}

// Handle toggle like - atualizar o estado da review
const handleToggleLike = (data) => {
  console.log('📨 handleToggleLike recebido no pai:', data)
  const { reviewId, liked } = data
  const review = allReviews.value.find(r => r.id === reviewId)
  console.log('🔍 Review encontrada:', { found: !!review, reviewId })
  if (review) {
    console.log('📝 Atualizando review:', { 
      antes: { likes: review.likes, likes_by_user: review.likes_by_user },
      depois: { likes: review.likes + (liked ? 1 : -1), likes_by_user: liked }
    })
    review.likes_by_user = liked
    review.likes += liked ? 1 : -1
    console.log('✅ Review atualizada')
  } else {
    console.warn('⚠️ Review NÃO encontrada em allReviews')
  }
}

// Setup and cleanup
onMounted(async () => {
  isLoading.value = true
  skip.value = 0
  hasMore.value = true

  try {
    await reviewStore.fetchReviews({ skip: 0, take: take.value })
  } catch (error) {
    console.error('Erro ao carregar reviews iniciais:', error)
  } finally {
    isLoading.value = false
  }

  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}
</style>
