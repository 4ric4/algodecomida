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
            <div class="h-6 w-px bg-slate-700"></div>
            <button 
              v-if="authStore.isAuthenticated"
              @click="handleLogout"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
            >
              🚪 Sair
            </button>
            <router-link 
              v-else
              to="/login"
              class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition"
            >
              🔓 Entrar
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <!-- Profile Header -->
      <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg overflow-hidden">
        <!-- Cover Image -->
        <div class="h-40 bg-gradient-to-r from-orange-600/20 to-red-600/20"></div>

        <!-- Profile Info -->
        <div class="px-8 pb-8">
          <div class="flex flex-col md:flex-row gap-6 md:items-end -mt-20 mb-6">
            <!-- Avatar -->
            <div class="relative">
              <img
                :src="userProfile?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userProfile?.username"
                :alt="userProfile?.username"
                class="w-32 h-32 rounded-lg border-4 border-slate-900 object-cover"
              />
              <div v-if="isOwnProfile" class="absolute bottom-0 right-0 bg-orange-600 rounded-full p-2 cursor-pointer hover:bg-orange-700 transition">
                <span class="text-white text-lg">📷</span>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1">
              <h1 class="text-3xl font-bold text-white mb-1">{{ userProfile?.fullName }}</h1>
              <p class="text-slate-400 mb-4 text-lg">@{{ userProfile?.username }}</p>
              <p v-if="userProfile?.bio" class="text-lg text-slate-300 mb-4">{{ userProfile?.bio }}</p>

              <!-- Stats Buttons (Instagram Style) -->
              <div class="flex gap-8 mb-6">
                <button @click="openFollowersModal" class="hover:opacity-80 transition cursor-pointer">
                  <div class="font-bold text-xl text-white">{{ userProfile?.followers || 0 }}</div>
                  <div class="text-sm text-slate-400">Seguidores</div>
                </button>
                <button @click="openFollowingModal" class="hover:opacity-80 transition cursor-pointer">
                  <div class="font-bold text-xl text-white">{{ userProfile?.following || 0 }}</div>
                  <div class="text-sm text-slate-400">Seguindo</div>
                </button>
                <div>
                  <div class="font-bold text-xl text-white">{{ userProfile?.reviewsCount || 0 }}</div>
                  <div class="text-sm text-slate-400">Reviews</div>
                </div>
              </div>

              <!-- Buttons -->
              <div class="flex gap-3">
                <button 
                  v-if="isOwnProfile" 
                  @click="showEditModal = true"
                  class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition flex items-center gap-2"
                >
                  ✏️ Editar Perfil
                </button>
                <button 
                  v-if="isOwnProfile && userProfile?.admin === 1"
                  @click="showCreateRestaurantModal = true"
                  class="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition flex items-center gap-2"
                >
                  🏪 Novo Restaurante
                </button>
                <button 
                  v-else-if="!isOwnProfile"
                  @click="handleFollowClick"
                  :class="[
                    'px-6 py-2 text-white rounded-lg font-semibold transition flex items-center gap-2',
                    isFollowing 
                      ? 'bg-slate-600 hover:bg-slate-700' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  ]"
                >
                  {{ isFollowing ? '✅ Seguindo' : '➕ Seguir' }}
                </button>
              </div>
            </div>

            <!-- Level Badge or Admin Badge -->
            <div v-if="userProfile?.admin === 1" class="text-center">
              <div class="text-6xl mb-2">👑</div>
              <div class="font-bold text-yellow-400 text-xl">ADM</div>
            </div>
            <div v-else class="text-center">
              <div class="text-6xl mb-2">{{ getLevelEmoji(userProfile?.level) }}</div>
              <div class="font-bold text-orange-400">{{ getCurrentLevelName() }}</div>
              <div class="text-sm text-slate-400">Level {{ userProfile?.level }}</div>
            </div>
          </div>

          <!-- Badges -->
          <div v-if="userBadges && userBadges.length > 0" class="flex gap-3 flex-wrap">
            <div
              v-for="badge in userBadges"
              :key="badge.id"
              class="px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full text-sm font-semibold flex items-center gap-2"
            >
              <span>🏆</span>
              <span>{{ badge.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg">
        <div class="flex border-b border-slate-700/50 flex-wrap">
          <button
            v-if="isOwnProfile"
            @click="currentTab = 'myreviews'"
            :class="[
              'flex-1 py-4 px-6 font-semibold transition border-b-2 min-w-max',
              currentTab === 'myreviews'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-white'
            ]"
          >
            📝 Meus Reviews
          </button>
          <button
            v-if="isOwnProfile && userProfile?.admin === 1"
            @click="currentTab = 'restaurants'"
            :class="[
              'flex-1 py-4 px-6 font-semibold transition border-b-2 min-w-max',
              currentTab === 'restaurants'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-white'
            ]"
          >
            🏪 Meus Restaurantes
          </button>
          <button
            v-if="isOwnProfile"
            @click="currentTab = 'following'"
            :class="[
              'flex-1 py-4 px-6 font-semibold transition border-b-2 min-w-max',
              currentTab === 'following'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-white'
            ]"
          >
            Feed (Seguindo)
          </button>
          <button
            @click="currentTab = 'stats'"
            v-if="isOwnProfile"
            :class="[
              'flex-1 py-4 px-6 font-semibold transition border-b-2 min-w-max',
              currentTab === 'stats'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-white'
            ]"
          >
            📊 Estatísticas
          </button>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- My Reviews Tab -->
          <div v-if="currentTab === 'myreviews'" class="space-y-6">
            <router-link v-if="isOwnProfile" to="/review/new" class="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium">
              ✍️ Criar Nova Review
            </router-link>
            
            <div v-if="userReviews && userReviews.length > 0">
              <ReviewCard
                v-for="review in userReviews"
                :key="review.id"
                :review="review"
                @like="handleLike"
                @toggle-like="handleToggleLike"
              />
            </div>
            <div v-else class="text-center py-12 text-slate-400">
              <p class="text-lg">
                {{ isOwnProfile ? 'Você ainda não fez nenhuma review 😋' : 'Este usuário não tem reviews 😋' }}
              </p>
              <router-link v-if="isOwnProfile" to="/review/new" class="text-orange-400 hover:text-orange-300 font-medium mt-2 inline-block">
                Comece agora!
              </router-link>
            </div>
          </div>

          <!-- Following Feed Tab -->
          <div v-if="currentTab === 'following'" class="space-y-6">
            <div v-if="reviewStore.followingReviews && reviewStore.followingReviews.length > 0">
              <ReviewCard
                v-for="review in reviewStore.followingReviews"
                :key="review.id"
                :review="review"
                @like="handleLike"
                @toggle-like="handleToggleLike"
              />
            </div>
            <div v-else class="text-center py-12 text-slate-400">
              <p class="text-lg">Nenhum review da galera que você segue 😋</p>
            </div>
          </div>

          <!-- Restaurants Tab (Admin Only) -->
          <div v-if="currentTab === 'restaurants'" class="space-y-6">
            <button
              @click="showCreateRestaurantModal = true"
              class="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              ➕ Novo Restaurante
            </button>
            
            <div v-if="userRestaurants && userRestaurants.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="restaurant in userRestaurants"
                :key="restaurant.id"
                class="p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg hover:border-orange-500/50 transition cursor-pointer"
                @click="selectedRestaurant = restaurant"
              >
                <div v-if="restaurant.image" class="mb-4 rounded-lg overflow-hidden h-40 bg-slate-800">
                  <img :src="restaurant.image" :alt="restaurant.name" class="w-full h-full object-cover">
                </div>
                <h3 class="text-lg font-bold text-white mb-2">{{ restaurant.name }}</h3>
                <p class="text-slate-400 text-sm mb-3">{{ restaurant.description }}</p>
                <div class="flex items-center gap-2 text-slate-400 text-sm mb-3">
                  <span>📍 {{ restaurant.location }}</span>
                </div>
                <div class="flex gap-2">
                  <button
                    @click.stop="editRestaurant(restaurant)"
                    class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold transition"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    @click.stop="deleteRestaurant(restaurant.id)"
                    class="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-semibold transition"
                  >
                    🗑️ Deletar
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12 text-slate-400">
              <p class="text-lg">Nenhum restaurante criado ainda 🏪</p>
              <p class="text-sm mt-2">Clique no botão acima para criar o seu primeiro!</p>
            </div>
          </div>

          <!-- Stats Tab -->
          <div v-if="currentTab === 'stats' && isOwnProfile" class="space-y-6">
            <!-- XP Progress -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="font-semibold text-white">Progresso para o próximo nível</span>
                <span class="text-sm text-slate-400">{{ xpProgress }}%</span>
              </div>
              <div class="w-full bg-slate-900 rounded-full h-3 overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                  :style="{ width: xpProgress + '%' }"
                ></div>
              </div>
            </div>

            <!-- Badges Grid -->
            <div>
              <h3 class="font-semibold mb-4 text-white">Badges Desbloqueados</h3>
              <div v-if="userBadges && userBadges.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  v-for="badge in userBadges"
                  :key="badge.id"
                  class="p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg text-center"
                >
                  <div class="text-3xl mb-2">🏆</div>
                  <div class="font-semibold text-sm text-white">{{ badge.name }}</div>
                  <div class="text-xs text-slate-400">{{ badge.description }}</div>
                </div>
              </div>
              <div v-else class="text-center text-slate-400">
                <p>Nenhuma badge desbloqueada ainda</p>
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg">
                <div class="text-3xl font-bold text-orange-400 mb-2">{{ totalReviewsCount }}</div>
                <div class="text-sm text-slate-400">Total de Reviews</div>
              </div>
              <div class="p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg">
                <div class="text-3xl font-bold text-orange-400 mb-2">{{ totalLikesReceived }}</div>
                <div class="text-sm text-slate-400">Curtidas Recebidas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <EditProfileModal 
      v-if="showEditModal" 
      :user="userProfile"
      @close="showEditModal = false"
      @save="handleProfileUpdate"
    />

    <!-- Create Restaurant Modal -->
    <CreateRestaurantModal
      v-if="showCreateRestaurantModal"
      :restaurant="selectedRestaurant"
      @close="showCreateRestaurantModal = false; selectedRestaurant = null"
      @save="handleRestaurantSave"
    />

    <!-- Followers Modal -->
    <FollowersModal 
      v-if="showFollowersModal"
      :followers="followers"
      :loading="loadingFollowers"
      :user-id="userProfile?.id"
      @close="showFollowersModal = false"
    />

    <!-- Following Modal -->
    <FollowingModal 
      v-if="showFollowingModal"
      :following="following"
      :loading="loadingFollowing"
      @close="showFollowingModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth'
