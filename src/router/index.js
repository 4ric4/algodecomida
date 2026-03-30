import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Layouts
import AuthLayout from '../views/layouts/AuthLayout.vue'

// Pages
import LoginView from '../views/pages/auth/LoginView.vue'
import RegisterView from '../views/pages/auth/RegisterView.vue'
import OnboardingView from '../views/pages/auth/OnboardingView.vue'

import HomePageView from '../views/pages/home/HomePageView.vue'
import DiscoverView from '../views/pages/discover/DiscoverView.vue'
import RestaurantDetailView from '../views/pages/restaurants/RestaurantDetailView.vue'
import CreateReviewView from '../views/pages/reviews/CreateReviewView.vue'
import ProfileView from '../views/pages/profile/ProfileView.vue'
import ProfileRedirect from '../views/pages/profile/ProfileRedirect.vue'
import LandingView from '../views/pages/landing/LandingView.vue'
import FeedView from '../views/pages/feed/FeedView.vue'

const routes = [
  // Landing
  {
    path: '/landing',
    name: 'Landing',
    component: LandingView
  },

  // Auth
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'Login', component: LoginView },
      { path: 'register', name: 'Register', component: RegisterView },
      { path: 'onboarding', name: 'Onboarding', component: OnboardingView }
    ]
  },

  // Home
  {
    path: '/',
    name: 'Home',
    component: HomePageView,
    meta: { requiresAuth: true }
  },

  // Profile com username
  {
    path: '/profile/:username',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },

  // Profile sem username (redireciona)
  {
    path: '/profile',
    name: 'MyProfile',
    component: ProfileRedirect,
    meta: { requiresAuth: true }
  },

  // Outras páginas
  {
    path: '/discover',
    name: 'Discover',
    component: DiscoverView,
    meta: { requiresAuth: true }
  },
  {
    path: '/feed',
    name: 'Feed',
    component: FeedView,
    meta: { requiresAuth: true }
  },
  {
    path: '/restaurant/:id',
    name: 'RestaurantDetail',
    component: RestaurantDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/review/new',
    name: 'CreateReview',
    component: CreateReviewView,
    meta: { requiresAuth: true }
  },

  // fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔥 GUARD COMPLETO
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // inicializa auth sempre na primeira vez
  if (!authStore.initialized) {
    await authStore.initializeAuth()
  }

  // 🔥 TRATA /profile ESPECIALMENTE
  if (to.path === '/profile' && authStore.isLoggedIn && authStore.user?.username) {
    return next({ name: 'Profile', params: { username: authStore.user.username }, replace: true })
  }

  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)

  // proteção
  if (requiresAuth && !authStore.isLoggedIn) {
    return next('/auth/login')
  }

  // evitar auth logado
  if (to.path.startsWith('/auth') && authStore.isLoggedIn) {
    return next('/')
  }

  next()
})

export default router