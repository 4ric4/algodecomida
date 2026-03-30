<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="text-5xl mb-4">🔐</div>
        <h1 class="font-display font-bold text-3xl text-on-surface mb-2">
          GastroLog
        </h1>
        <p class="text-on-surface-variant">
          Sua rede social para explorar restaurantes e compartilhar experiências
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-on-surface mb-2">
            Email
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            class="input-field"
            placeholder="seu@email.com"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-on-surface mb-2">
            Senha
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            class="input-field"
            placeholder="••••••••"
          />
        </div>

        <!-- Remember Me -->
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            class="rounded"
          />
          <label for="remember" class="text-sm text-on-surface-variant">
            Lembrar de mim
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="authStore.isLoading"
          class="btn-primary w-full disabled:opacity-50"
        >
          <span v-if="!authStore.isLoading">Entrar</span>
          <span v-else>Entrando...</span>
        </button>

        <!-- Error Message -->
        <div v-if="authStore.error" class="p-4 bg-error-container text-error rounded-roundedness-md text-sm">
          {{ authStore.error }}
        </div>
      </form>

      <!-- Divider -->
      <div class="flex items-center gap-4 my-6">
        <div class="flex-1 h-px bg-outline-variant"></div>
        <span class="text-sm text-on-surface-variant">ou</span>
        <div class="flex-1 h-px bg-outline-variant"></div>
      </div>

      <!-- Social Login -->
      <div class="space-y-3">
        <button class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-surface-container-low rounded-roundedness-full hover:bg-surface-container transition">
          <span class="text-xl">🔐</span>
          <span class="text-sm font-medium">Google</span>
        </button>
      </div>

      <!-- Register Link -->
      <p class="text-center text-sm text-on-surface-variant mt-6">
        Não tem conta?
        <router-link to="/auth/register" class="text-primary font-semibold hover:underline">
          Criar conta
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    return
  }
  
  const success = await authStore.login(form.value.email, form.value.password)
  if (success) {
    // Redirecionar para onboarding ou home
    router.push({ name: 'Onboarding' })
  }
}
</script>