import { useReviewStore } from '../../../stores/review'
import { userService } from '../../../services/user.service'
import { restaurantService } from '../../../services/restaurant.service'
import ReviewCard from '../../components/ReviewCard.vue'
import EditProfileModal from './EditProfileModal.vue'
import FollowersModal from './FollowersModal.vue'
import FollowingModal from './FollowingModal.vue'
import CreateRestaurantModal from './CreateRestaurantModal.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const reviewStore = useReviewStore()

const currentTab = ref('myreviews')
const showEditModal = ref(false)
const showFollowersModal = ref(false)
const showFollowingModal = ref(false)
const showCreateRestaurantModal = ref(false)
const followers = ref([])
const following = ref([])
const loadingFollowers = ref(false)
const loadingFollowing = ref(false)
const userBadges = ref([])
const userRestaurants = ref([])
const selectedRestaurant = ref(null)
const isFollowing = ref(false)

const userProfile = ref(null)

const isOwnProfile = computed(() => {
  const username = route.params.username
  // Se não tem username na rota, é o perfil próprio
  if (!username) return true
  return username === authStore.user?.username
})

const userReviews = computed(() => reviewStore.userReviews)

const totalReviewsCount = computed(() => {
  return reviewStore.userReviews?.length || 0
})

const totalLikesReceived = computed(() => {
  return reviewStore.userReviews?.reduce((sum, review) => sum + (review.likes || 0), 0) || 0
})

