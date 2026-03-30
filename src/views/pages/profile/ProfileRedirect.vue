<template>
  <div></div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth'
import { onMounted } from 'vue'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  // Garante que a autenticação foi inicializada
  if (!authStore.isLoggedIn && localStorage.getItem('auth_token')) {
    await authStore.initializeAuth()
  }

  // Se logado, redireciona para o perfil do usuário
  if (authStore.isLoggedIn && authStore.user?.username) {
    router.replace({ name: 'Profile', params: { username: authStore.user.username } })
  } else {
    // Se não logado, redireciona para login
    router.replace({ name: 'Login' })
  }
})
</script>
