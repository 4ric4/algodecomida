<template>
  <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-4 flex-1">
        <!-- Author Avatar -->
        <img
          :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userId}`"
          alt="Autor"
          class="w-12 h-12 rounded-full"
        />

        <!-- Author Info -->
        <div class="flex-1">
          <router-link
            :to="`/profile/${review.user?.username}`"
            class="font-semibold text-white hover:text-orange-400 transition"
          >
            {{ review.user?.username || 'Usuário' }}
          </router-link>
          <div class="flex items-center gap-2 text-sm text-slate-400">
            <span>{{ getTimeAgo(review.createdAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Rating -->
      <div class="flex gap-1">
        <span
          v-for="i in 5"
          :key="i"
          class="text-lg"
          :class="i <= review.rating ? 'text-yellow-400' : 'text-slate-600/50'"
        >
          ⭐
        </span>
      </div>
    </div>

    <!-- Title -->
    <h3 class="font-bold text-lg mb-2 text-white">{{ review.title }}</h3>

    <!-- Restaurant -->
    <router-link
      :to="`/restaurants/${review.restaurantId}`"
      class="text-sm font-semibold text-orange-400 hover:text-orange-300 transition mb-3 inline-block"
    >
      🍽️ {{ review.restaurant?.name || 'Restaurante' }}
    </router-link>

    <!-- Content -->
    <p class="text-slate-300 mb-4 leading-relaxed">
      {{ review.text }}
    </p>

    <!-- Dishes -->
    <div v-if="review.dishes.length > 0" class="mb-4">
      <div class="text-sm font-semibold text-slate-400 mb-2">Pratos:</div>
      <div class="flex gap-2 flex-wrap">
        <span
          v-for="dish in review.dishes"
          :key="dish"
          class="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded-full"
        >
          {{ dish }}
        </span>
      </div>
    </div>

    <!-- Images -->
    <div v-if="review.images.length > 0" class="mb-4">
      <div class="grid grid-cols-3 gap-2">
        <img
          v-for="(image, idx) in review.images"
          :key="idx"
          :src="image"
          :alt="`Review image ${idx + 1}`"
          class="w-full h-24 object-cover rounded-lg"
        />
      </div>
    </div>

    <!-- Footer - Actions -->
    <div class="flex items-center justify-between pt-4 border-t border-slate-700/50">
      <div class="flex items-center gap-4 text-sm text-slate-400">
        <!-- Like Button -->
        <button
          @click.prevent="handleLike"
          class="flex items-center gap-2 hover:text-red-500 transition font-medium"
          :class="{ 'text-red-500': reviewLikedByUser }"
          title="Curtir"
          :disabled="isLiking || !authStore.user"
        >
          <span v-if="reviewLikedByUser">❤️</span>
          <span v-else>🤍</span>
          <span>{{ reviewLikes }}</span>
        </button>

        <!-- Comment Button -->
        <button 
          @click="toggleCommentBox"
          class="flex items-center gap-2 hover:text-blue-400 transition font-medium"
          title="Comentários"
        >
          <span>💬</span>
          <span>{{ review.commentCount || 0 }}</span>
        </button>

        <!-- Share Button -->
        <button 
          @click="handleShare"
          class="flex items-center gap-2 hover:text-green-400 transition font-medium"
          title="Compartilhar"
        >
          <span>🔗</span>
          <span>Compartilhar</span>
        </button>
      </div>
    </div>

    <!-- Comment Section -->
    <div v-if="showCommentBox" class="mt-4 pt-4 border-t border-slate-700/50 space-y-3">
      <!-- Add Comment Form -->
      <div v-if="!hasUserCommented" class="flex gap-2">
        <input
          v-model="newComment"
          @keyup.enter="handleAddComment"
          type="text"
          placeholder="Adicione seu comentário..."
          class="flex-1 bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500"
        />
        <button
          @click="handleAddComment"
          :disabled="!newComment.trim() || isCommentingLoading"
          class="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded font-medium transition text-sm"
        >
          {{ isCommentingLoading ? '...' : 'Enviar' }}
        </button>
      </div>
      <div v-else class="p-2 bg-slate-700/30 rounded text-sm text-slate-300">
        ℹ️ Você já comentou neste review
      </div>

      <!-- Comments List -->
      <div v-if="comments && comments.length > 0" class="space-y-2 max-h-40 overflow-y-auto">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="bg-slate-700/30 rounded p-2 text-sm"
        >
          <div class="flex justify-between items-start">
            <div class="flex gap-2 flex-1">
              <img
                :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.username}`"
                :alt="comment.user?.username"
                class="w-6 h-6 rounded-full"
              />
              <div class="flex-1">
                <div class="font-semibold text-white text-xs">{{ comment.user?.username }}</div>
                <div class="text-slate-300 text-xs">{{ comment.text }}</div>
              </div>
            </div>
            <button
              v-if="isOwnComment(comment)"
              @click="handleDeleteComment(comment.id)"
              class="text-red-400 hover:text-red-300 text-xs ml-2"
              title="Deletar comentário"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useReviewStore } from '../../stores/review'