const xpProgress = computed(() => {
  if (!userProfile.value) return 0
  const xpPerLevel = 1000
  return Math.min((userProfile.value.xp % xpPerLevel) / xpPerLevel * 100, 100)
})

// Debug: monitorar mudanças no userProfile
watchEffect(() => {
  if (userProfile.value) {
    console.log('=== USER PROFILE DEBUG ===')
    console.log('Full user object:', JSON.stringify(userProfile.value, null, 2))
    console.log('admin field:', userProfile.value.admin)
    console.log('admin === 1:', userProfile.value.admin === 1)
    console.log('========================')
  }
})

const getLevelEmoji = (level) => {
  const emojis = ['🥚', '🐣', '🐤', '🦅', '🦉', '🦚']
  return emojis[Math.min(level - 1, emojis.length - 1)] || '🦚'
}

const getCurrentLevelName = () => {
  const levelNames = ['Iniciante', 'Explorador', 'Crítico', 'Mestre', 'Lenda', 'Ícone']
  const level = userProfile.value?.level || 1
  return levelNames[Math.min(level - 1, levelNames.length - 1)] || 'Ícone'
}

const handleLike = async (reviewId) => {
  await reviewStore.likeReview(reviewId)
}

const handleToggleLike = (data) => {
  const { reviewId, liked } = data
  const review = userReviews.value.find(r => r.id === reviewId) || 
                reviewStore.followingReviews.find(r => r.id === reviewId)
  if (review) {
    review.likes_by_user = liked
    review.likes += liked ? 1 : -1
  }
}

