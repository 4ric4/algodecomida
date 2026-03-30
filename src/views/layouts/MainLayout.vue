<template>
  <div class="flex flex-col min-h-screen bg-background">
    <!-- Header -->
    <header class="glass sticky top-0 z-40 backdrop-blur-sm">
      <nav class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <router-link to="/" class="font-display font-bold text-2xl text-primary">
          🍽️ GastroLog
        </router-link>

        <div class="flex items-center gap-6">
          <!-- Search -->
          <div class="hidden md:flex items-center bg-surface-container-low rounded-roundedness-full px-4 py-2 w-64">
            <span class="material-symbols-outlined text-on-surface-variant">search</span>
            <input
              type="search"
              placeholder="Buscar restaurantes..."
              class="input-field bg-transparent border-none ml-2 w-full text-sm"
              @input="handleSearch"
            />
          </div>

          <div class="flex items-center gap-4">
            <!-- Notifications -->
            <router-link
              to="/notifications"
              class="p-2 hover:bg-surface-container-low rounded-roundedness-md transition relative"
            >
              <span class="material-symbols-outlined">notifications</span>
              <span
                v-if="unreadNotifications > 0"
                class="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"
              ></span>
            </router-link>

            <!-- Profile Menu -->
            <div class="relative" data-profile-menu>
              <button 
                @click.stop="isProfileMenuOpen = !isProfileMenuOpen"
                class="flex items-center gap-2 hover:bg-surface-container-low p-2 rounded-roundedness-md transition"
              >
                <img
                  :src="authStore.user?.avatar"
                  :alt="authStore.user?.username"
                  class="w-8 h-8 rounded-full"
                />
                <span class="material-symbols-outlined">expand_more</span>
              </button>

              <!-- Dropdown -->
              <div 
                v-if="isProfileMenuOpen" 
                class="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-roundedness-lg shadow-lg z-50"
              >
                <router-link
                  :to="`/profile/${authStore.user?.username}`"
                  class="block px-4 py-3 hover:bg-surface-container text-sm transition"
                  @click="isProfileMenuOpen = false"
                >
                  Meu Perfil
                </router-link>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-3 hover:bg-surface-container text-sm text-error transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <div class="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-8">
      <!-- Sidebar Navigation -->
      <nav class="hidden md:flex flex-col gap-2 h-fit sticky top-20">
        <router-link
          to="/"
          class="nav-link group"
          :class="{ 'active': route.name === 'Home' }"
        >
          <span class="material-symbols-outlined">home</span>
          <span>Home</span>
        </router-link>

        <router-link
          to="/discover"
          class="nav-link group"
          :class="{ 'active': route.name === 'Discover' }"
        >
          <span class="material-symbols-outlined">explore</span>
          <span>Descobrir</span>
        </router-link>

        <router-link
          to="/feed"
          class="nav-link group"
          :class="{ 'active': route.name === 'Feed' }"
        >
          <span class="material-symbols-outlined">feed</span>
          <span>Feed</span>
        </router-link>

        <router-link
          :to="`/profile/${authStore.user?.username}`"
          class="nav-link group"
          :class="{ 'active': route.name === 'Profile' }"
        >
          <span class="material-symbols-outlined">account_circle</span>
          <span>Perfil</span>
        </router-link>

        <button
          @click="showCreateReviewModal = true"
          class="btn-primary w-full mt-4 flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined">add</span>
          <span>Nova Review</span>
        </button>
      </nav>

      <!-- Main Content Area -->
      <main class="md:col-span-2">
        <router-view />
      </main>

      <!-- Right Sidebar - Trending & Stats -->
      <aside class="hidden lg:flex flex-col gap-6 h-fit sticky top-20">
        <!-- Trending Section -->
        <section class="card p-6">
          <h3 class="font-display font-bold text-lg mb-4">Tendências</h3>
          <div class="space-y-3">
            <div
              v-for="trend in trendingTopics"
              :key="trend.id"
              class="p-3 bg-surface-container-low rounded-roundedness-md hover:bg-surface-container cursor-pointer transition"
            >
              <div class="font-semibold text-sm">{{ trend.name }}</div>
              <div class="text-xs text-on-surface-variant">{{ trend.posts }} posts</div>
            </div>
          </div>
        </section>

        <!-- Your Stats -->
        <section class="card p-6">
          <h3 class="font-display font-bold text-lg mb-4">Suas Estatísticas</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Reviews</span>
              <span class="font-semibold">{{ gamificationStore.userStats.totalReviews }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Curtidas</span>
              <span class="font-semibold">{{ gamificationStore.userStats.totalLikes }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Seguidores</span>
              <span class="font-semibold">{{ authStore.user?.followers }}</span>
            </div>
            <div class="flex justify-between pt-3 border-t border-outline-variant">
              <span class="text-on-surface-variant">Level</span>
              <span class="font-bold text-primary">{{ gamificationStore.currentLevel.name }}</span>
            </div>
          </div>
        </section>
      </aside>
    </div>

    <!-- Mobile Bottom Navigation -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-surface-container glass backdrop-blur-sm">
      <div class="flex justify-around items-center h-16">
        <router-link to="/" class="flex flex-col items-center gap-1 py-2 text-xs">
          <span class="material-symbols-outlined text-lg">home</span>
          <span>Home</span>
        </router-link>
        <router-link to="/discover" class="flex flex-col items-center gap-1 py-2 text-xs">
          <span class="material-symbols-outlined text-lg">explore</span>
          <span>Descobrir</span>
        </router-link>
        <router-link to="/feed" class="flex flex-col items-center gap-1 py-2 text-xs">
          <span class="material-symbols-outlined text-lg">feed</span>
          <span>Feed</span>
        </router-link>
        <button
          @click="showCreateReviewModal = true"
          class="flex flex-col items-center gap-1 py-2 text-xs text-primary"
        >
          <span class="material-symbols-outlined text-lg">add_circle</span>
          <span>Criar</span>
        </button>
        <router-link :to="`/profile/${authStore.user?.username}`" class="flex flex-col items-center gap-1 py-2 text-xs">
          <span class="material-symbols-outlined text-lg">account_circle</span>
          <span>Perfil</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useGamificationStore } from '../../stores/gamification'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const gamificationStore = useGamificationStore()

const showCreateReviewModal = ref(false)
const unreadNotifications = ref(3)
const isProfileMenuOpen = ref(false)

const trendingTopics = [
  { id: 1, name: 'Cozinha Italiana', posts: 3592 },
  { id: 2, name: 'Cozinha Italiana', posts: 3891 },
  { id: 3, name: 'Cozinha Italiana', posts: 9838 },
  { id: 4, name: 'Cozinha Italiana', posts: 3082 },
  { id: 5, name: 'Cozinha Italiana', posts: 9643 }
]

// Fechar dropdown ao clicar fora
const handleClickOutside = (e) => {
  const profileMenu = document.querySelector('[data-profile-menu]')
  if (profileMenu && !profileMenu.contains(e.target)) {
    isProfileMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleSearch = (e) => {
  const query = e.target.value
  // Implementar busca
}

const handleLogout = () => {
  isProfileMenuOpen.value = false
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.nav-link {
  @apply flex items-center gap-3 px-4 py-3 rounded-roundedness-md transition text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface;
}

.nav-link.active {
  @apply bg-primary-fixed text-on-primary font-semibold;
}
</style>
