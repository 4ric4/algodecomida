<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="font-display font-bold text-3xl text-on-surface mb-2">
          Criar Conta
        </h1>
        <p class="text-on-surface-variant">
          Junte-se à comunidade de amantes de gastronomia
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Full Name -->
        <div>
          <label class="block text-sm font-medium text-on-surface mb-2">
            Nome Completo
          </label>
          <input
            v-model="form.fullName"
            type="text"
            required
            class="input-field"
            placeholder="João Silva"
          />
        </div>

        <!-- Username -->
        <div>
          <label class="block text-sm font-medium text-on-surface mb-2">
            Username
          </label>
          <input
            v-model="form.username"
            type="text"
            required
            class="input-field"
            placeholder="joao_silva"
          />
        </div>

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

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-on-surface mb-2">
            Confirmar Senha
          </label>
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            class="input-field"
            placeholder="••••••••"
          />
        </div>

        <!-- Terms -->
        <div class="flex items-start gap-2">
          <input
            v-model="form.agreeTerms"
            type="checkbox"
            id="terms"
            class="mt-1"
            required
          />
          <label for="terms" class="text-sm text-on-surface-variant">
            Concordo com os
            <a href="#" class="text-primary hover:underline">Termos de Serviço</a>
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="authStore.isLoading"
          class="btn-primary w-full disabled:opacity-50"
        >
          <span v-if="!authStore.isLoading">Criar Conta</span>
          <span v-else>Criando...</span>
        </button>

        <!-- Error Message -->
        <div v-if="authStore.error" class="p-4 bg-error-container text-error rounded-roundedness-md text-sm">
          {{ authStore.error }}
        </div>
      </form>

      <!-- Login Link -->
      <p class="text-center text-sm text-on-surface-variant mt-6">
        Já tem conta?
        <router-link to="/auth/login" class="text-primary font-semibold hover:underline">
          Fazer login
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
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert('Senhas não conferem')
    return
  }

  const success = await authStore.register(
    form.value.email,
    form.value.password,
    form.value.fullName,
    form.value.username
  )

  if (success) {
    router.push({ name: 'Onboarding' })
  }
}
</script>
