<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-content">
        <RouterLink to="/" class="navbar-brand">
          <h1>MovieApp</h1>
        </RouterLink>

        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/movies" class="nav-link">Filmes</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/series" class="nav-link">Séries</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/favorites" class="nav-link">Favoritos</RouterLink>
          </li>
        </ul>

        <div class="navbar-actions">
          <span class="user-name">Olá, {{ authStore.user?.name }}</span>
          <button @click="handleLogout" class="btn btn-ghost">Sair</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.navbar {
  background-color: $background-secondary;
  border-bottom: 1px solid $border-color;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md 0;
}

.navbar-brand {
  text-decoration: none;

  h1 {
    color: $accent-primary;
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
  }
}

.navbar-nav {
  display: flex;
  list-style: none;
  gap: $spacing-lg;

  .nav-item {
    .nav-link {
      color: $text-secondary;
      text-decoration: none;
      font-weight: 500;
      padding: $spacing-sm $spacing-md;
      border-radius: $border-radius-sm;
      transition: all 0.3s ease;

      &:hover {
        color: $text-primary;
        background-color: $background-tertiary;
      }

      &.router-link-active {
        color: $accent-primary;
        background-color: rgba(229, 9, 20, 0.1);
      }
    }
  }
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: $spacing-md;

  .user-name {
    color: $text-secondary;
    font-size: 0.9rem;
  }
}

@media (max-width: $mobile) {
  .navbar-content {
    flex-direction: column;
    gap: $spacing-md;
  }

  .navbar-nav {
    gap: $spacing-sm;
  }

  .navbar-actions {
    .user-name {
      display: none;
    }
  }
}
</style>
