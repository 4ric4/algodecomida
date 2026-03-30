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
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-8">
        <h1 class="font-bold text-3xl mb-2 text-white">Escrever uma Review</h1>
        <p class="text-slate-400">Compartilhe sua experiência gastronômica com a comunidade</p>
      </div>

      <form @submit.prevent="submitReview" class="space-y-6">
        <!-- Restaurant Selection (if not pre-selected) -->
        <div v-if="!selectedRestaurantId" class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6">
          <label class="block text-lg font-semibold mb-4 text-white">Qual restaurante você avaliará?</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              v-for="r in restaurantStore.restaurants"
              :key="r.id"
              type="button"
              @click="selectRestaurant(r.id)"
              class="p-4 border-2 border-slate-700/50 rounded-lg hover:border-orange-500 hover:bg-slate-700/50 transition text-left"
            >
              <div class="font-semibold text-white">{{ r.name }}</div>
              <div class="text-sm text-slate-400">{{ r.cuisine.join(', ') }}</div>
            </button>
          </div>
        </div>

        <!-- Review Form -->
        <div v-if="selectedRestaurantId" class="space-y-6">
          <!-- Rating -->
          <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6">
            <label class="block text-lg font-semibold mb-4 text-white">Como foi sua experiência?</label>
            <div class="flex gap-4 text-5xl mb-4">
              <button
                v-for="i in 5"
                :key="i"
                type="button"
                @click="form.rating = i"
                class="cursor-pointer transition hover:scale-125 duration-200"
                :class="i <= form.rating ? 'text-yellow-400 drop-shadow-lg' : 'text-slate-600 hover:text-yellow-300'"
              >
                ⭐
              </button>
            </div>
            <div v-if="form.rating > 0" class="text-lg text-yellow-400 font-semibold">
              {{ form.rating }} {{ form.rating === 1 ? 'estrela' : 'estrelas' }}
            </div>
          </div>

          <!-- Title -->
          <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6">
            <label class="block text-sm font-medium text-white mb-2">Título da Review</label>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="Ex: Experiência incrível!"
              class="w-full bg-slate-900 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-orange-500 transition"
            />
          </div>

          <!-- Content -->
          <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6">
            <label class="block text-sm font-medium text-white mb-2">Sua Opinião</label>
            <textarea
              v-model="form.text"
              required
              placeholder="Conte como foi sua experiência, o que você recomenda, pratos imperdíveis, etc..."
              class="w-full bg-slate-900 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-orange-500 transition min-h-40"
            ></textarea>
          </div>

          <!-- Dishes -->
          <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6">
            <label class="block text-sm font-medium text-white mb-4">Pratos que você experimentou</label>
            <div class="space-y-2">
              <div v-for="(dish, idx) in form.dishes" :key="idx" class="flex gap-2">
                <input
                  v-model="form.dishes[idx]"
                  type="text"
                  placeholder="Nome do prato"
                  class="flex-1 bg-slate-900 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-orange-500 transition"
                />
                <button
                  type="button"
                  @click="form.dishes.splice(idx, 1)"
                  class="px-4 py-3 bg-slate-700 hover:bg-red-600 text-white rounded-lg transition"
                >
                  🗑️
                </button>
              </div>
            </div>
            <button
              type="button"
              @click="form.dishes.push('')"
              class="mt-3 px-4 py-2 bg-slate-700 hover:bg-orange-600 text-white rounded-lg transition font-medium"
            >
              ➕ Adicionar Prato
            </button>
          </div>

          <!-- Images -->
          <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6">
            <label class="block text-sm font-medium text-white mb-4">Fotos (opcional - máximo 5, 5MB cada)</label>
            
            <!-- Image Preview -->
            <div v-if="form.images.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              <div v-for="(img, idx) in form.images" :key="idx" class="relative group">
                <img :src="img" :alt="`Preview ${idx}`" class="w-full h-24 object-cover rounded-lg border border-slate-600" />
                <button
                  type="button"
                  @click="form.images.splice(idx, 1)"
                  class="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
                <div v-if="uploadProgress[idx]" class="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div class="text-white text-sm">{{ uploadProgress[idx] }}%</div>
                </div>
              </div>
            </div>

            <!-- Upload Area -->
            <div
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              :class="isDragging ? 'border-orange-500 bg-slate-700/50' : 'border-slate-700/50'"
              class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-slate-700/20 transition"
            >
              <div class="text-4xl mb-2">📸</div>
              <p class="text-slate-400 mb-2">Clique para fazer upload ou arraste as fotos</p>
              <p class="text-xs text-slate-500">Máximo 5 imagens, 5MB cada. Formatos: JPG, PNG, WebP</p>
              <input
                ref="imageInput"
                type="file"
                multiple
                accept="image/*"
                @change="handleImageSelect"
                class="hidden"
              />
              <button
                type="button"
                @click="$refs.imageInput.click()"
                class="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium"
              >
                Selecionar Imagens
              </button>
            </div>
            
            <p v-if="imageError" class="text-red-500 text-sm mt-2">{{ imageError }}</p>
          </div>

          <!-- Submit -->
          <div class="flex gap-4">
            <button
              type="button"
              @click="selectedRestaurantId = null"
              class="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
            >
              Voltar
            </button>
            <button
              type="submit"
              :disabled="reviewStore.isLoading || !form.rating || !form.title || !form.text"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-orange-500/50 transition disabled:opacity-50"
            >
              <span v-if="!reviewStore.isLoading">✓ Publicar Review</span>
              <span v-else>Publicando...</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRestaurantStore } from '../../../stores/restaurant'
