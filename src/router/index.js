import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Layouts
import MainLayout from '../views/layouts/MainLayout.vue'
import AuthLayout from '../views/layouts/AuthLayout.vue'

// Auth Pages
import LoginView from '../views/pages/auth/LoginView.vue'
import RegisterView from '../views/pages/auth/RegisterView.vue'
import OnboardingView from '../views/pages/auth/OnboardingView.vue'

// Main Pages
import HomePageView from '../views/pages/home/HomePageView.vue'
import DiscoverView from '../views/pages/discover/DiscoverView.vue'
import RestaurantDetailView from '../views/pages/restaurants/RestaurantDetailView.vue'
import CreateReviewView from '../views/pages/reviews/CreateReviewView.vue'
import ProfileView from '../views/pages/profile/ProfileView.vue'
import NotificationsView from '../views/pages/notifications/NotificationsView.vue'
import LandingView from '../views/pages/landing/LandingView.vue'
import FeedView from '../views/pages/feed/FeedView.vue'

const routes = [
  // Landing Route (For unauthenticated users)
  {
    path: '/landing',
    name: 'Landing',
    component: LandingView,
    meta: { requiresAuth: false }
  },

  // Auth Routes
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: LoginView
      },
      {
        path: 'register',
        name: 'Register',
        component: RegisterView
      },
      {
        path: 'onboarding',
        name: 'Onboarding',
        component: OnboardingView
      }
    ]
  },

  // Home Route (Dark, no layout)
  {
    path: '/',
    name: 'Home',
    component: HomePageView,
    meta: { requiresAuth: true }
  },

  // Dark Pages (Independent routes without MainLayout)
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
    path: '/restaurants/:id',
    name: 'RestaurantDetailAlt',
    component: RestaurantDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/review/new',
    name: 'CreateReview',
    component: CreateReviewView,
    meta: { requiresAuth: true }
  },
  {
    path: '/review/new/:restaurantId',
    name: 'CreateReviewForRestaurant',
    component: CreateReviewView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/:username',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'ProfileCurrent',
    component: ProfileView,
    meta: { requiresAuth: true }
  },

  // Other Routes with MainLayout
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'notifications',
        name: 'Notifications',
        component: NotificationsView,
        meta: { requiresAuth: true }
      }
    ]
  },

  // Fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'Home' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // Inicializar autentica��o na primeira navega��o
  if (!from.name) {
    await authStore.initializeAuth()
  }

  if (requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'Login' })
  } else if (to.path.startsWith('/auth') && authStore.isLoggedIn) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
