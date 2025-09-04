<template>
  <div class="serie-detail">
    <div v-if="loading" class="loading">Carregando...</div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="$router.go(-1)" class="btn btn-primary">Voltar</button>
    </div>

    <div v-else-if="serie" class="serie-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <div 
          class="hero-backdrop"
          :style="backdropStyle"
        >
          <div class="hero-overlay">
            <div class="container">
              <div class="hero-content">
                <div class="serie-poster-container">
                  <img
                    v-if="serie.poster_path"
                    :src="getImageUrl(serie.poster_path, 'w500')"
                    :alt="serie.name"
                    class="serie-poster"
                  />
                  <div v-else class="no-poster">
                    <span>Sem imagem</span>
                  </div>
                </div>

                <div class="serie-info">
                  <h1 class="serie-title">{{ serie.name }}</h1>
                  
                  <div class="serie-meta">
                    <span class="year">{{ serieYear }}</span>
                    <span class="rating">⭐ {{ serieRating }}</span>
                    <span class="status" v-if="serie.status">{{ translateStatus(serie.status) }}</span>
                  </div>

                  <div class="serie-details" v-if="serie.number_of_seasons || serie.number_of_episodes">
                    <span v-if="serie.number_of_seasons" class="seasons">
                      {{ serie.number_of_seasons }} {{ serie.number_of_seasons === 1 ? 'Temporada' : 'Temporadas' }}
                    </span>
                    <span v-if="serie.number_of_episodes" class="episodes">
                      {{ serie.number_of_episodes }} {{ serie.number_of_episodes === 1 ? 'Episódio' : 'Episódios' }}
                    </span>
                  </div>

                  <div class="genres" v-if="serie.genres && serie.genres.length">
                    <span 
                      v-for="genre in serie.genres" 
                      :key="genre.id" 
                      class="genre-tag"
                    >
                      {{ genre.name }}
                    </span>
                  </div>

                  <p class="overview" v-if="serie.overview">{{ serie.overview }}</p>

                  <div class="action-buttons">
                    <button
                      @click="showTrailer"
                      class="btn btn-primary"
                      v-if="hasTrailer"
                    >
                      ▶ Assistir Trailer
                    </button>
                    <button
                      @click="toggleFavorite"
                      class="btn btn-secondary"
                      :class="{ 'favorited': isFavorite }"
                    >
                      {{ isFavorite ? '❤️' : '🤍' }} {{ isFavorite ? 'Favorito' : 'Favoritar' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cast Section -->
      <div class="cast-section" v-if="serie.credits && serie.credits.cast && serie.credits.cast.length">
        <div class="container">
          <h2>Elenco</h2>
          <div class="cast-grid">
            <div 
              v-for="actor in serie.credits.cast.slice(0, 12)" 
              :key="actor.id"
              class="cast-card"
            >
              <div class="actor-photo">
                <img
                  v-if="actor.profile_path"
                  :src="getImageUrl(actor.profile_path, 'w185')"
                  :alt="actor.name"
                  loading="lazy"
                />
                <div v-else class="no-photo">
                  <span>👤</span>
                </div>
              </div>
              <div class="actor-info">
                <h4 class="actor-name">{{ actor.name }}</h4>
                <p class="character-name">{{ actor.character }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seasons Section -->
      <div class="seasons-section" v-if="serie.seasons && serie.seasons.length">
        <div class="container">
          <h2>Temporadas</h2>
          <div class="seasons-grid">
            <div 
              v-for="season in serie.seasons.filter(s => s.season_number > 0)" 
              :key="season.id"
              class="season-card card"
            >
              <div class="season-poster">
                <img
                  v-if="season.poster_path"
                  :src="getImageUrl(season.poster_path, 'w300')"
                  :alt="`Temporada ${season.season_number}`"
                  loading="lazy"
                />
                <div v-else class="no-season-poster">
                  <span>📺</span>
                </div>
              </div>
              <div class="season-info">
                <h4 class="season-name">{{ season.name }}</h4>
                <p class="season-meta">
                  <span v-if="season.episode_count">{{ season.episode_count }} episódios</span>
                  <span v-if="season.air_date"> • {{ formatSeasonYear(season.air_date) }}</span>
                </p>
                <p class="season-overview" v-if="season.overview">
                  {{ season.overview.length > 120 ? season.overview.substring(0, 120) + '...' : season.overview }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Similar Series Section -->
      <div class="similar-section" v-if="serie.similar && serie.similar.results && serie.similar.results.length">
        <div class="container">
          <h2>Séries Similares</h2>
          <div class="similar-grid">
            <MovieCard
              v-for="similarSerie in serie.similar.results.slice(0, 8)"
              :key="similarSerie.id"
              :item="{ ...similarSerie, media_type: 'tv' }"
              @showTrailer="handleShowTrailer"
              @toggleFavorite="handleToggleFavorite"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Trailer Modal -->
    <TrailerModal
      :isVisible="showTrailerModal"
      :item="serie ? { ...serie, media_type: 'tv' } : null"
      @close="showTrailerModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { seriesService } from '@/services/seriesService'
import { useFavoritesStore } from '@/stores/favorites'
import { getImageUrl, getBackdropUrl } from '@/services/api'
import MovieCard from '@/components/MovieCard.vue'
import TrailerModal from '@/components/TrailerModal.vue'

const route = useRoute()
const router = useRouter()
const favoritesStore = useFavoritesStore()

const serie = ref(null)
const loading = ref(true)
const error = ref(null)
const showTrailerModal = ref(false)

const serieYear = computed(() => {
  if (!serie.value?.first_air_date) return 'N/A'
  return new Date(serie.value.first_air_date).getFullYear()
})

const serieRating = computed(() => {
  if (!serie.value?.vote_average) return 'N/A'
  return serie.value.vote_average.toFixed(1)
})

const backdropStyle = computed(() => {
  if (!serie.value?.backdrop_path) return {}
  return {
    backgroundImage: `url(${getBackdropUrl(serie.value.backdrop_path)})`
  }
})

const hasTrailer = computed(() => {
  return serie.value?.videos?.results?.some(video => 
    video.type === 'Trailer' && video.site === 'YouTube'
  )
})

const isFavorite = computed(() => {
  if (!serie.value) return false
  return favoritesStore.isFavorite(serie.value.id, 'tv')
})

const translateStatus = (status) => {
  const statusMap = {
    'Returning Series': 'Em Exibição',
    'Ended': 'Finalizada',
    'Canceled': 'Cancelada',
    'In Production': 'Em Produção',
    'Pilot': 'Piloto'
  }
  return statusMap[status] || status
}

const formatSeasonYear = (date) => {
  if (!date) return ''
  return new Date(date).getFullYear()
}

const fetchSerieDetails = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await seriesService.getSeriesDetails(route.params.id)
    serie.value = response
  } catch (err) {
    error.value = 'Erro ao carregar detalhes da série'
    console.error('Erro ao buscar detalhes da série:', err)
  } finally {
    loading.value = false
  }
}

const showTrailer = () => {
  showTrailerModal.value = true
}

const toggleFavorite = () => {
  if (!serie.value) return
  
  const serieData = {
    ...serie.value,
    media_type: 'tv'
  }

  if (isFavorite.value) {
    favoritesStore.removeFromFavorites(serie.value.id, 'tv')
  } else {
    favoritesStore.addToFavorites(serieData)
  }
}

const handleShowTrailer = (item) => {
  // Para séries similares
  router.push(`/series/${item.id}`)
}

const handleToggleFavorite = (item, action) => {
  if (action === 'remove') {
    favoritesStore.removeFromFavorites(item.id, item.media_type)
  }
}

onMounted(() => {
  fetchSerieDetails()
})
</script>

<style lang="scss" scoped>
.serie-detail {
  min-height: 100vh;
}

.loading, .error {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  flex-direction: column;
  gap: $spacing-md;
}

.hero-section {
  position: relative;
  min-height: 100vh;
}

.hero-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
  display: flex;
  align-items: center;
}

.hero-content {
  display: flex;
  gap: $spacing-xxl;
  align-items: flex-start;
  
  @media (max-width: $tablet) {
    flex-direction: column;
    gap: $spacing-xl;
    align-items: center;
    text-align: center;
  }
}

.serie-poster-container {
  flex-shrink: 0;
  
  .serie-poster {
    width: 300px;
    height: 450px;
    object-fit: cover;
    border-radius: $border-radius-lg;
    box-shadow: $shadow-lg;
    
    @media (max-width: $tablet) {
      width: 250px;
      height: 375px;
    }
  }

  .no-poster {
    width: 300px;
    height: 450px;
    background-color: $background-tertiary;
    border-radius: $border-radius-lg;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-muted;
    font-size: 1.2rem;
    
    @media (max-width: $tablet) {
      width: 250px;
      height: 375px;
    }
  }
}

.serie-info {
  flex: 1;
  max-width: 600px;
}

.serie-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: $spacing-md;
  line-height: 1.2;
  
  @media (max-width: $tablet) {
    font-size: 2.5rem;
  }
  
  @media (max-width: $mobile) {
    font-size: 2rem;
  }
}

