<template>
  <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6 hover:border-slate-600 transition">
    <!-- Header: User Info -->
    <div class="flex justifconst toggleLike = async () => {
  console.log('❤️ toggleLike - ReviewID:', props.review?.id, 'isLiked:', isLiked.value)
  
  if (!props.review?.id) {
    console.error('❌ Review ID não encontrado')
    return
  }

  // Evita múltiplos cliques simultâneos
  if (isLiking.value) {
    console.log('⏳ Já está processando like/unlike')
    return
  }

  isLiking.value = true
  
  try {
    if (isLiked.value) {
      // Unlike
      console.log('💔 Removendo like...')
      await reviewStore.unlikeReview(props.review.id)
      console.log('✅ Unlike bem-sucedido')
    } else {
      // Like
      console.log('❤️ Adicionando like...')
      await reviewStore.likeReview(props.review.id)
      console.log('✅ Like bem-sucedido')
    }
    
    // Emitir evento para pai atualizar se necessário
    emit('toggle-like', props.review.id)
  } catch (error) {
    console.error('❌ Erro ao fazer toggle de like:', error)
  } finally {
    isLiking.value = false
  }
}n mb-4">
      <div class="flex items-center gap-3">
        <img
          :src="review.user?.avatar || 'https://via.placeholder.com/40'"
          :alt="review.user?.username"
          class="w-10 h-10 rounded-full object-cover border border-slate-600"
        />
        <div>
          <p class="font-semibold text-white">{{ review.user?.username }}</p>
          <p class="text-xs text-slate-400">{{ formatDate(review.createdAt) }}</p>
        </div>
      </div>

      <!-- Rating Stars -->
      <div class="flex gap-1">
        <span v-for="i in 5" :key="i" class="text-lg">
          {{ i <= review.rating ? '⭐' : '☆' }}
        </span>
      </div>
    </div>

    <!-- Title -->
    <h3 class="text-lg font-bold text-white mb-2">{{ review.title }}</h3>

    <!-- Text -->
    <p class="text-slate-300 mb-4 leading-relaxed">{{ review.text }}</p>

    <!-- Dishes -->
    <div v-if="review.dishes && review.dishes.length > 0" class="mb-4">
      <p class="text-sm font-medium text-slate-400 mb-2">🍽️ Pratos experimentados:</p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(dish, idx) in review.dishes"
          :key="idx"
          class="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm border border-slate-600"
        >
          {{ dish }}
        </span>
      </div>
    </div>

    <!-- Images -->
    <div v-if="review.images && review.images.length > 0" class="mb-4">
      <p class="text-sm font-medium text-slate-400 mb-2">📸 Fotos:</p>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        <img
          v-for="(img, idx) in review.images"
          :key="idx"
          :src="img"
          :alt="`Review image ${idx}`"
          class="w-full h-24 object-cover rounded-lg border border-slate-600 cursor-pointer hover:border-orange-500 transition"
          @click="openImageViewer(idx)"
        />
      </div>
    </div>

    <!-- Restaurant Info -->
    <div v-if="review.restaurant" class="bg-slate-700/50 rounded-lg p-3 mb-4 border border-slate-600">
      <p class="text-sm text-slate-300">
        <span class="font-semibold">🏪 Restaurante:</span> {{ review.restaurant.name }}
      </p>
    </div>

    <!-- Footer: Actions -->
    <div class="flex items-center justify-between pt-4 border-t border-slate-700">
      <button
        v-on:click="toggleLike"
        type="button"
        :disabled="isLiking"
        :class="isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'"
        class="flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
        style="pointer-events: auto; background: none; border: none; padding: 0;"
      >
        <span class="text-lg">{{ isLiked ? '❤️' : '🤍' }}</span>
        <span class="text-sm">{{ displayedLikes }}</span>
      </button>

      <div class="flex items-center gap-2 text-slate-400 text-sm">
        <span>💬 {{ review.comments?.length || 0 }}</span>
      </div>

      <button
        v-if="isOwner"
        @click="emit('delete')"
        class="text-slate-400 hover:text-red-500 transition"
      >
        🗑️
      </button>
    </div>

    <!-- Image Viewer Modal -->
    <Teleport to="body" v-if="showImageViewer">
      <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" @click="closeImageViewer">
        <div class="relative max-w-2xl w-full" @click.stop>
          <button
            @click="closeImageViewer"
            class="absolute -top-8 -right-8 text-white text-2xl hover:text-orange-500 transition"
          >
            ✕
          </button>
          <img :src="review.images[currentImageIndex]" class="w-full rounded-lg" />
          <div v-if="review.images.length > 1" class="flex justify-center gap-4 mt-4">
            <button
              @click="prevImage"
              class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
            >
              ← Anterior
            </button>
            <span class="text-white">{{ currentImageIndex + 1 }} / {{ review.images.length }}</span>
            <button
              @click="nextImage"
              class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
            >
              Próximo →
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useReviewStore } from '../stores/review'

const props = defineProps({
  review: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete', 'toggle-like'])

const authStore = useAuthStore()
const reviewStore = useReviewStore()

const isLiking = ref(false)
const showImageViewer = ref(false)
const currentImageIndex = ref(0)

const isOwner = computed(() => authStore.user?.id === props.review.userId)

const isLiked = computed(() => {
  // Usa userLiked se disponível (novo padrão), senão tenta likes_by_user
  return props.review.userLiked === true || props.review.likes_by_user === true
})

const displayedLikes = computed(() => {
  // Conta o número de likes
  if (props.review.likedBy && Array.isArray(props.review.likedBy)) {
    return props.review.likedBy.length
  }
  return props.review.likes || 0
})

// Log de inicialização
console.log('✅ ReviewCard montado:', {
  reviewId: props.review.id,
  reviewTitle: props.review.title,
  authStoreUser: authStore.user?.username
})

onMounted(() => {
  console.log('🟢 ReviewCard onMounted - procurando botão de like')
  const btn = document.querySelector('button[v-on\\:click="toggleLike"]')
  console.log('Botão encontrado?', !!btn)
})

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Agora'
  if (diffMins < 60) return `${diffMins}m atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  if (diffDays < 7) return `${diffDays}d atrás`
  
  return d.toLocaleDateString('pt-BR')
}

const toggleLike = () => {
  console.log('�🔴🔴 BOTÃO CLICADO 🔴🔴🔴')
  console.log('reviewId:', props.review?.id)
  console.log('isLiking:', isLiking.value)
  
  // Log mínimo
  alert('✅ CLICK FUNCIONANDO! ID: ' + props.review.id)
}

const openImageViewer = (index) => {
  currentImageIndex.value = index
  showImageViewer.value = true
}

const closeImageViewer = () => {
  showImageViewer.value = false
}

const nextImage = () => {
  if (currentImageIndex.value < props.review.images.length - 1) {
    currentImageIndex.value++
  } else {
    currentImageIndex.value = 0
  }
}

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  } else {
    currentImageIndex.value = props.review.images.length - 1
  }
}
</script>
