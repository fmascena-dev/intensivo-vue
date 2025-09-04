<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card card">
        <div class="login-header">
          <h1>Filmes&Séries</h1>
          <p>Explore filmes e séries incríveis</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">Usuário</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              placeholder="Digite seu usuário"
            />
          </div>

          <div class="form-group">
            <label for="password">Senha</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="Digite sua senha"
            />
          </div>

          <button type="submit" class="btn btn-primary login-btn" :disabled="loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div class="login-demo">
          <p>DEMO - use qualquer usuário e senha para entrar</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const loading = ref(false)
    const form = ref({
      username: '',
      password: ''
    })

    const handleLogin = async () => {
      loading.value = true

      setTimeout(() => {
        const userData = {
          id: 1,
          username: form.value.username,
          name: form.value.username
        }

        authStore.login(userData)
        router.push('/')
        loading.value = false
      }, 1000)
    }

    return {
      form,
      loading,
      handleLogin
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $background-primary 0%, $background-secondary 100%);
  padding: $spacing-md;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  padding: $spacing-xxl $spacing-xl;
  text-align: center;
}

.login-header {
  margin-bottom: $spacing-xl;

  h1 {
    color: $accent-primary;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: $spacing-sm;
  }

  p {
    color: $text-secondary;
    font-size: 1.1rem;
  }
}

.login-form {
  .form-group {
    margin-bottom: $spacing-lg;
    text-align: left;

    label {
      display: block;
      margin-bottom: $spacing-sm;
      color: $text-primary;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: $spacing-md;
      border: 1px solid $border-color;
      border-radius: $border-radius-sm;
      background-color: $background-tertiary;
      color: $text-primary;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: $accent-primary;
        box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
      }

      &::placeholder {
        color: $text-muted;
      }
    }
  }

  .login-btn {
    width: 100%;
    padding: $spacing-md;
    font-size: 1.1rem;
    font-weight: 600;
    margin-top: $spacing-md;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

.login-demo {
  margin-top: $spacing-lg;
  padding-top: $spacing-lg;
  border-top: 1px solid $border-color;

  p {
    color: $accent-primary;
    font-size: 0.9rem;
    font-weight: bold;
  }
}

@media (max-width: $mobile) {
  .login-card {
    padding: $spacing-xl $spacing-lg;
  }
}
</style>