.serie-meta {
  display: flex;
  gap: $spacing-lg;
  margin-bottom: $spacing-md;
  font-size: 1.1rem;
  
  @media (max-width: $mobile) {
    flex-direction: column;
    gap: $spacing-sm;
  }

  .year {
    color: $text-secondary;
  }

  .rating {
    color: $accent-primary;
    font-weight: 500;
  }

  .status {
    color: $text-secondary;
  }
}

.serie-details {
  display: flex;
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
  font-size: 1rem;
  
  @media (max-width: $mobile) {
    flex-direction: column;
    gap: $spacing-sm;
  }

  .seasons, .episodes {
    color: $text-secondary;
  }
}

.genres {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;
  flex-wrap: wrap;

  .genre-tag {
    background-color: $background-tertiary;
    padding: $spacing-xs $spacing-md;
    border-radius: $border-radius-sm;
    font-size: 0.9rem;
    color: $text-secondary;
    border: 1px solid $border-color;
  }
}

.overview {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: $spacing-xl;
  color: $text-secondary;
}

.action-buttons {
  display: flex;
  gap: $spacing-md;
  
  @media (max-width: $mobile) {
    flex-direction: column;
  }

  .btn {
    padding: $spacing-md $spacing-xl;
    font-size: 1.1rem;
    font-weight: 600;

    &.favorited {
      background-color: $accent-primary;
      color: white;
    }
  }
}

