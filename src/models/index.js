// MODELS - Estrutura de dados
export class Restaurant {
  constructor(data = {}) {
    this.id = data.id || null
    this.name = data.name || ''
    this.cuisine = data.cuisine || []
    this.rating = data.rating || 0
    this.reviewsCount = data.reviewsCount || 0
    this.image = data.image || ''
    this.description = data.description || ''
    this.location = data.location || {}
    this.tags = data.tags || []
    this.priceRange = data.priceRange || '$'
    this.hours = data.hours || {}
    this.createdAt = data.createdAt || new Date()
  }
}

export class Review {
  constructor(data = {}) {
    // Garantir que ID é sempre um número válido
    this.id = data.id ? parseInt(data.id) : null
    this.restaurantId = data.restaurantId ? parseInt(data.restaurantId) : null
    this.userId = data.userId ? parseInt(data.userId) : null
    this.rating = data.rating || 0
    this.title = data.title || ''
    this.text = data.text || ''
    this.images = data.images || []
    this.dishes = data.dishes || []
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
    this.likes = data.likes || 0
    this.likes_by_user = data.likes_by_user || false
    this.comments = data.comments || []
    this.commentCount = data.commentCount || 0
    this.user = data.user || null
    this.restaurant = data.restaurant || null
  }
}

export class User {
  constructor(data = {}) {
    this.id = data.id || null
    this.username = data.username || ''
    this.email = data.email || ''
    this.fullName = data.fullName || ''
    this.avatar = data.avatar || ''
    this.bio = data.bio || ''
    this.followers = data.followers || 0
    this.following = data.following || 0
    this.reviewsCount = data.reviewsCount || 0
    this.level = data.level || 1
    this.xp = data.xp || 0
    this.admin = data.admin || 0
    this.badges = data.badges || []
    this.createdAt = data.createdAt || new Date()
  }
}

export class Badge {
  constructor(data = {}) {
    this.id = data.id || null
    this.name = data.name || ''
    this.icon = data.icon || ''
    this.description = data.description || ''
    this.requirement = data.requirement || {}
    this.color = data.color || 'tertiary-container'
  }
}

export class Notification {
  constructor(data = {}) {
    this.id = data.id || null
    this.userId = data.userId || null
    this.type = data.type || 'like' // like, follow, comment, recommendation
    this.fromUser = data.fromUser || null
    this.targetId = data.targetId || null
    this.message = data.message || ''
    this.read = data.read || false
    this.createdAt = data.createdAt || new Date()
  }
}
