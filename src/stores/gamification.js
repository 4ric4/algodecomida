import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGamificationStore = defineStore('gamification', () => {
  // STATE
  const userStats = ref({
    level: 1,
    xp: 0,
    xpNeeded: 100,
    badges: [],
    streak: 0,
    totalReviews: 0,
    totalLikes: 0,
    followers: 0
  })

  // BADGES SYSTEM
  const badgesDefinitions = {
    'first_review': {
      name: 'Crítico Iniciante',
      icon: '📝',
      description: 'Escreveu sua primeira review',
      requirement: { type: 'reviews', count: 1 }
    },
    'review_five': {
      name: 'Explorador',
      icon: '🔍',
      description: 'Escreveu 5 reviews',
      requirement: { type: 'reviews', count: 5 }
    },
    'review_ten': {
      name: 'Crítico',
      icon: '⭐',
      description: 'Escreveu 10 reviews',
      requirement: { type: 'reviews', count: 10 }
    },
    'elite_foodie': {
      name: 'Elite Foodie',
      icon: '🏆',
      description: 'Tem avaliação média de 4.5 ou superior',
      requirement: { type: 'rating', min: 4.5 }
    },
    'hundred_likes': {
      name: 'Popular',
      icon: '❤️',
      description: 'Recebeu 100 likes nas reviews',
      requirement: { type: 'likes', count: 100 }
    },
    'streak_seven': {
      name: 'Viciado em Gastronomia',
      icon: '🔥',
      description: 'Publicou reviews 7 dias seguidos',
      requirement: { type: 'streak', days: 7 }
    }
  }

  // LEVELS SYSTEM
  const levels = [
    { id: 1, name: 'Aprendiz', icon: '🌱', minXp: 0, maxXp: 100 },
    { id: 2, name: 'Explorador', icon: '🧭', minXp: 100, maxXp: 250 },
    { id: 3, name: 'Crítico', icon: '📖', minXp: 250, maxXp: 450 },
    { id: 4, name: 'Especialista', icon: '��‍🍳', minXp: 450, maxXp: 700 },
    { id: 5, name: 'Mestre', icon: '👑', minXp: 700, maxXp: 1000 },
    { id: 6, name: 'Lenda', icon: '⭐', minXp: 1000, maxXp: Infinity }
  ]

  // MOCK USER DATA
  const mockUserStats = {
    level: 5,
    xp: 850,
    xpNeeded: 1000,
    badges: ['first_review', 'review_ten', 'elite_foodie', 'hundred_likes'],
    streak: 7,
    totalReviews: 42,
    totalLikes: 234,
    followers: 245
  }

  // GETTERS
  const currentLevel = computed(() => {
    const currentLevelData = levels.find(l => mockUserStats.xp >= l.minXp && mockUserStats.xp < l.maxXp)
    return currentLevelData || levels[levels.length - 1]
  })

  const earnedBadges = computed(() => {
    return mockUserStats.badges.map(badgeId => badgesDefinitions[badgeId])
  })

  const progressPercentage = computed(() => {
    const currentLevelData = currentLevel.value
    const xpInLevel = mockUserStats.xp - currentLevelData.minXp
    const xpNeeded = currentLevelData.maxXp - currentLevelData.minXp
    return Math.round((xpInLevel / xpNeeded) * 100)
  })

  // ACTIONS
  async function initializeGamification() {
    userStats.value = { ...mockUserStats }
  }

  async function addXp(amount) {
    mockUserStats.xp += amount
    userStats.value.xp = mockUserStats.xp
  }

  async function unlockBadge(badgeId) {
    if (!mockUserStats.badges.includes(badgeId)) {
      mockUserStats.badges.push(badgeId)
      userStats.value.badges = [...mockUserStats.badges]
    }
  }

  async function updateStats(stats) {
    mockUserStats.totalReviews = stats.reviews || mockUserStats.totalReviews
    mockUserStats.totalLikes = stats.likes || mockUserStats.totalLikes
    mockUserStats.followers = stats.followers || mockUserStats.followers
    userStats.value = { ...mockUserStats }
  }

  return {
    userStats,
    badgesDefinitions,
    levels,
    currentLevel,
    earnedBadges,
    progressPercentage,
    initializeGamification,
    addXp,
    unlockBadge,
    updateStats
  }
})