const handleFollowClick = async () => {
  if (isFollowing.value) {
    await userService.unfollowUser(userProfile.value?.id)
  } else {
    await userService.followUser(userProfile.value?.id)
  }
  isFollowing.value = !isFollowing.value
}

const openFollowersModal = async () => {
  loadingFollowers.value = true
  showFollowersModal.value = true
  try {
    const data = await userService.getFollowers(userProfile.value.id)
    followers.value = data
  } catch (err) {
    console.error('Erro ao buscar seguidores:', err)
  } finally {
    loadingFollowers.value = false
  }
}

const openFollowingModal = async () => {
  loadingFollowing.value = true
  showFollowingModal.value = true
  try {
    const data = await userService.getFollowing(userProfile.value.id)
    following.value = data
  } catch (err) {
    console.error('Erro ao buscar seguindo:', err)
  } finally {
    loadingFollowing.value = false
  }
}

const handleProfileUpdate = async (updatedData) => {
  try {
    // Dados que vão ser salvos (username, bio, avatar)
    const safeData = {
      username: updatedData.username,
      bio: updatedData.bio,
      avatar: updatedData.avatar // base64 string será salvo aqui
    }
    
    const success = await authStore.updateProfile(safeData)
    if (success) {
      showEditModal.value = false
    }
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err)
  }
}

const fetchFollowingReviews = async () => {
  try {
    await reviewStore.fetchFollowingReviews()
  } catch (err) {
    console.error('Erro ao buscar reviews:', err)
  }
}

const fetchUserRestaurants = async () => {
  try {
    if (authStore.user?.id) {
      const restaurants = await restaurantService.getAllRestaurants({
        createdBy: authStore.user.id
      })
      userRestaurants.value = restaurants.filter(r => r.createdBy === authStore.user.id)
    }
  } catch (err) {
    console.error('Erro ao buscar restaurantes:', err)
  }
}

const editRestaurant = (restaurant) => {
  selectedRestaurant.value = restaurant
  showCreateRestaurantModal.value = true
}

const deleteRestaurant = async (restaurantId) => {
  if (confirm('Tem certeza que deseja deletar este restaurante?')) {
    try {
      await restaurantService.deleteRestaurant(restaurantId)
      await fetchUserRestaurants()
    } catch (err) {
      console.error('Erro ao deletar restaurante:', err)
      alert(err.error || 'Erro ao deletar restaurante')
    }
  }
}

const handleRestaurantSave = async (restaurant) => {
  await fetchUserRestaurants()
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  const username = route.params.username || authStore.user?.username
  
  if (!username) {
    router.push('/login')
    return
  }

  try {
    // Buscar usuário
    const user = await userService.getUserProfile(username)
    userProfile.value = user

    // Buscar reviews do usuário
    await reviewStore.fetchUserReviews(user.id)

    // Se for o perfil próprio, carregar mais coisas
    if (isOwnProfile.value) {
      await fetchFollowingReviews()
      if (user.admin === 1) {
        await fetchUserRestaurants()
      }
    }

    // Verificar se estou seguindo este usuário
    if (!isOwnProfile.value) {
      try {
        const followData = await userService.checkFollowing(user.id)
        isFollowing.value = followData.following
      } catch (err) {
        isFollowing.value = false
      }
    }
  } catch (err) {
    console.error('Erro ao carregar perfil:', err)
    router.push('/discover')
  }
})

</script>
