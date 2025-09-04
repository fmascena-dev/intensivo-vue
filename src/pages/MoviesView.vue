<template>
  <div class="movies-view">
    <main class="container">
      <header class="page-header">
        <h1>Filmes</h1>
        <p>Descubra os melhores filmes e adicione aos seus favoritos</p>
      </header>

      <SearchBar
        placeholder="Pesquisar filmes..."
        @search="handleSearch"
        @clear="handleClearSearch"
      />

      <div class="content-section">
        <h2 v-if="isSearching">Resultados da pesquisa</h2>
        <h2 v-else>Filmes Populares</h2>

        <div v-if="moviesStore.loading" class="loading"></div>

        <div v-else-if="displayedMovies.length > 0" class="movies-grid">
          <MovieCard
            v-for="movie in displayedMovies"
            :key="movie.id"
            :item="movie"
            @show-trailer="showTrailer"
            @toggle-favorite="handleToggleFavorite"
          />
        </div>

        <div v-else-if="isSearching" class="no-results">
          <p>Nenhum filme encontrado para sua pesquisa.</p>
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
import SearchBar from '@/components/SearchBar.vue'
import MovieCard from '@/components/MovieCard.vue'
import TrailerModal from '@/components/TrailerModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useMoviesStore } from '@/stores/movies'
import { useFavoritesStore } from '@/stores/favorites'

export default {
  name: 'MoviesView',
  components: {
    SearchBar,
    MovieCard,
    TrailerModal,
    ConfirmModal
  },
  setup() {
    const moviesStore = useMoviesStore()
    const favoritesStore = useFavoritesStore()

    const showTrailerModal = ref(false)
    const showConfirmModal = ref(false)
    const selectedItem = ref(null)
    const itemToRemove = ref(null)
    const isSearching = ref(false)

    const displayedMovies = computed(() => {
      return isSearching.value ? moviesStore.searchResults : moviesStore.popularMovies
    })

    const confirmMessage = computed(() => {
      if (!itemToRemove.value) return ''
      return `Tem certeza que deseja remover "${itemToRemove.value.title}" dos seus favoritos?`
    })

    const handleSearch = async query => {
      isSearching.value = true
      await moviesStore.searchMovies(query)
    }

    const handleClearSearch = () => {
      isSearching.value = false
      moviesStore.clearSearch()
    }

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
        favoritesStore.removeFromFavorites(
          itemToRemove.value.id,
          itemToRemove.value.media_type || 'movie'
        )
        itemToRemove.value = null
      }
    }

    onMounted(async () => {
      favoritesStore.loadFavorites()
      if (moviesStore.popularMovies.length === 0) {
        await moviesStore.fetchPopularMovies()
      }
    })

    return {
      moviesStore,
      displayedMovies,
      isSearching,
      showTrailerModal,
      showConfirmModal,
      selectedItem,
      confirmMessage,
      handleSearch,
      handleClearSearch,
      showTrailer,
      handleToggleFavorite,
      confirmRemoveFavorite
    }
  }
}
</script>

<style lang="scss" scoped>
.movies-view {
  min-height: 100vh;
  background-color: $background-primary;
}

.page-header {
  text-align: center;
  padding: $spacing-xxl 0;
  margin-bottom: $spacing-xl;

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

.content-section {
  h2 {
    font-size: 1.8rem;
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

  @media (max-width: $mobile) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: $spacing-md;
  }
}

.no-results {
  text-align: center;
  padding: $spacing-xxl 0;

  p {
    font-size: 1.2rem;
    color: $text-secondary;
    margin: 0;
  }
}
</style>
