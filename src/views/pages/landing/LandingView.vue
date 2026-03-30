<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-2 text-2xl font-bold">
            <span class="text-orange-500">🍽️</span>
            <span class="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              GastroLog
            </span>
          </div>
          <div class="flex items-center gap-4">
            <button
              @click="navigateTo('/auth/login')"
              class="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white transition"
            >
              Entrar
            </button>
            <button
              @click="navigateTo('/auth/register')"
              class="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/50 transition"
            >
              Criar Conta
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-20 pb-32 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="space-y-6">
            <div class="space-y-4">
              <h1 class="text-5xl md:text-6xl font-bold text-white leading-tight">
                Descubra restaurantes
                <span class="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  que você ama
                </span>
              </h1>
              <p class="text-xl text-slate-300">
                Registre, avalie e compartilhe suas experiências gastronômicas. Conecte-se com foodies e descubra as melhores casas da sua região.
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                @click="navigateTo('/auth/register')"
                class="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-orange-500/50 transition transform hover:scale-105"
              >
                Começar — é grátis!
              </button>
              <button
                @click="scrollToSection('features')"
                class="px-8 py-4 border-2 border-orange-500 text-orange-400 rounded-lg font-bold text-lg hover:bg-orange-500/10 transition"
              >
                Saber mais
              </button>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 pt-8">
              <div class="space-y-1">
                <div class="text-2xl font-bold text-orange-400">2.5K</div>
                <div class="text-sm text-slate-400">Restaurantes</div>
              </div>
              <div class="space-y-1">
                <div class="text-2xl font-bold text-orange-400">15K+</div>
                <div class="text-sm text-slate-400">Reviews</div>
              </div>
              <div class="space-y-1">
                <div class="text-2xl font-bold text-orange-400">8K</div>
                <div class="text-sm text-slate-400">Usuários Ativos</div>
              </div>
            </div>
          </div>

          <!-- Right - Featured Restaurants -->
          <div class="relative h-96">
            <div class="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl blur-2xl"></div>
            <div class="relative grid grid-cols-2 gap-4 h-full">
              <div
                v-for="(restaurant, idx) in featuredRestaurants.slice(0, 4)"
                :key="idx"
                class="group relative rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition"
              >
                <div class="w-full h-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                  <span class="text-4xl">{{ restaurant.emoji }}</span>
                </div>
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                  <div class="text-white">
                    <h3 class="font-bold text-sm">{{ restaurant.name }}</h3>
                    <p class="text-xs text-orange-300">{{ restaurant.cuisine }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 px-4 bg-slate-800/50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-white mb-4">
            O que GastroLog oferece
          </h2>
          <p class="text-xl text-slate-400">
            Tudo que você precisa para se tornar um expert em gastronomia
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="group p-8 rounded-2xl bg-slate-700/50 hover:bg-slate-700 transition border border-slate-600/50 hover:border-orange-500/50">
            <div class="text-4xl mb-4">🏪</div>
            <h3 class="text-xl font-bold text-white mb-3">Registre seus Restaurantes</h3>
            <p class="text-slate-400">
              Mantenha um histórico completo de todos os restaurantes, bares e casa de comida que você visitou
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="group p-8 rounded-2xl bg-slate-700/50 hover:bg-slate-700 transition border border-slate-600/50 hover:border-orange-500/50">
            <div class="text-4xl mb-4">⭐</div>
            <h3 class="text-xl font-bold text-white mb-3">Avaliações Detalhadas</h3>
            <p class="text-slate-400">
              Classifique em escala de 5 estrelas e compartilhe resenhas completas sobre suas experiências gastronômicas
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="group p-8 rounded-2xl bg-slate-700/50 hover:bg-slate-700 transition border border-slate-600/50 hover:border-orange-500/50">
            <div class="text-4xl mb-4">👥</div>
            <h3 class="text-xl font-bold text-white mb-3">Conecte com Amigos</h3>
            <p class="text-slate-400">
              Compartilhe suas descobertas, siga amigos e veja o que eles estão comendo e avaliando
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="group p-8 rounded-2xl bg-slate-700/50 hover:bg-slate-700 transition border border-slate-600/50 hover:border-orange-500/50">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="text-xl font-bold text-white mb-3">Estatísticas Pessoais</h3>
            <p class="text-slate-400">
              Visualize seus dados: restaurantes visitados, favoritos, comparações de culinária e muito mais
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="group p-8 rounded-2xl bg-slate-700/50 hover:bg-slate-700 transition border border-slate-600/50 hover:border-orange-500/50">
            <div class="text-4xl mb-4">🎯</div>
            <h3 class="text-xl font-bold text-white mb-3">Recomendações Personalizadas</h3>
            <p class="text-slate-400">
              Descubra novos restaurantes baseado nos seus gostos, avaliações e preferências de culinária
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="group p-8 rounded-2xl bg-slate-700/50 hover:bg-slate-700 transition border border-slate-600/50 hover:border-orange-500/50">
            <div class="text-4xl mb-4">🏆</div>
            <h3 class="text-xl font-bold text-white mb-3">Gamificação</h3>
            <p class="text-slate-400">
              Ganhe badges, desbloqueie achievements e suba no ranking de foodies da sua região
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Reviews Section -->
    <section class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="mb-12">
          <h2 class="text-4xl font-bold text-white mb-2">
            Reviews Populares
          </h2>
          <p class="text-slate-400">
            As melhores experiências compartilhadas pela comunidade
          </p>
        </div>

        <!-- Reviews Grid -->
        <div class="grid md:grid-cols-2 gap-8 mb-8">
          <div
            v-for="(review, idx) in popularReviews"
            :key="idx"
            class="p-6 rounded-xl bg-slate-700/50 border border-slate-600/50 hover:border-orange-500/50 transition group cursor-pointer"
          >
            <div class="flex gap-4">
              <!-- Restaurant Image -->
              <div class="w-20 h-20 rounded-lg bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center flex-shrink-0">
                <span class="text-3xl">{{ review.emoji }}</span>
              </div>

              <!-- Content -->
              <div class="flex-1">
                <h3 class="font-bold text-white mb-1">{{ review.restaurant }}</h3>
                <p class="text-sm text-slate-400 mb-2">{{ review.cuisine }}</p>

                <!-- Stars -->
                <div class="flex items-center gap-2 mb-3">
                  <div class="flex gap-1">
                    <span
                      v-for="i in 5"
                      :key="i"
                      :class="i <= review.rating ? 'text-yellow-400' : 'text-slate-500'"
                    >
                      ★
                    </span>
                  </div>
                  <span class="text-xs text-slate-400">{{ review.rating }}/5</span>
                </div>

                <!-- Review Text -->
                <p class="text-sm text-slate-300 mb-3 line-clamp-2">
                  "{{ review.review }}"
                </p>

                <!-- Footer -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white">
                      {{ review.author.charAt(0) }}
                    </div>
                    <span class="text-xs text-slate-400">{{ review.author }}</span>
                  </div>
                  <span class="text-xs text-slate-500">❤️ {{ review.likes }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center">
          <button
            @click="navigateTo('/auth/register')"
            class="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition"
          >
            Ver mais reviews
          </button>
        </div>
      </div>
    </section>

    <!-- Featured Collections -->
    <section class="py-20 px-4 bg-slate-800/50">
      <div class="max-w-7xl mx-auto">
        <div class="mb-12">
          <h2 class="text-4xl font-bold text-white mb-2">
            Listas Populares
          </h2>
          <p class="text-slate-400">
            Coleções curadas pela comunidade de foodies
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(collection, idx) in collections"
            :key="idx"
            class="group rounded-xl overflow-hidden bg-slate-700/50 border border-slate-600/50 hover:border-orange-500/50 transition cursor-pointer"
          >
            <!-- Image Grid -->
            <div class="grid grid-cols-2 gap-1 h-40 bg-slate-600 p-2">
              <div
                v-for="i in 4"
                :key="i"
                class="bg-gradient-to-br from-orange-600 to-red-600 rounded flex items-center justify-center text-2xl"
              >
                {{ collection.emojis[i - 1] }}
              </div>
            </div>

            <!-- Content -->
            <div class="p-4">
              <h3 class="font-bold text-white mb-2 group-hover:text-orange-400 transition">
                {{ collection.title }}
              </h3>
              <p class="text-sm text-slate-400 mb-3">
                {{ collection.count }} restaurantes
              </p>
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                  {{ collection.curator.charAt(0) }}
                </div>
                <span class="text-xs text-slate-400">by {{ collection.curator }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4">
      <div class="max-w-4xl mx-auto text-center space-y-8">
        <div class="space-y-4">
          <h2 class="text-5xl font-bold text-white">
            Pronto para descobrir?
          </h2>
          <p class="text-xl text-slate-400">
            Junte-se a milhares de foodies que já estão compartilhando suas experiências gastronômicas
          </p>
        </div>

        <button
          @click="navigateTo('/auth/register')"
          class="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-orange-500/50 transition transform hover:scale-105"
        >
          Criar conta agora — é grátis!
        </button>

        <p class="text-sm text-slate-500">
          Já tem conta?
          <button
            @click="navigateTo('/auth/login')"
            class="text-orange-400 hover:text-orange-300 font-semibold"
          >
            Faça login
          </button>
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-slate-700 py-8 px-4 bg-slate-900/50">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div class="flex items-center gap-2 text-xl font-bold mb-4">
              <span class="text-orange-500">🍽️</span>
              <span>GastroLog</span>
            </div>
            <p class="text-sm text-slate-400">
              A rede social para amantes de boa comida
            </p>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-4">Produto</h4>
            <ul class="space-y-2 text-sm text-slate-400">
              <li><a href="#" class="hover:text-orange-400 transition">Recursos</a></li>
              <li><a href="#" class="hover:text-orange-400 transition">Preços</a></li>
              <li><a href="#" class="hover:text-orange-400 transition">Segurança</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-4">Comunidade</h4>
            <ul class="space-y-2 text-sm text-slate-400">
              <li><a href="#" class="hover:text-orange-400 transition">Blog</a></li>
              <li><a href="#" class="hover:text-orange-400 transition">Forum</a></li>
              <li><a href="#" class="hover:text-orange-400 transition">Discord</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-4">Legal</h4>
            <ul class="space-y-2 text-sm text-slate-400">
              <li><a href="#" class="hover:text-orange-400 transition">Privacidade</a></li>
              <li><a href="#" class="hover:text-orange-400 transition">Termos</a></li>
              <li><a href="#" class="hover:text-orange-400 transition">Contato</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm text-slate-500">
            © 2026 GastroLog. Todos os direitos reservados.
          </p>
          <div class="flex gap-6 mt-4 md:mt-0">
            <a href="#" class="text-slate-400 hover:text-orange-400 transition">Twitter</a>
            <a href="#" class="text-slate-400 hover:text-orange-400 transition">Instagram</a>
            <a href="#" class="text-slate-400 hover:text-orange-400 transition">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const featuredRestaurants = [
  { name: 'La Bella Italia', cuisine: 'Italiana', emoji: '🍝' },
  { name: 'Sakura Sushi', cuisine: 'Japonesa', emoji: '🍣' },
  { name: 'Churrascaria Prime', cuisine: 'Churrasco', emoji: '🥩' },
  { name: 'Pho Vietnam', cuisine: 'Vietnamita', emoji: '🍜' },
]

const popularReviews = [
  {
    restaurant: 'La Bella Italia',
    cuisine: 'Restaurante Italiano',
    emoji: '🍝',
    rating: 5,
    review: 'Melhor massa que já comi! A atmosfera é perfeita para um jantar romântico. O garçom foi atencioso e educado.',
    author: 'Marina',
    likes: 1243,
  },
  {
    restaurant: 'Sakura Sushi',
    cuisine: 'Restaurante Japonês',
    emoji: '🍣',
    rating: 4,
    review: 'Excelente qualidade do peixe e criatividade nos rolls. Um pouco caro, mas vale a pena pelo atendimento premium.',
    author: 'Carlos',
    likes: 892,
  },
  {
    restaurant: 'Churrascaria Prime',
    cuisine: 'Churrascaria',
    emoji: '🥩',
    rating: 5,
    review: 'Que churrascaria! Carnes macias e saborosas. O rodízio vale cada centavo investido.',
    author: 'Felipe',
    likes: 2105,
  },
  {
    restaurant: 'Burger House',
    cuisine: 'Fast Food Gourmet',
    emoji: '🍔',
    rating: 4,
    review: 'Hambúrguer caseiro com ingredientes de primeira qualidade. A batata frita crocante é perfeita!',
    author: 'Ana',
    likes: 756,
  },
]

const collections = [
  {
    title: 'Melhores Pizzarias da Região',
    count: 12,
    curator: 'FoodieKing',
    emojis: ['🍕', '🧀', '🍅', '🌿'],
  },
  {
    title: 'Bares Secretos Imperdíveis',
    count: 8,
    curator: 'BarExplorer',
    emojis: ['🍸', '🍺', '🍷', '🍹'],
  },
  {
    title: 'Comida de Rua - A Melhor Acessível',
    count: 25,
    curator: 'StreetFood',
    emojis: ['🌮', '🥙', '🍢', '🥘'],
  },
]

function navigateTo(path) {
  router.push(path)
}

function scrollToSection(id) {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* Add smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Gradient text animation on hover */
.group:hover h3 {
  background-image: linear-gradient(135deg, #ea580c, #dc2626);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
