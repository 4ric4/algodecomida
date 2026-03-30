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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header Section -->
      <div class="mb-16">
        <p class="text-slate-400 text-sm mb-4">
          Abaixo estão algumas críticas e listas populares desta semana.
          <router-link to="/auth/register" class="text-orange-400 hover:text-orange-300 font-medium transition">
            Crie a sua
          </router-link>
        </p>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Left Column - Popular Reviews -->
        <div class="lg:col-span-2">
          <div class="mb-8">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-white">CRÍTICAS POPULARES DESTA SEMANA</h2>
              <router-link to="#" class="text-orange-400 hover:text-orange-300 text-sm font-semibold transition">
                MAIS
              </router-link>
            </div>

            <!-- Reviews Container -->
            <div class="space-y-6">
              <!-- Review Card 1 -->
              <div
                v-for="review in popularReviews"
                :key="review.id"
                class="flex gap-6 pb-6 border-b border-slate-700/50 hover:bg-slate-800/30 p-4 rounded-lg transition cursor-pointer group"
                @click="navigateTo(`/restaurants/${review.restaurantId}`)"
              >
                <!-- Restaurant Image -->
                <div class="flex-shrink-0">
                  <img
                    :src="review.image"
                    :alt="review.restaurantName"
                    class="w-24 h-24 object-cover rounded-lg group-hover:ring-2 ring-orange-500 transition"
                  />
                </div>

                <!-- Review Content -->
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-white mb-1">{{ review.restaurantName }}</h3>
                  <p class="text-slate-400 text-sm mb-3">
                    <span class="text-orange-400 font-semibold">{{ review.username }}</span>
                    <span class="ml-2">
                      <span v-for="n in review.rating" :key="n" class="text-yellow-400">★</span>
                      <span v-for="n in (5 - review.rating)" :key="'e' + n" class="text-slate-600">★</span>
                    </span>
                    <span v-if="review.favorite" class="ml-2 text-red-500">❤️</span>
                  </p>
                  <p class="text-slate-300 text-sm mb-3">{{ review.type }}</p>
                  <p class="text-slate-400 text-sm leading-relaxed">{{ review.text }}</p>
                  <div class="mt-3 flex items-center gap-6">
                    <button
                      class="flex items-center gap-2 text-slate-400 hover:text-red-500 transition text-sm"
                      @click.stop="toggleLike(review.id)"
                    >
                      <span v-if="review.liked">❤️</span>
                      <span v-else>🤍</span>
                      {{ review.likes }} likes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Popular Lists & Reviewers -->
        <div class="space-y-12">
          <!-- Popular Lists -->
          <div>
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-bold text-white">LISTAS POPULARES</h2>
              <router-link to="#" class="text-orange-400 hover:text-orange-300 text-sm font-semibold transition">
                MAIS
              </router-link>
            </div>

            <div class="space-y-4">
              <div
                v-for="list in popularLists"
                :key="list.id"
                class="group cursor-pointer"
                @click="navigateTo(`/lists/${list.id}`)"
              >
                <!-- List Cover Images -->
                <div class="grid grid-cols-4 gap-1 mb-3 rounded-lg overflow-hidden">
                  <img
                    v-for="(img, idx) in list.covers.slice(0, 4)"
                    :key="idx"
                    :src="img"
                    :alt="list.title"
                    class="w-full aspect-square object-cover group-hover:brightness-125 transition"
                  />
                </div>

                <h3 class="font-bold text-white text-sm mb-1 group-hover:text-orange-400 transition">
                  {{ list.title }}
                </h3>
                <p class="text-slate-400 text-xs">
                  <span v-if="list.author">{{ list.author }}</span>
                  <span v-if="list.author && list.count"> • </span>
                  <span v-if="list.count">{{ list.count }} restaurantes</span>
                </p>
                <p class="text-slate-500 text-xs mt-1">
                  ❤️ {{ list.likes }} • 💬 {{ list.comments }}
                </p>
              </div>
            </div>
          </div>

          <!-- Popular Reviewers -->
          <div>
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-bold text-white">CRÍTICOS POPULARES</h2>
              <router-link to="#" class="text-orange-400 hover:text-orange-300 text-sm font-semibold transition">
                MAIS
              </router-link>
            </div>

            <div class="space-y-4">
              <div
                v-for="reviewer in popularReviewers"
                :key="reviewer.id"
                class="flex items-center gap-3 group cursor-pointer p-3 rounded-lg hover:bg-slate-800/50 transition"
                @click="navigateTo(`/profile/${reviewer.id}`)"
              >
                <img
                  :src="reviewer.avatar"
                  :alt="reviewer.name"
                  class="w-12 h-12 rounded-full group-hover:ring-2 ring-orange-500 transition"
                />
                <div class="flex-1">
                  <h4 class="font-semibold text-white text-sm group-hover:text-orange-400 transition">
                    {{ reviewer.name }}
                  </h4>
                  <p class="text-slate-400 text-xs">
                    {{ reviewer.reviews }} críticas • {{ reviewer.followers }} seguidores
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Stories Section -->
      <div class="mt-20">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-bold text-white">HISTÓRIAS RECENTES</h2>
          <router-link to="#" class="text-orange-400 hover:text-orange-300 text-sm font-semibold transition">
            VER TUDO
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="story in recentStories"
            :key="story.id"
            class="group cursor-pointer overflow-hidden rounded-lg"
            @click="navigateTo(story.link)"
          >
            <!-- Story Card -->
            <div class="relative aspect-video overflow-hidden rounded-lg bg-slate-800">
              <img
                :src="story.image"
                :alt="story.title"
                class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <div class="flex items-center gap-2 mb-3">
                  <img :src="story.author.avatar" :alt="story.author.name" class="w-8 h-8 rounded-full" />
                  <span class="text-white text-xs font-semibold">{{ story.author.name }}</span>
                </div>
                <h3 class="text-white font-bold text-lg mb-2">{{ story.title }}</h3>
                <p class="text-slate-200 text-sm line-clamp-2">{{ story.description }}</p>
              </div>
            </div>
            <button class="w-full mt-3 bg-slate-800 hover:bg-orange-600 text-white py-2 rounded font-semibold transition">
              LER HISTÓRIA
            </button>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-20 text-center py-12 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg border border-orange-500/30">
        <h2 class="text-3xl font-bold text-white mb-4">Pronto para começar?</h2>
        <p class="text-slate-300 mb-6">Conecte-se com milhares de foodies e compartilhe suas melhores descobertas gastronômicas</p>
        <router-link
          to="/auth/register"
          class="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-orange-500/50 transition"
        >
          Criar Conta Gratuitamente
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}

