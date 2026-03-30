<template>
  <div class="space-y-6">
    <div class="card p-8">
      <h1 class="font-display font-bold text-3xl mb-2">Notificações</h1>
      <p class="text-on-surface-variant">Fique atualizado com a atividade da comunidade</p>
    </div>

    <!-- Notification List -->
    <div class="space-y-3">
      <div
        v-for="(notification, idx) in notifications"
        :key="idx"
        class="card p-6 flex items-center justify-between hover:bg-surface-container transition cursor-pointer"
        :class="{ 'bg-primary-fixed-dim bg-opacity-10': !notification.read }"
      >
        <div class="flex items-center gap-4 flex-1">
          <!-- Avatar -->
          <img
            :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}`"
            alt="User"
            class="w-12 h-12 rounded-full"
          />

          <!-- Content -->
          <div class="flex-1">
            <div class="font-semibold text-on-surface">
              {{ getNotificationText(notification) }}
            </div>
            <div class="text-sm text-on-surface-variant">
              {{ getTimeAgo(notification.createdAt) }}
            </div>
          </div>
        </div>

        <!-- Action -->
        <button class="text-primary hover:bg-primary-container p-2 rounded-roundedness-md transition">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="notifications.length === 0" class="card p-12 text-center">
      <div class="text-5xl mb-4">🔔</div>
      <h3 class="font-display font-bold text-xl mb-2">Nenhuma notificação</h3>
      <p class="text-on-surface-variant">
        Suas notificações aparecerão aqui quando alguém interagir com seu conteúdo
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const notifications = ref([
  {
    id: 1,
    type: 'like',
    fromUser: 'maria_gourmet',
    message: 'curtiu sua review',
    targetId: 5,
    read: false,
    createdAt: new Date(Date.now() - 3600000)
  },
  {
    id: 2,
    type: 'follow',
    fromUser: 'chef_carlos',
    message: 'começou a te seguir',
    read: false,
    createdAt: new Date(Date.now() - 7200000)
  },
  {
    id: 3,
    type: 'comment',
    fromUser: 'ana_foodie',
    message: 'comentou em sua review',
    targetId: 3,
    read: true,
    createdAt: new Date(Date.now() - 86400000)
  }
])

const getNotificationText = (notification) => {
  const texts = {
    like: `${notification.fromUser} curtiu sua review`,
    follow: `${notification.fromUser} começou a te seguir`,
    comment: `${notification.fromUser} comentou em sua review`,
    recommendation: `${notification.fromUser} recomendou um restaurante para você`
  }
  return texts[notification.type] || notification.message
}

const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d atrás`
  if (hours > 0) return `${hours}h atrás`
  if (minutes > 0) return `${minutes}m atrás`
  return 'Agora'
}
</script>
