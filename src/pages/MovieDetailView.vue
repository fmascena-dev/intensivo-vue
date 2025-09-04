<template>
  <div class="movie-detail">
    <div v-if="loading" class="loading">Carregando...</div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="$router.go(-1)" class="btn btn-primary">Voltar</button>
    </div>

    <div v-else-if="movie" class="movie-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <div 
          class="hero-backdrop"
          :style="backdropStyle"
        >
          <div class="hero-overlay">
            <div class="container">
              <div class="hero-content">
                <div class="movie-poster-container">
                  <img
                    v-if="movie.poster_path"
                    :src="getImageUrl(movie.poster_path, 'w500')"
                    :alt="movie.title"
                    class="movie-poster"
                  />
                  <div v-else class="no-poster">
                    <span>Sem imagem</span>
                  </div>
                </div>

                <div class="movie-info">
                  <h1 class="movie-title">{{ movie.title }}</h1>
                  
                  <div class="movie-meta">
                    <span class="year">{{ movieYear }}</span>
                    <span class="rating">⭐ {{ movieRating }}</span>
                    <span class="runtime" v-if="movie.runtime">{{ formatRuntime(movie.runtime) }}</span>
                  </div>

                  <div class="genres" v-if="movie.genres && movie.genres.length">
                    <span 
                      v-for="genre in movie.genres" 
                      :key="genre.id" 
                      class="genre-tag"
                    >
                      {{ genre.name }}
                    </span>
                  </div>

                  <p class="overview" v-if="movie.overview">{{ movie.overview }}</p>

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
      <div class="cast-section" v-if="movie.credits && movie.credits.cast && movie.credits.cast.length">
        <div class="container">
          <h2>Elenco</h2>
          <div class="cast-grid">
            <div 
              v-for="actor in movie.credits.cast.slice(0, 12)" 
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

      <!-- Similar Movies Section -->
      <div class="similar-section" v-if="movie.similar && movie.similar.results && movie.similar.results.length">
        <div class="container">
          <h2>Filmes Similares</h2>
          <div class="similar-grid">
            <MovieCard
              v-for="similarMovie in movie.similar.results.slice(0, 8)"
              :key="similarMovie.id"
              :item="similarMovie"
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
      :item="movie"
      @close="showTrailerModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { movieService } from '@/services/movieService'
import { useFavoritesStore } from '@/stores/favorites'
import { getImageUrl, getBackdropUrl } from '@/services/api'
import MovieCard from '@/components/MovieCard.vue'
import TrailerModal from '@/components/TrailerModal.vue'

const route = useRoute()
const router = useRouter()
const favoritesStore = useFavoritesStore()

const movie = ref(null)
const loading = ref(true)
const error = ref(null)
const showTrailerModal = ref(false)

const movieYear = computed(() => {
  if (!movie.value?.release_date) return 'N/A'
  return new Date(movie.value.release_date).getFullYear()
})

const movieRating = computed(() => {
  if (!movie.value?.vote_average) return 'N/A'
  return movie.value.vote_average.toFixed(1)
})

const backdropStyle = computed(() => {
  if (!movie.value?.backdrop_path) return {}
  return {
    backgroundImage: `url(${getBackdropUrl(movie.value.backdrop_path)})`
  }
})

const hasTrailer = computed(() => {
  return movie.value?.videos?.results?.some(video => 
    video.type === 'Trailer' && video.site === 'YouTube'
  )
})

const isFavorite = computed(() => {
  if (!movie.value) return false
  return favoritesStore.isFavorite(movie.value.id, 'movie')
})

const formatRuntime = (runtime) => {
  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60
  return `${hours}h ${minutes}min`
}

const fetchMovieDetails = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await movieService.getMovieDetails(route.params.id)
    movie.value = response
  } catch (err) {
    error.value = 'Erro ao carregar detalhes do filme'
    console.error('Erro ao buscar detalhes do filme:', err)
  } finally {
    loading.value = false
  }
}

const showTrailer = () => {
  showTrailerModal.value = true
}

const toggleFavorite = () => {
  if (!movie.value) return
  
  const movieData = {
    ...movie.value,
    media_type: 'movie'
  }

  if (isFavorite.value) {
    favoritesStore.removeFromFavorites(movie.value.id, 'movie')
  } else {
    favoritesStore.addToFavorites(movieData)
  }
}

const handleShowTrailer = (item) => {
  // Para filmes similares
  router.push(`/movies/${item.id}`)
}

const handleToggleFavorite = (item, action) => {
  if (action === 'remove') {
    favoritesStore.removeFromFavorites(item.id, item.media_type)
  }
}

onMounted(() => {
  fetchMovieDetails()
})
</script>

<style lang="scss" scoped>
.movie-detail {
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

.movie-poster-container {
  flex-shrink: 0;
  
  .movie-poster {
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

.movie-info {
  flex: 1;
  max-width: 600px;
}

.movie-title {
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

.movie-meta {
  display: flex;
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
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

  .runtime {
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

.cast-section, .similar-section {
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