const popularReviews = ref([
  {
    id: 1,
    restaurantId: 1,
    restaurantName: 'Trattoria Bella',
    username: 'mak',
    rating: 5,
    type: 'Restaurante',
    text: 'A comida estava impecável, o atendimento perfeito e a ambiance muito acolhedora. Voltarei com certeza!',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop',
    likes: 234,
    liked: false,
    favorite: false
  },
  {
    id: 2,
    restaurantId: 2,
    restaurantName: 'Sakura Sushi',
    username: 'SarahGourmet',
    rating: 5,
    type: 'Restaurante',
    text: 'Melhor sushi que já comi! Ingredientes fresquíssimos e técnica impecável. Os chefs sabem o que fazem.',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=300&fit=crop',
    likes: 456,
    liked: false,
    favorite: true
  },
  {
    id: 3,
    restaurantId: 3,
    restaurantName: 'The Brew Corner',
    username: 'CoffeeAddict',
    rating: 4,
    type: 'Bar/Café',
    text: 'Ambiente aconchegante, café excelente e a equipe sempre atenta. Voltei 3 vezes em uma semana!',
    image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300&h=300&fit=crop',
    likes: 189,
    liked: false,
    favorite: false
  },
  {
    id: 4,
    restaurantId: 4,
    restaurantName: 'Churrascaria Premium',
    username: 'MeatLover',
    rating: 5,
    type: 'Churrascaria',
    text: 'Carnes impecáveis, garçons atenciosos e uma carta de vinhos que impressiona. Experiência memorável!',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561a1b?w=300&h=300&fit=crop',
    likes: 567,
    liked: true,
    favorite: false
  }
])

const popularLists = ref([
  {
    id: 1,
    title: 'Top 50 Restaurantes',
    author: 'Official Lists',
    count: 50,
    likes: 357,
    comments: 32,
    covers: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1555939594-58d7cb561a1b?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=200&h=200&fit=crop'
    ]
  },
  {
    id: 2,
    title: 'Melhores Bares da Cidade',
    author: 'NightlifeExplorer',
    count: 28,
    likes: 245,
    comments: 18,
    covers: [
      'https://images.unsplash.com/photo-1514432324607-2e467f4af3fb?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1609494466755-32a90c0c7c97?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1578241148553-80fcf52ff0ca?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1608050108905-2df4b486f56f?w=200&h=200&fit=crop'
    ]
  },
  {
    id: 3,
    title: 'Comida de Rua Imperdível',
    author: 'StreetFoodKing',
    count: 35,
    likes: 412,
    comments: 54,
    covers: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561a1b?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1609494466755-32a90c0c7c97?w=200&h=200&fit=crop'
    ]
  }
])

const popularReviewers = ref([
  {
    id: 1,
    name: 'mak',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mak',
    reviews: 723,
    followers: 796
  },
  {
    id: 2,
    name: 'SarahGourmet',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    reviews: 412,
    followers: 534
  },
  {
    id: 3,
    name: 'GastroNomad',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gastro',
    reviews: 567,
    followers: 891
  },
  {
    id: 4,
    name: 'ChefDiscoverer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chef',
    reviews: 289,
    followers: 421
  }
])

const recentStories = ref([
  {
    id: 1,
    title: 'A Revolução da Culinária Moderna',
    description: 'Descubra como chefs contemporâneos estão transformando a forma como comemos.',
    image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop',
    author: {
      name: 'Ferna_Larochelle',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ferna'
    },
    link: '#'
  },
  {
    id: 2,
    title: 'Festival Gastronômico 2026',
    description: 'Os melhores eventos de comida que você não pode perder este ano.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561a1b?w=600&h=400&fit=crop',
    author: {
      name: 'FoodFestival',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=festival'
    },
    link: '#'
  },
  {
    id: 3,
    title: 'Tendências de Sabor 2026',
    description: 'As receitas e combinações que dominarão a cena gastronômica este ano.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
    author: {
      name: 'TrendSpotter',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trend'
    },
    link: '#'
  }
])

const toggleLike = (reviewId) => {
  const review = popularReviews.value.find(r => r.id === reviewId)
  if (review) {
    review.liked = !review.liked
    review.likes += review.liked ? 1 : -1
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}
</style>