import { useReviewStore } from '../../../stores/review'
import { useAuthStore } from '../../../stores/auth'
import { useGamificationStore } from '../../../stores/gamification'

const router = useRouter()
const route = useRoute()
const restaurantStore = useRestaurantStore()
const reviewStore = useReviewStore()
const authStore = useAuthStore()
const gamificationStore = useGamificationStore()

const selectedRestaurantId = ref(route.params.restaurantId ? parseInt(route.params.restaurantId) : null)
const imageInput = ref(null)
const isDragging = ref(false)
const imageError = ref('')
const uploadProgress = ref({})

const form = ref({
  rating: 0,
  title: '',
  text: '',
  dishes: [],
  images: []
})

const selectRestaurant = (restaurantId) => {
  selectedRestaurantId.value = restaurantId
}

const validateImage = (file) => {
  // Validar tipo
  if (!file.type.startsWith('image/')) {
    throw new Error('Por favor, selecione apenas imagens')
  }

  // Validar tamanho (5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('Imagem muito grande! Máximo 5MB')
  }

  return true
}

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      resolve(reader.result)
    }
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo'))
    }
    
    reader.readAsDataURL(file)
  })
}

const handleImageSelect = async (event) => {
  const files = event.target.files
  if (!files) return
  
  imageError.value = ''
  await processImages(Array.from(files))
}

const handleDrop = async (event) => {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (!files) return
  
  imageError.value = ''
  await processImages(Array.from(files))
}

const processImages = async (files) => {
  try {
    // Validar limite de imagens
    if (form.value.images.length + files.length > 5) {
      imageError.value = `Máximo 5 imagens! Você tem ${form.value.images.length} e tentou adicionar ${files.length}`
      return
    }

    for (const file of files) {
      try {
        validateImage(file)
        
        // Converter para base64
        const base64 = await convertToBase64(file)
        form.value.images.push(base64)
        
        // Simular progresso
        uploadProgress.value[form.value.images.length - 1] = 100
        setTimeout(() => {
          delete uploadProgress.value[form.value.images.length - 1]
        }, 500)
      } catch (error) {
        imageError.value = error.message
        return
      }
    }
  } catch (error) {
    imageError.value = 'Erro ao processar imagens'
  }
}

const submitReview = async () => {
  if (!form.value.rating || !form.value.title || !form.value.text) {
    alert('Por favor, preencha todos os campos obrigatórios')
    return
  }

  try {
    reviewStore.isLoading = true
    
    const newReview = await reviewStore.createReview({
      restaurantId: selectedRestaurantId.value,
      userId: authStore.user?.id,
      rating: form.value.rating,
      title: form.value.title,
      text: form.value.text,
      dishes: form.value.dishes.filter(d => d && d.trim()),
      images: form.value.images
    })

    if (!newReview) {
      alert(reviewStore.error || 'Erro ao criar review')
      return
    }

    // Add XP and check for badges
    if (gamificationStore.addReview) {
      gamificationStore.addReview()
    }

    router.push({
      name: 'RestaurantDetail',
      params: { id: selectedRestaurantId.value }
    })
  } catch (error) {
    console.error('Erro ao criar review:', error)
    alert('Erro ao salvar review. Tente novamente.')
  } finally {
    reviewStore.isLoading = false
  }
}

onMounted(async () => {
  if (restaurantStore.restaurants.length === 0) {
    await restaurantStore.fetchRestaurants()
  }
})
</script>
