<template>
  <div class="favorites-view">
    <main class="container">
      <header class="page-header">
        <h1>Meus Favoritos</h1>
        <p>Seus filmes e séries favoritos em um só lugar</p>
      </header>

      <div class="favorites-stats">
        <div class="stat-card card">
          <div class="stat-number">{{ favoriteMovies.length }}</div>
          <div class="stat-label">Filmes</div>
        </div>
        <div class="stat-card card">
          <div class="stat-number">{{ favoriteSeries.length }}</div>
          <div class="stat-label">Séries</div>
        </div>
        <div class="stat-card card">
          <div class="stat-number">{{ allFavorites.length }}</div>
          <div class="stat-label">Total</div>
        </div>
      </div>

      <div class="favorites-content">
        <div v-if="allFavorites.length === 0" class="empty-favorites">
          <div class="empty-icon">📽️</div>
          <h3>Nenhum favorito ainda</h3>
          <p>Explore filmes e séries e adicione aos seus favoritos!</p>
          <div class="empty-actions">
            <RouterLink to="/movies" class="btn btn-primary"> Ver Filmes </RouterLink>
            <RouterLink to="/series" class="btn btn-secondary"> Ver Séries </RouterLink>
          </div>
        </div>

        <div v-else>
          <div class="filter-tabs">
            <button
              @click="activeFilter = 'all'"
              :class="['filter-tab', { active: activeFilter === 'all' }]"
            >
              Todos ({{ allFavorites.length }})
            </button>
            <button
              @click="activeFilter = 'movies'"
              :class="['filter-tab', { active: activeFilter === 'movies' }]"
            >
              Filmes ({{ favoriteMovies.length }})
            </button>
            <button
              @click="activeFilter = 'series'"
              :class="['filter-tab', { active: activeFilter === 'series' }]"
            >
              Séries ({{ favoriteSeries.length }})
            </button>
          </div>

          <div class="favorites-grid">
            <MovieCard
              v-for="item in filteredFavorites"
              :key="`${item.id}-${item.media_type}`"
              :item="item"
              @show-trailer="showTrailer"
              @toggle-favorite="handleToggleFavorite"
            />
          </div>
        </div>
      </div>
    </main>

    <TrailerModal
      :is-visible="showTrailerModal"
      :item="selectedItem"
      @close="showTrailerModal = false"
    />

    <ConfirmModal
      :is-visible="showConfirmModal"
      :message="confirmMessage"
      @close="showConfirmModal = false"
      @confirm="confirmRemoveFavorite"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import MovieCard from '@/components/MovieCard.vue'
import TrailerModal from '@/components/TrailerModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useFavoritesStore } from '@/stores/favorites'

export default {
  name: 'FavoritesView',
  components: {
    MovieCard,
    TrailerModal,
    ConfirmModal,
    RouterLink
  },
  setup() {
    const favoritesStore = useFavoritesStore()

    const showTrailerModal = ref(false)
    const showConfirmModal = ref(false)
    const selectedItem = ref(null)
    const itemToRemove = ref(null)
    const activeFilter = ref('all')

    const allFavorites = computed(() => favoritesStore.getFavorites)
    const favoriteMovies = computed(() => favoritesStore.getFavoriteMovies)
    const favoriteSeries = computed(() => favoritesStore.getFavoriteSeries)

    const filteredFavorites = computed(() => {
      switch (activeFilter.value) {
        case 'movies':
          return favoriteMovies.value
        case 'series':
          return favoriteSeries.value
        default:
          return allFavorites.value
      }
    })

    const confirmMessage = computed(() => {
      if (!itemToRemove.value) return ''
      const title = itemToRemove.value.title || itemToRemove.value.name
      return `Tem certeza que deseja remover "${title}" dos seus favoritos?`
    })

    const showTrailer = item => {
      selectedItem.value = item
      showTrailerModal.value = true
    }

    const handleToggleFavorite = (item, action) => {
      if (action === 'remove') {
        itemToRemove.value = item
        showConfirmModal.value = true
      }
    }

    const confirmRemoveFavorite = () => {
      if (itemToRemove.value) {
        favoritesStore.removeFromFavorites(itemToRemove.value.id, itemToRemove.value.media_type)
        itemToRemove.value = null
      }
    }

    onMounted(() => {
      favoritesStore.loadFavorites()
    })

    return {
      allFavorites,
      favoriteMovies,
      favoriteSeries,
      filteredFavorites,
      activeFilter,
      showTrailerModal,
      showConfirmModal,
      selectedItem,
      confirmMessage,
      showTrailer,
      handleToggleFavorite,
      confirmRemoveFavorite
    }
  }
}
</script>

<style lang="scss" scoped>
.favorites-view {
  min-height: 100vh;
  background-color: $background-primary;
}

.page-header {
  text-align: center;
  padding: $spacing-xxl 0 $spacing-xl 0;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: $spacing-md;
  }

  p {
    font-size: 1.1rem;
    color: $text-secondary;
  }
}

.favorites-stats {
  display: flex;
  gap: $spacing-lg;
  justify-content: center;
  margin-bottom: $spacing-xxl;

  @media (max-width: $mobile) {
    flex-direction: column;
    align-items: center;
  }
}

.stat-card {
  padding: $spacing-lg;
  text-align: center;
  min-width: 120px;

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: $accent-primary;
    margin-bottom: $spacing-sm;
  }

  .stat-label {
    color: $text-secondary;
    font-size: 0.9rem;
    font-weight: 500;
  }
}

.empty-favorites {
  text-align: center;
  padding: $spacing-xxl 0;

  .empty-icon {
    font-size: 4rem;
    margin-bottom: $spacing-lg;
  }

  h3 {
    font-size: 1.8rem;
    color: $text-primary;
    margin-bottom: $spacing-md;
  }

  p {
    font-size: 1.1rem;
    color: $text-secondary;
    margin-bottom: $spacing-xl;
  }

  .empty-actions {
    display: flex;
    gap: $spacing-md;
    justify-content: center;

    @media (max-width: $mobile) {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      padding: $spacing-md $spacing-xl;
      font-weight: 600;
    }
  }
}

.filter-tabs {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-xl;
  justify-content: center;
  flex-wrap: wrap;

  .filter-tab {
    padding: $spacing-sm $spacing-lg;
    border: 1px solid $border-color;
    background-color: $background-tertiary;
    color: $text-secondary;
    border-radius: $border-radius-md;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      background-color: $background-secondary;
      color: $text-primary;
    }

    &.active {
      background-color: $accent-primary;
      color: $text-primary;
      border-color: $accent-primary;
    }
  }
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $spacing-lg;

  @media (max-width: $mobile) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: $spacing-md;
  }
}
</style>
