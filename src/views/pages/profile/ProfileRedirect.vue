<template>
  <div></div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth'
import { onMounted, ref } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const isRedirecting = ref(false)

onMounted(async () => {
  // Previne múltiplos redirecionamentos
  if (isRedirecting.value) return
  isRedirecting.value = true

  try {
    // Aguarda inicialização se necessário
    if (!authStore.initialized && localStorage.getItem('auth_token')) {
      await authStore.initializeAuth()
    }

    // Aguarda um pouco para garantir que tudo foi carregado
    await new Promise(resolve => setTimeout(resolve, 100))

    // Se logado e tem username, redireciona
    if (authStore.isLoggedIn && authStore.user?.username) {
      console.log('ProfileRedirect: redirecionando para /profile/' + authStore.user.username)
      router.replace({ name: 'Profile', params: { username: authStore.user.username } })
    } else if (!authStore.isLoggedIn) {
      console.log('ProfileRedirect: não autenticado, redirecionando para login')
      router.replace({ name: 'Login' })
    }
  } catch (err) {
    console.error('ProfileRedirect: erro:', err)
    router.replace({ name: 'Login' })
  }
})
</script>
