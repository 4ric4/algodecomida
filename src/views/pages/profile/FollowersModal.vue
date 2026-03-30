<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white">Seguidores</h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white transition">
          ✕
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div v-if="loading" class="text-center py-8">
          <p class="text-slate-400">Carregando...</p>
        </div>
        <div v-else-if="followers && followers.length > 0" class="space-y-4">
          <div
            v-for="follower in followers"
            :key="follower.id"
            class="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg hover:bg-slate-900 transition"
          >
            <div class="flex items-center gap-3 flex-1">
              <img
                :src="follower.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + follower.username"
                :alt="follower.username"
                class="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <p class="font-semibold text-white">{{ follower.fullName }}</p>
                <p class="text-sm text-slate-400">@{{ follower.username }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="handleFollowClick(follower)"
                :disabled="follower.isRemoving"
                :class="[
                  'px-3 py-2 rounded-lg font-semibold transition text-sm',
                  follower.isFollowing
                    ? 'bg-slate-600 hover:bg-slate-700 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white',
                  follower.isFollowing ? 'disabled:opacity-50' : ''
                ]"
              >
                {{ follower.isFollowing ? 'Seguindo' : 'Seguir' }}
              </button>
              <button
                @click="handleRemoveFollower(follower)"
                :disabled="follower.isRemoving"
                class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition text-sm disabled:opacity-50"
                title="Remover como seguidor"
              >
                {{ follower.isRemoving ? '...' : '🗑️' }}
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12">
          <p class="text-slate-400 text-lg">Nenhum seguidor ainda 😋</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { userService } from '../../../services/user.service'
import { useAuthStore } from '../../../stores/auth'

const props = defineProps({
  followers: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'follower-removed', 'follow-changed'])
const authStore = useAuthStore()

const handleFollowClick = async (follower) => {
  try {
    if (follower.isFollowing) {
      await userService.unfollowUser(follower.id)
      follower.isFollowing = false
    } else {
      await userService.followUser(follower.id)
      follower.isFollowing = true
    }
    emit('follow-changed', follower)
  } catch (err) {
    console.error('Erro ao seguir/deixar de seguir:', err)
    alert(err.error || 'Erro ao atualizar seguimento')
  }
}

const handleRemoveFollower = async (follower) => {
  if (!confirm(`Deseja remover ${follower.fullName} como seguidor?`)) {
    return
  }

  try {
    follower.isRemoving = true
    await userService.removeFollower(authStore.user.id, follower.id)
    emit('follower-removed', follower)
    props.followers = props.followers.filter(f => f.id !== follower.id)
  } catch (err) {
    console.error('Erro ao remover seguidor:', err)
    alert(err.error || 'Erro ao remover seguidor')
  } finally {
    follower.isRemoving = false
  }
}
</script>
