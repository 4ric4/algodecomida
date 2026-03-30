<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white">Editar Perfil</h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white transition">
          ✕
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Avatar Upload -->
        <div class="space-y-3">
          <label class="block text-sm font-semibold text-white">Foto de Perfil</label>
          <div class="flex items-center gap-4">
            <img
              :src="preview || user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.username"
              :alt="user?.username"
              class="w-20 h-20 rounded-lg object-cover border-2 border-slate-700"
            />
            <div>
              <input
                type="file"
                ref="fileInput"
                @change="handleFileSelect"
                accept="image/*"
                class="hidden"
              />
              <button
                @click="$refs.fileInput.click()"
                class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition"
              >
                Escolher Foto
              </button>
              <p class="text-xs text-slate-400 mt-2">Máx. 5MB (será salvo na base de dados)</p>
            </div>
          </div>
        </div>

        <!-- Full Name (Read Only) -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-white">Nome Completo</label>
          <input
            :value="user?.fullName"
            type="text"
            disabled
            class="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed opacity-50"
          />
          <p class="text-xs text-slate-500">Não pode ser alterado (será mantido igual)</p>
        </div>

        <!-- Username -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-white">Nome de Usuário</label>
          <input
            v-model="formData.username"
            type="text"
            class="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
            placeholder="Seu nome de usuário"
          />
          <p class="text-xs text-slate-400">Este é o único campo editável além da foto</p>
        </div>

        <!-- Bio -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-white">Bio</label>
          <textarea
            v-model="formData.bio"
            class="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition resize-none"
            placeholder="Conte algo sobre você..."
            rows="4"
          ></textarea>
          <p class="text-xs text-slate-400">{{ formData.bio?.length || 0 }}/150</p>
        </div>

        <!-- Info Box -->
        <div class="p-3 bg-orange-500/20 border border-orange-500/50 rounded-lg">
          <p class="text-sm text-orange-300">
            <strong>ℹ️ Informação:</strong> Apenas o username, bio e foto podem ser editados. 
            Seu nome completo é permanente.
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            @click="$emit('close')"
            class="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
          >
            Cancelar
          </button>
          <button
            @click="handleSave"
            :disabled="isSaving"
            class="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
          >
            {{ isSaving ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
          <p class="text-sm text-green-300">✅ {{ successMessage }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p class="text-sm text-red-300">❌ {{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const fileInput = ref(null)
const preview = ref(null)
const isSaving = ref(false)
const selectedFile = ref(null)
const successMessage = ref('')
const errorMessage = ref('')

const formData = reactive({
  username: props.user?.username || '',
  bio: props.user?.bio || ''
})

watch(() => props.user, (newUser) => {
  formData.username = newUser?.username || ''
  formData.bio = newUser?.bio || ''
  preview.value = null
  successMessage.value = ''
  errorMessage.value = ''
}, { deep: true })

const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  errorMessage.value = ''
  
  if (file) {
    // Validar tamanho
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = '❌ Arquivo muito grande! Máximo 5MB'
      return
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      errorMessage.value = '❌ Arquivo deve ser uma imagem (JPG, PNG, GIF, etc)'
      return
    }

    selectedFile.value = file
    
    // Criar preview
    const reader = new FileReader()
    reader.onload = (e) => {
      preview.value = e.target?.result
    }
    reader.onerror = () => {
      errorMessage.value = '❌ Erro ao ler arquivo'
    }
    reader.readAsDataURL(file)
  }
}

const handleSave = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isSaving.value = true
  
  try {
    const updates = {
      username: formData.username.trim(),
      bio: formData.bio.trim()
    }

    // Se tem arquivo selecionado, converter para base64
    if (selectedFile.value) {
      // Usar Promise para aguardar o FileReader terminar
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target?.result) // base64 string
        }
        reader.onerror = () => {
          reject(new Error('Erro ao ler arquivo'))
        }
        reader.readAsDataURL(selectedFile.value)
      })
      
      updates.avatar = base64String
    }
    
    // Emitir após preparar todos os dados
    emit('save', updates)
    successMessage.value = '✅ Alterações salvas com sucesso!'
    
    // Resetar isSaving após emitir
    isSaving.value = false
    
    // Fechar modal após 1 segundo
    setTimeout(() => {
      emit('close')
    }, 1000)
  } catch (err) {
    errorMessage.value = '❌ Erro ao salvar: ' + (err.message || 'Desconhecido')
    isSaving.value = false
  }
}
</script>
