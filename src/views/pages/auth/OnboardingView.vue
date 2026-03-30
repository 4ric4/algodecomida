<template>
  <div class="min-h-screen bg-background">
    <!-- Onboarding Steps -->
    <div class="max-w-2xl mx-auto px-4 py-12">
      <!-- Progress -->
      <div class="flex justify-between mb-12">
        <div
          v-for="(step, idx) in steps"
          :key="idx"
          class="flex flex-col items-center flex-1"
        >
          <div
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center font-bold mb-2 transition',
              currentStep > idx
                ? 'bg-primary-fixed text-on-primary'
                : currentStep === idx
                ? 'bg-primary text-on-primary ring-4 ring-primary-container'
                : 'bg-surface-container text-on-surface-variant'
            ]"
          >
            {{ idx + 1 }}
          </div>
          <span class="text-xs text-on-surface-variant text-center">{{ step.title }}</span>
        </div>
      </div>

      <!-- Step Content -->
      <div class="card p-8 mb-8">
        <!-- Step 1: Favorite Cuisines -->
        <div v-if="currentStep === 0">
          <h2 class="font-display font-bold text-2xl mb-2">Quais são suas culinárias favoritas?</h2>
          <p class="text-on-surface-variant mb-6">Isso nos ajuda a recomendar restaurantes que você vai adorar</p>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              v-for="cuisine in cuisines"
              :key="cuisine"
              @click="toggleCuisine(cuisine)"
              :class="[
                'p-4 rounded-roundedness-lg border-2 transition text-center',
                selectedCuisines.includes(cuisine)
                  ? 'bg-primary-container border-primary text-on-primary'
                  : 'bg-surface-container border-outline-variant text-on-surface hover:border-primary'
              ]"
            >
              {{ cuisine }}
            </button>
          </div>
        </div>

        <!-- Step 2: Restaurant Interests -->
        <div v-if="currentStep === 1">
          <h2 class="font-display font-bold text-2xl mb-2">Que tipo de restaurante você procura?</h2>
          <p class="text-on-surface-variant mb-6">Selecione o que mais atrai você</p>

          <div class="space-y-3">
            <label v-for="type in restaurantTypes" :key="type" class="flex items-center gap-3 p-4 cursor-pointer rounded-roundedness-lg hover:bg-surface-container transition">
              <input
                type="checkbox"
                :checked="selectedTypes.includes(type)"
                @change="(e) => e.target.checked ? selectedTypes.push(type) : selectedTypes = selectedTypes.filter(t => t !== type)"
                class="w-5 h-5 rounded"
              />
              <span class="font-medium">{{ type }}</span>
            </label>
          </div>
        </div>

        <!-- Step 3: Social Preferences -->
        <div v-if="currentStep === 2">
          <h2 class="font-display font-bold text-2xl mb-2">Preferências Sociais</h2>
          <p class="text-on-surface-variant mb-6">Como você quer usar o GastroLog?</p>

          <div class="space-y-3">
            <label class="flex items-center gap-3 p-4 cursor-pointer rounded-roundedness-lg hover:bg-surface-container transition">
              <input type="checkbox" checked class="w-5 h-5 rounded" />
              <div>
                <div class="font-medium">Compartilhar minhas reviews</div>
                <div class="text-sm text-on-surface-variant">Deixar a comunidade ver minhas avaliações</div>
              </div>
            </label>

            <label class="flex items-center gap-3 p-4 cursor-pointer rounded-roundedness-lg hover:bg-surface-container transition">
              <input type="checkbox" checked class="w-5 h-5 rounded" />
              <div>
                <div class="font-medium">Receber recomendações personalizadas</div>
                <div class="text-sm text-on-surface-variant">Sugestões baseadas no meu gosto</div>
              </div>
            </label>

            <label class="flex items-center gap-3 p-4 cursor-pointer rounded-roundedness-lg hover:bg-surface-container transition">
              <input type="checkbox" class="w-5 h-5 rounded" />
              <div>
                <div class="font-medium">Permitir notificações push</div>
                <div class="text-sm text-on-surface-variant">Fique atualizado com novidades</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 4: Welcome -->
        <div v-if="currentStep === 3" class="text-center">
          <div class="text-6xl mb-6">🎉</div>
          <h2 class="font-display font-bold text-3xl mb-4">Bem-vindo ao GastroLog!</h2>
          <p class="text-on-surface-variant mb-8">
            Você está pronto para explorar restaurantes incríveis e compartilhar suas experiências culinárias.
          </p>

          <div class="space-y-4">
            <div class="bg-surface-container p-4 rounded-roundedness-lg">
              <div class="text-sm font-medium text-primary mb-2">💡 Dica:</div>
              <p class="text-sm text-on-surface-variant">Comece escrevendo uma review do seu restaurante favorito para ganhar pontos e desbloquear badges!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between gap-4">
        <button
          @click="previousStep"
          v-if="currentStep > 0"
          class="btn-secondary"
        >
          ? Anterior
        </button>
        <div v-else></div>

        <button
          @click="nextStep"
          v-if="currentStep < 3"
          class="btn-primary ml-auto"
        >
          Próximo →
        </button>

        <button
          @click="finishOnboarding"
          v-else
          class="btn-primary ml-auto"
        >
          Começar a Explorar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRecommendationStore } from '../../../stores/recommendation'

const router = useRouter()
const recommendationStore = useRecommendationStore()

const currentStep = ref(0)

const steps = [
  { title: 'Culinárias' },
  { title: 'Restaurantes' },
  { title: 'Preferências' },
  { title: 'Pronto!' }
]

const cuisines = [
  'Italiana', 'Japonesa', 'Francesa', 'Brasileira',
  'Mexicana', 'Tailandesa', 'Indiana', 'Coreana'
]

const restaurantTypes = [
  'Restaurantes casuais',
  'Fine dining',
  'Bistrô/Café',
  'Churrascaria',
  'Delivery'
]

const selectedCuisines = ref([])
const selectedTypes = ref([])

const toggleCuisine = (cuisine) => {
  const idx = selectedCuisines.value.indexOf(cuisine)
  if (idx === -1) {
    selectedCuisines.value.push(cuisine)
  } else {
    selectedCuisines.value.splice(idx, 1)
  }
}

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const finishOnboarding = () => {
  // Salvar preferências no recommendation store
  selectedCuisines.value.forEach(c => {
    recommendationStore.addToFavorites(c)
  })

  router.push({ name: 'Home' })
}
</script>