.cast-section, .seasons-section, .similar-section {
  padding: $spacing-xxl 0;

  h2 {
    font-size: 2rem;
    margin-bottom: $spacing-xl;
    color: $text-primary;
  }
}

.cast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: $spacing-lg;
  
  @media (max-width: $mobile) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: $spacing-md;
  }
}

.cast-card {
  text-align: center;
  
  .actor-photo {
    margin-bottom: $spacing-sm;
    
    img {
      width: 100%;
      aspect-ratio: 2/3;
      object-fit: cover;
      border-radius: $border-radius-md;
    }

    .no-photo {
      width: 100%;
      aspect-ratio: 2/3;
      background-color: $background-tertiary;
      border-radius: $border-radius-md;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: $text-muted;
    }
  }

  .actor-info {
    .actor-name {
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: $spacing-xs;
      color: $text-primary;
    }

    .character-name {
      font-size: 0.8rem;
      color: $text-secondary;
      margin: 0;
    }
  }
}

.seasons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $spacing-lg;
  
  @media (max-width: $mobile) {
    grid-template-columns: 1fr;
    gap: $spacing-md;
  }
}

.season-card {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md;

  .season-poster {
    flex-shrink: 0;
    width: 80px;
    
    img {
      width: 100%;
      aspect-ratio: 2/3;
      object-fit: cover;
      border-radius: $border-radius-sm;
    }

    .no-season-poster {
      width: 100%;
      aspect-ratio: 2/3;
      background-color: $background-tertiary;
      border-radius: $border-radius-sm;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: $text-muted;
    }
  }

  .season-info {
    flex: 1;

    .season-name {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: $spacing-xs;
      color: $text-primary;
    }

    .season-meta {
      font-size: 0.9rem;
      color: $text-secondary;
      margin-bottom: $spacing-sm;
    }

    .season-overview {
      font-size: 0.9rem;
      color: $text-secondary;
      line-height: 1.4;
      margin: 0;
    }
  }
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-lg;
  
  @media (max-width: $mobile) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: $spacing-md;
  }
}
</style>