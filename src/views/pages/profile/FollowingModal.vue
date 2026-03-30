<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white">Seguindo</h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white transition">
          ✕
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div v-if="loading" class="text-center py-8">
          <p class="text-slate-400">Carregando...</p>
        </div>
        <div v-else-if="following && following.length > 0" class="space-y-4">
          <div
            v-for="user in following"
            :key="user.id"
            class="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg hover:bg-slate-900 transition"
          >
            <div class="flex items-center gap-3 flex-1 cursor-pointer">
              <img
                :src="user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.username"
                :alt="user.username"
                class="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <p class="font-semibold text-white">{{ user.fullName }}</p>
                <p class="text-sm text-slate-400">@{{ user.username }}</p>
              </div>
            </div>
            <button
              @click="handleUnfollowClick(user)"
              :disabled="user.isUnfollowing"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition disabled:opacity-50 flex items-center gap-2"
            >
              {{ user.isUnfollowing ? '...' : '✕' }}
              <span>{{ user.isUnfollowing ? 'Deseguindo...' : 'Deixar' }}</span>
            </button>
          </div>
        </div>
        <div v-else class="text-center py-12">
          <p class="text-slate-400 text-lg">Você ainda não segue ninguém 😋</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userService } from '../../../services/user.service'

const props = defineProps({
  following: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'unfollow-changed'])

const handleUnfollowClick = async (user) => {
  try {
    user.isUnfollowing = true
    await userService.unfollowUser(user.id)
    emit('unfollow-changed', user)
    props.following = props.following.filter(u => u.id !== user.id)
  } catch (err) {
    console.error('Erro ao deixar de seguir:', err)
    alert(err.error || 'Erro ao deixar de seguir')
  } finally {
    user.isUnfollowing = false
  }
}
</script>
