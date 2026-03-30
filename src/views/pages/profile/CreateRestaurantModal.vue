<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 px-6 py-4 border-b border-slate-700 bg-slate-800/95 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-white">
          {{ restaurant?.id ? '✏️ Editar Restaurante' : '🏪 Novo Restaurante' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-white text-2xl transition"
        >
          ✕
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Name -->
        <div>
          <label class="block text-white font-semibold mb-2">Nome do Restaurante *</label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="Ex: Pizzaria da Nonna"
            class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
            required
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-white font-semibold mb-2">Descrição</label>
          <textarea
            v-model="formData.description"
            placeholder="Descreva o restaurante..."
            rows="4"
            class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
          ></textarea>
        </div>

        <!-- Location -->
        <div>
          <label class="block text-white font-semibold mb-2">Endereço *</label>
          <input
            v-model="formData.location"
            type="text"
            placeholder="Ex: Rua das Flores, 123 - São Paulo, SP"
            class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
            required
          />
        </div>

        <!-- Cuisine -->
        <div>
          <label class="block text-white font-semibold mb-2">Tipo de Cozinha</label>
          <input
            v-model="formData.cuisine"
            type="text"
            placeholder="Ex: Italiana, Japonesa, Brasileira"
            class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
          />
        </div>

        <!-- Price Range -->
        <div>
          <label class="block text-white font-semibold mb-2">Faixa de Preço</label>
          <select
            v-model="formData.priceRange"
            class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none transition"
          >
            <option value="">Selecione...</option>
            <option value="$">$ - Barato</option>
            <option value="$$">$$ - Médio</option>
            <option value="$$$">$$$ - Caro</option>
            <option value="$$$$">$$$$ - Muito Caro</option>
          </select>
        </div>

        <!-- Image Upload or URL -->
        <div>
          <label class="block text-white font-semibold mb-2">Imagem do Restaurante</label>
          
          <!-- File Upload -->
          <div class="mb-4">
            <div class="flex items-center gap-2 mb-2">
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="hidden"
              />
              <button
                type="button"
                @click="$refs.imageInput.click()"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center gap-2"
              >
                📁 Selecionar Imagem do PC
              </button>
              <span v-if="imageFileName" class="text-slate-300 text-sm">{{ imageFileName }}</span>
            </div>
            <div v-if="uploadProgress > 0 && uploadProgress < 100" class="text-sm text-slate-400">
              Convertendo... {{ uploadProgress }}%
            </div>
          </div>

          <!-- Or URL -->
          <div class="border-t border-slate-700 pt-4">
            <label class="block text-slate-400 font-semibold mb-2 text-sm">Ou use uma URL:</label>
            <input
              v-model="formData.image"
              type="url"
              placeholder="https://..."
              class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
            />
          </div>

          <!-- Image Preview -->
          <div v-if="formData.image" class="mt-4 rounded-lg overflow-hidden h-40 bg-slate-900 border border-slate-700">
            <img :src="formData.image" :alt="formData.name" class="w-full h-full object-cover">
          </div>
        </div>

        <!-- Hours -->
        <div>
          <label class="block text-white font-semibold mb-2">Horário de Funcionamento</label>
          <input
            v-model="formData.hours"
            type="text"
            placeholder="Ex: 11:00 - 23:00"
            class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
          />
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-white font-semibold mb-2">Tags</label>
          <input
            v-model="formData.tags"
            type="text"
            placeholder="Ex: delivery, wifi, pets (separadas por vírgula)"
            class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
          />
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {{ loading ? '⏳ Salvando...' : (restaurant?.id ? '💾 Atualizar' : '✅ Criar') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '../../../stores/auth'
import { restaurantService } from '../../../services/restaurant.service'

const props = defineProps({
  restaurant: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])
const authStore = useAuthStore()
const loading = ref(false)
const imageInput = ref(null)
const imageFileName = ref('')
const uploadProgress = ref(0)

const formData = ref({
  name: '',
  description: '',
  location: '',
  cuisine: '',
  priceRange: '',
  image: '',
  hours: '',
  tags: ''
})

watch(() => props.restaurant, (newRestaurant) => {
  if (newRestaurant) {
    formData.value = {
      name: newRestaurant.name || '',
      description: newRestaurant.description || '',
      location: newRestaurant.location || '',
      cuisine: Array.isArray(newRestaurant.cuisine) ? newRestaurant.cuisine.join(', ') : (newRestaurant.cuisine || ''),
      priceRange: newRestaurant.priceRange || '',
      image: newRestaurant.image || '',
      hours: newRestaurant.hours || '',
      tags: Array.isArray(newRestaurant.tags) ? newRestaurant.tags.join(', ') : ''
    }
  } else {
    formData.value = {
      name: '',
      description: '',
      location: '',
      cuisine: '',
      priceRange: '',
      image: '',
      hours: '',
      tags: ''
    }
  }
}, { immediate: true })

const handleImageUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validar tipo de arquivo
  if (!file.type.startsWith('image/')) {
    alert('Por favor, selecione um arquivo de imagem válido')
    return
  }

  // Validar tamanho (máximo 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    alert('Imagem muito grande! Máximo 5MB')
    return
  }

  imageFileName.value = file.name
  uploadProgress.value = 0

  try {
    // Simular progresso de upload
    const reader = new FileReader()
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        uploadProgress.value = Math.round((event.loaded / event.total) * 100)
      }
    }

    reader.onload = () => {
      uploadProgress.value = 100
      // reader.result é a string base64
      formData.value.image = reader.result
      
      // Resetar progress após um tempo
      setTimeout(() => {
        uploadProgress.value = 0
      }, 500)
    }

    reader.onerror = () => {
      alert('Erro ao ler o arquivo')
      imageFileName.value = ''
    }

    reader.readAsDataURL(file)
  } catch (err) {
    console.error('Erro ao converter imagem:', err)
    alert('Erro ao processar imagem')
    imageFileName.value = ''
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const payload = {
      name: formData.value.name,
      description: formData.value.description,
      location: formData.value.location,
      cuisine: formData.value.cuisine 
        ? formData.value.cuisine.split(',').map(c => c.trim()).filter(c => c)
        : [],
      priceRange: formData.value.priceRange,
      image: formData.value.image,
      hours: formData.value.hours,
      tags: formData.value.tags.split(',').map(t => t.trim()).filter(t => t)
    }

    let result
    if (props.restaurant?.id) {
      result = await restaurantService.updateRestaurant(props.restaurant.id, payload)
    } else {
      result = await restaurantService.createRestaurant(payload)
    }

    emit('save', result)
    emit('close')
  } catch (err) {
    console.error('Erro ao criar/editar restaurante:', err)
    alert(err.error || 'Erro ao salvar restaurante')
  } finally {
    loading.value = false
  }
}
</script>
