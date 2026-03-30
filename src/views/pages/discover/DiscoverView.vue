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
      <!-- Title -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Descubra Restaurantes</h1>
        <p class="text-slate-400">Explore os melhores estabelecimentos da sua região</p>
      </div>

      <!-- Search & Filters -->
      <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6">
        <div class="flex flex-col gap-4">
          <!-- Search Bar -->
          <div class="flex gap-3">
            <div class="flex-1 flex items-center bg-slate-900 border border-slate-700/50 rounded-lg px-4 py-3">
              <span class="text-slate-400">🔍</span>
              <input
                v-model="restaurantStore.filters.search"
                type="search"
                placeholder="Buscar restaurante ou culinária..."
                class="bg-transparent border-none ml-2 w-full text-white placeholder-slate-500 outline-none"
              />
            </div>
            <button class="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition">
              ⚙️ Filtros
            </button>
          </div>

          <!-- Cuisine Filter -->
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="cuisine in cuisines"
              :key="cuisine"
              @click="toggleFilter('cuisine', cuisine)"
              :class="[
                'px-4 py-2 rounded-lg text-sm transition font-medium',
                restaurantStore.filters.cuisine.includes(cuisine)
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/50'
              ]"
            >
              {{ cuisine }}
            </button>
          </div>
        </div>
      </div>

      <!-- Restaurants Grid -->
      <div v-if="restaurantStore.isLoading" class="text-center py-12">
        <div class="animate-spin text-4xl mb-4">⏳</div>
        <p class="text-slate-400">Carregando restaurantes...</p>
      </div>

      <div v-else-if="restaurantStore.filteredRestaurants.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="restaurant in restaurantStore.filteredRestaurants"
          :key="restaurant.id"
          :to="`/restaurant/${restaurant.id}`"
          class="group overflow-hidden rounded-lg hover:shadow-xl hover:shadow-orange-500/20 transition cursor-pointer"
        >
          <!-- Card Container -->
          <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 overflow-hidden rounded-lg">
            <!-- Image -->
            <div class="overflow-hidden h-48">
              <img
                :src="restaurant.image"
                :alt="restaurant.name"
                class="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>

            <!-- Content -->
            <div class="p-6">
              <h3 class="font-bold text-lg mb-3 line-clamp-1 text-white group-hover:text-orange-400 transition">
                {{ restaurant.name }}
              </h3>

              <!-- Rating & Reviews - Improved -->
              <div class="flex items-center gap-4 mb-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                <!-- Rating Stars -->
                <div class="flex items-center gap-2">
                  <div class="flex gap-0.5">
                    <span
                      v-for="i in 5"
                      :key="i"
                      class="text-lg"
                      :class="i <= Math.round(restaurant.rating) ? 'text-yellow-400' : 'text-slate-600'"
                    >
                      ⭐
                    </span>
                  </div>
                  <span class="font-bold text-white text-sm ml-1">{{ restaurant.rating.toFixed(1) }}</span>
                </div>

                <!-- Reviews Count -->
                <div class="flex items-center gap-1 ml-auto">
                  <span class="text-orange-400 font-bold">📝</span>
                  <span class="font-semibold text-white">{{ restaurant.reviewsCount }}</span>
                  <span class="text-xs text-slate-400">
                    {{ restaurant.reviewsCount === 1 ? 'review' : 'reviews' }}
                  </span>
                </div>
              </div>

              <!-- Cuisines -->
              <div class="flex gap-2 flex-wrap mb-4">
                <span
                  v-for="cuisine in restaurant.cuisine"
                  :key="cuisine"
                  class="text-xs px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full"
                >
                  {{ cuisine }}
                </span>
              </div>

              <!-- Price & Tags -->
              <div class="flex items-center justify-between text-sm text-slate-400">
                <span class="font-medium">{{ restaurant.priceRange }}</span>
                <span class="text-xs">{{ restaurant.location?.city || 'Local' }}</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-12 text-center">
        <div class="text-5xl mb-4">🍽️</div>
        <h3 class="font-bold text-xl mb-2 text-white">Nenhum restaurante encontrado</h3>
        <p class="text-slate-400">
          Tente ajustar seus filtros ou busque por outro termo
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRestaurantStore } from '../../../stores/restaurant'

const restaurantStore = useRestaurantStore()

const cuisines = ['Italiana', 'Japonesa', 'Francesa', 'Brasileira', 'Mexicana', 'Asiática']

onMounted(async () => {
  await restaurantStore.fetchRestaurants()
})

const toggleFilter = (filterType, value) => {
  const currentFilter = restaurantStore.filters[filterType]
  const index = currentFilter.indexOf(value)

  if (index === -1) {
    currentFilter.push(value)
  } else {
    currentFilter.splice(index, 1)
  }
}
</script>
