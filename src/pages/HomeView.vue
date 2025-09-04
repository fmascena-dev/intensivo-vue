<template>
  <div class="home-view">
    <main class="container">
      <section class="hero-section">
        <h1>Explore o mundo dos filmes e séries</h1>
        <p>Descubra, pesquise e adicione aos favoritos seus conteúdos preferidos</p>
      </section>

      <section class="popular-movies">
        <h2>Filmes Populares</h2>
        <div v-if="moviesStore.loading" class="loading"></div>
        <div v-else class="movies-grid">
          <MovieCard
            v-for="movie in displayedMovies"
            :key="movie.id"
            :item="movie"
            @show-trailer="showTrailer"
            @toggle-favorite="handleToggleFavorite"
          />
        </div>
        <div class="section-footer">
          <RouterLink to="/movies" class="btn btn-primary"> Ver todos os filmes </RouterLink>
        </div>
      </section>

      <section class="popular-series">
        <h2>Séries Populares</h2>
        <div v-if="seriesStore.loading" class="loading"></div>
        <div v-else class="movies-grid">
          <MovieCard
            v-for="series in displayedSeries"
            :key="series.id"
            :item="series"
            @show-trailer="showTrailer"
            @toggle-favorite="handleToggleFavorite"
          />
        </div>
        <div class="section-footer">
          <RouterLink to="/series" class="btn btn-primary"> Ver todas as séries </RouterLink>
        </div>
      </section>
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
import { useMoviesStore } from '@/stores/movies'
import { useSeriesStore } from '@/stores/series'
import { useFavoritesStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'HomeView',
  components: {
    MovieCard,
    TrailerModal,
    ConfirmModal,
    RouterLink
  },
  setup() {
    const moviesStore = useMoviesStore()
    const seriesStore = useSeriesStore()
    const favoritesStore = useFavoritesStore()
    const authStore = useAuthStore()

    const showTrailerModal = ref(false)
    const showConfirmModal = ref(false)
    const selectedItem = ref(null)
    const itemToRemove = ref(null)

    const displayedMovies = computed(() => moviesStore.popularMovies.slice(0, 8))

    const displayedSeries = computed(() => seriesStore.popularSeries.slice(0, 8))

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

    onMounted(async () => {
      authStore.initializeAuth()
      favoritesStore.loadFavorites()

      await Promise.all([moviesStore.fetchPopularMovies(), seriesStore.fetchPopularSeries()])
    })

    return {
      moviesStore,
      seriesStore,
      displayedMovies,
      displayedSeries,
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
.home-view {
  min-height: 100vh;
  background-color: $background-primary;
}

.hero-section {
  text-align: center;
  padding: $spacing-xxl 0;
  background: linear-gradient(135deg, $background-secondary 0%, $background-tertiary 100%);
  margin-bottom: $spacing-xxl;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: $spacing-lg;
    background: linear-gradient(135deg, $text-primary 0%, $accent-primary 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: $mobile) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.2rem;
    color: $text-secondary;
    max-width: 600px;
    margin: 0 auto;

    @media (max-width: $mobile) {
      font-size: 1rem;
    }
  }
}

section {
  margin-bottom: $spacing-xxl;

  h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: $spacing-xl;
    color: $text-primary;
    border-left: 4px solid $accent-primary;
    padding-left: $spacing-md;
  }
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;

  @media (max-width: $mobile) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: $spacing-md;
  }
}

.section-footer {
  text-align: center;

  .btn {
    padding: $spacing-md $spacing-xl;
    font-size: 1.1rem;
    font-weight: 600;
  }
}
</style>
