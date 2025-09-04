<template>
  <div class="series-view">
    <main class="container">
      <header class="page-header">
        <h1>Séries</h1>
        <p>Descubra as melhores séries e adicione aos seus favoritos</p>
      </header>

      <SearchBar
        placeholder="Pesquisar séries..."
        @search="handleSearch"
        @clear="handleClearSearch"
      />

      <div class="content-section">
        <h2 v-if="isSearching">Resultados da pesquisa</h2>
        <h2 v-else>Séries Populares</h2>

        <div v-if="seriesStore.loading" class="loading"></div>

        <div v-else-if="displayedSeries.length > 0" class="series-grid">
          <MovieCard
            v-for="series in displayedSeries"
            :key="series.id"
            :item="series"
            @show-trailer="showTrailer"
            @toggle-favorite="handleToggleFavorite"
          />
        </div>

        <div v-else-if="isSearching" class="no-results">
          <p>Nenhuma série encontrada para sua pesquisa.</p>
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
import { useSeriesStore } from '@/stores/series'
import { useFavoritesStore } from '@/stores/favorites'

export default {
  name: 'SeriesView',
  components: {
    SearchBar,
    MovieCard,
    TrailerModal,
    ConfirmModal
  },
  setup() {
    const seriesStore = useSeriesStore()
    const favoritesStore = useFavoritesStore()

    const showTrailerModal = ref(false)
    const showConfirmModal = ref(false)
    const selectedItem = ref(null)
    const itemToRemove = ref(null)
    const isSearching = ref(false)

    const displayedSeries = computed(() => {
      return isSearching.value ? seriesStore.searchResults : seriesStore.popularSeries
    })

    const confirmMessage = computed(() => {
      if (!itemToRemove.value) return ''
      return `Tem certeza que deseja remover "${itemToRemove.value.name}" dos seus favoritos?`
    })

    const handleSearch = async query => {
      isSearching.value = true
      await seriesStore.searchSeries(query)
    }

    const handleClearSearch = () => {
      isSearching.value = false
      seriesStore.clearSearch()
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
          itemToRemove.value.media_type || 'tv'
        )
        itemToRemove.value = null
      }
    }

    onMounted(async () => {
      favoritesStore.loadFavorites()
      if (seriesStore.popularSeries.length === 0) {
        await seriesStore.fetchPopularSeries()
      }
    })

    return {
      seriesStore,
      displayedSeries,
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
.series-view {
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

.series-grid {
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
