<template>
  <div class="movie-card card">
    <div class="movie-poster">
      <img
        v-if="item.poster_path"
        :src="getImageUrl(item.poster_path)"
        :alt="title"
        loading="lazy"
      />
      <div v-else class="no-image">
        <span>Sem imagem</span>
      </div>

      <div class="movie-overlay">
        <div class="movie-actions">
          <button
            @click="goToDetail"
            class="btn btn-secondary btn-sm"
            title="Ver detalhes"
          >
            ℹ️
          </button>
          <button
            @click="$emit('showTrailer', item)"
            class="btn btn-primary btn-sm"
            title="Ver trailer"
          >
            ▶
          </button>
          <button
            @click="toggleFavorite"
            class="btn btn-ghost btn-sm"
            :title="isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
          >
            {{ isFavorite ? '❤️' : '🤍' }}
          </button>
        </div>
      </div>
    </div>

    <div class="movie-info">
      <h3 class="movie-title">{{ title }}</h3>
      <div class="movie-details">
        <span class="movie-year">{{ year }}</span>
        <span class="movie-rating">⭐ {{ rating }}</span>
      </div>
      <p class="movie-overview">{{ overview }}</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'
import { getImageUrl } from '@/services/api'

export default {
  name: 'MovieCard',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['showTrailer', 'toggleFavorite'],
  setup(props, { emit }) {
    const router = useRouter()
    const favoritesStore = useFavoritesStore()

    const title = computed(() => {
      return props.item.title || props.item.name
    })

    const year = computed(() => {
      const date = props.item.release_date || props.item.first_air_date
      return date ? new Date(date).getFullYear() : 'N/A'
    })

    const rating = computed(() => {
      return props.item.vote_average ? props.item.vote_average.toFixed(1) : 'N/A'
    })

    const overview = computed(() => {
      const text = props.item.overview || 'Sem descrição disponível'
      return text.length > 150 ? text.substring(0, 150) + '...' : text
    })

    const isFavorite = computed(() => {
      const mediaType = props.item.media_type || (props.item.title ? 'movie' : 'tv')
      return favoritesStore.isFavorite(props.item.id, mediaType)
    })

    const toggleFavorite = () => {
      const mediaType = props.item.media_type || (props.item.title ? 'movie' : 'tv')

      if (isFavorite.value) {
        emit('toggleFavorite', { ...props.item, media_type: mediaType }, 'remove')
      } else {
        favoritesStore.addToFavorites({ ...props.item, media_type: mediaType })
        emit('toggleFavorite', { ...props.item, media_type: mediaType }, 'add')
      }
    }

    const goToDetail = () => {
      const mediaType = props.item.media_type || (props.item.title ? 'movie' : 'tv')
      const route = mediaType === 'movie' ? `/movies/${props.item.id}` : `/series/${props.item.id}`
      router.push(route)
    }

    return {
      title,
      year,
      rating,
      overview,
      isFavorite,
      toggleFavorite,
      goToDetail,
      getImageUrl
    }
  }
}
</script>

<style lang="scss" scoped>
.movie-card {
  position: relative;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: $shadow-lg;

    .movie-overlay {
      opacity: 1;
    }
  }
}

.movie-poster {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .no-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $background-tertiary;
    color: $text-muted;
  }
}

.movie-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-actions {
  display: flex;
  gap: $spacing-sm;

  .btn-sm {
    // padding: $spacing-sm;
    font-size: 1.2rem;
    min-width: 40px;
    height: 40px;
    border-radius: 20px;
  }
}

.movie-info {
  padding: $spacing-md;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.movie-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: $spacing-sm;
  color: $text-primary;
  line-height: 1.3;
}

.movie-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-sm;
  font-size: 0.9rem;

  .movie-year {
    color: $text-secondary;
  }

  .movie-rating {
    color: $accent-primary;
    font-weight: 500;
  }
}

.movie-overview {
  color: $text-secondary;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-top: auto;
}
</style>