import { useAuthStore } from '../../stores/auth'
import { ref, onMounted, computed, watch } from 'vue'
import { reviewService } from '../../services/review.service'

const props = defineProps({
  review: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['like'])
const reviewStore = useReviewStore()
const authStore = useAuthStore()
const isLiking = ref(false)
const showCommentBox = ref(false)
const newComment = ref('')
const comments = ref([])
const isCommentingLoading = ref(false)

// Usar ref para rastrear mudanças nos likes
const reviewLikes = ref(props.review?.likes || 0)
const reviewLikedByUser = ref(props.review?.likes_by_user || false)

console.log('🎴 ReviewCard iniciado:', {
  reviewId: props.review.id,
  reviewIdType: typeof props.review.id,
  reviewIdValue: JSON.stringify(props.review.id),
  initialLikes: reviewLikes.value,
  initialLikedByUser: reviewLikedByUser.value,
  propsLikes: props.review.likes,
  propsLikedByUser: props.review.likes_by_user,
  wholeReview: JSON.stringify(props.review)
})

const hasUserCommented = computed(() => {
  return comments.value.some(c => c.userId === authStore.user?.id)
})

// NÃO usar watch aqui - deixar as refs locais controlarem tudo
// O watch estava revertendo as mudanças quando o usuário clicava!

const handleLike = async () => {
  // Bloqueio rigoroso de cliques
  if (isLiking.value) {
    console.warn('⏳ Clique ignorado - já em processo')
    return
  }
  
  if (!authStore.user) {
    console.warn('❌ Usuário não autenticado')
    return
  }
  
  // Validar ID
  const reviewId = props.review.id
  if (!reviewId || isNaN(reviewId)) {
    console.error('❌ ID INVÁLIDO:', { received: props.review.id })
    alert('Erro: ID da review inválido')
    return
  }
  
  // Bloquear IMEDIATAMENTE
  isLiking.value = true
  
  try {
    // Salvar estado ANTES de qualquer coisa
    const wasLiked = reviewLikedByUser.value
    const previousLikes = reviewLikes.value
    
    // 🔥 ATUALIZAR IMEDIATAMENTE NO FRONTEND (otimistic update)
    const newLikeState = !wasLiked
    const newLikesCount = previousLikes + (wasLiked ? -1 : 1)
    
    console.log('🔄 CLIQUE - Atualizando UI:', { 
      wasLiked, 
      newLikeState,
      previousLikes,
      newLikesCount
    })
    
    // ATUALIZAR LOCAL - SEM ESPERAR O SERVIDOR
    reviewLikedByUser.value = newLikeState
    reviewLikes.value = newLikesCount
    
    console.log('✨ UI atualizada:', { 
      coração: newLikeState ? '❤️' : '🤍',
      likes: newLikesCount
    })
    
    // Fazer a requisição ao servidor em background
    if (wasLiked) {
      console.log('📤 DELETE /reviews/:id/like')
      await reviewStore.unlikeReview(reviewId)
    } else {
      console.log('📤 POST /reviews/:id/like')
      await reviewStore.likeReview(reviewId)
    }
    
    console.log('✅ Servidor respondeu')
    
  } catch (err) {
    console.error('❌ ERRO:', err.message)
    // Reverter apenas em caso de erro
    reviewLikedByUser.value = !reviewLikedByUser.value
    reviewLikes.value = reviewLikes.value + (reviewLikedByUser.value ? 1 : -1)
  } finally {
    // Aguardar um pouco antes de desbloquear
    await new Promise(resolve => setTimeout(resolve, 300))
    isLiking.value = false
  }
}

const handleShare = () => {
  // Criar URL compartilhável
  const reviewUrl = `${window.location.origin}/reviews/${props.review.id}`
  
  // Copiar para clipboard
  navigator.clipboard.writeText(reviewUrl).then(() => {
    console.log('URL copiada para clipboard:', reviewUrl)
    alert('Link copiado para clipboard! 🎉')
  }).catch(err => {
    console.error('Erro ao copiar para clipboard:', err)
    // Fallback: usar Web Share API
    if (navigator.share) {
      navigator.share({
        title: `Review: ${props.review.title}`,
        text: `Confira este review: ${reviewUrl}`,
        url: reviewUrl
      }).catch(err => console.error('Erro ao compartilhar:', err))
    }
  })
}

const toggleCommentBox = async () => {
  showCommentBox.value = !showCommentBox.value
  if (showCommentBox.value && comments.value.length === 0) {
    await loadComments()
  }
}

const handleAddComment = async () => {
  if (!newComment.value.trim() || isCommentingLoading.value) return
  
  // Verificar se usuário já comentou
  const userAlreadyCommented = comments.value.some(c => c.userId === authStore.user?.id)
  if (userAlreadyCommented) {
    alert('Você já comentou neste review! (1 comentário por review)')
    return
  }
  
  isCommentingLoading.value = true
  try {
    const comment = await reviewService.createComment(props.review.id, {
      text: newComment.value.trim()
    })
    
    comments.value.push(comment)
    newComment.value = ''
    
    // Atualizar contador de comentários
    props.review.commentCount = (props.review.commentCount || 0) + 1
  } catch (err) {
    console.error('Erro ao adicionar comentário:', err)
    alert('Erro ao adicionar comentário')
  } finally {
    isCommentingLoading.value = false
  }
}

const handleDeleteComment = async (commentId) => {
  if (!confirm('Tem certeza que deseja deletar este comentário?')) return
  
  try {
    await reviewService.deleteComment(props.review.id, commentId)
    comments.value = comments.value.filter(c => c.id !== commentId)
    
    if (props.review.commentCount > 0) {
      props.review.commentCount--
    }
  } catch (err) {
    console.error('Erro ao deletar comentário:', err)
    alert('Erro ao deletar comentário')
  }
}

const isOwnComment = (comment) => {
  return authStore.user?.id === comment.userId
}

const loadComments = async () => {
  try {
    comments.value = await reviewService.getComments(props.review.id)
    // Atualizar contador de comentários baseado nos comentários carregados
    props.review.commentCount = comments.value.length
  } catch (err) {
    console.error('Erro ao carregar comentários:', err)
  }
}

onMounted(async () => {
  if (showCommentBox.value) {
    loadComments()
  }
  
  // 🔥 SINCRONIZAR COM SERVIDOR PARA PEGAR O ESTADO CORRETO DO LIKE
  if (authStore.user && props.review.id) {
    try {
      const reviewId = props.review.id
      if (!reviewId || isNaN(reviewId)) {
        console.error('❌ ID INVÁLIDO AO SINCRONIZAR:', { received: props.review.id })
        return
      }
      
      console.log('🔄 Carregando estado correto do servidor...', { reviewId })
      const serverReview = await reviewService.getReviewById(reviewId)
      
      console.log('✅ Servidor retornou:', { 
        likes: serverReview.likes, 
        likes_by_user: serverReview.likes_by_user 
      })
      
      // Atualizar refs com dados do servidor
      reviewLikes.value = serverReview.likes || 0
      reviewLikedByUser.value = serverReview.likes_by_user || false
      
      console.log('💚 Estado sincronizado! reviewLikedByUser =', reviewLikedByUser.value, 
                  'coração:', reviewLikedByUser.value ? '❤️' : '🤍')
    } catch (err) {
      console.error('❌ Erro ao sincronizar:', err)
      // Se falhar, usar os dados da props (pelo menos tem algo)
      reviewLikes.value = props.review?.likes || 0
      reviewLikedByUser.value = props.review?.likes_by_user || false
    }
  }
})

const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} dias atrás`
  if (hours > 0) return `${hours} horas atrás`
  if (minutes > 0) return `${minutes} minutos atrás`
  return 'Agora'
}
</script>
