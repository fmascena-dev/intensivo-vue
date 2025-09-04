<template>
  <Modal :is-visible="isVisible" :title="title" @close="$emit('close')">
    <div class="trailer-modal">
      <div v-if="loading" class="loading">Carregando trailer...</div>

      <div v-else-if="trailerUrl" class="trailer-container">
        <iframe
          :src="trailerUrl"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <div v-else class="no-trailer">
        <p>Trailer não disponível</p>
      </div>
    </div>
  </Modal>
</template>

<script>
import { ref, watch, computed } from 'vue'
import Modal from './Modal.vue'
import { movieService } from '@/services/movieService'
import { seriesService } from '@/services/seriesService'

export default {
  name: 'TrailerModal',
  components: {
    Modal
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: null
    }
  },
  emits: ['close'],
  setup(props) {
    const loading = ref(false)
    const trailerUrl = ref('')

    const title = computed(() => {
      if (!props.item) return ''
      return props.item.title || props.item.name
    })

    const fetchTrailer = async () => {
      if (!props.item) return

      loading.value = true
      trailerUrl.value = ''

      try {
        let response
        const mediaType = props.item.media_type || (props.item.title ? 'movie' : 'tv')

        if (mediaType === 'movie') {
          response = await movieService.getMovieVideos(props.item.id)
        } else {
          response = await seriesService.getSeriesVideos(props.item.id)
        }

        const trailer =
          response.results.find(video => video.type === 'Trailer' && video.site === 'YouTube') ||
          response.results.find(video => video.site === 'YouTube')

        if (trailer) {
          trailerUrl.value = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
        }
      } catch (error) {
        console.error('Erro ao buscar trailer:', error)
      } finally {
        loading.value = false
      }
    }

    watch(
      () => props.isVisible,
      newValue => {
        if (newValue && props.item) {
          fetchTrailer()
        } else {
          trailerUrl.value = ''
        }
      }
    )

    return {
      loading,
      trailerUrl,
      title
    }
  }
}
</script>

<style lang="scss" scoped>
.trailer-modal {
  width: 90%;
  max-width: 900px;
  min-width: 900px;

  @media (max-width: $desktop) {
    max-width: 95vw;
    min-width: auto;
  }

  @media (max-width: $tablet) {
    max-width: 90vw;
  }

  @media (max-width: $mobile) {
    max-width: 95vw;
  }
}

.trailer-container {
  position: relative;
  width: 100%;
  height: 0;
  min-height: 400px;

  @media (max-width: $tablet) {
    min-height: 400px;
  }

  @media (max-width: $mobile) {
    min-height: 250px;
  }

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: $border-radius-md;
  }
}

.loading {
  text-align: center;
  padding: $spacing-xl;
  color: $text-secondary;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-trailer {
  text-align: center;
  padding: $spacing-xl;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    color: $text-secondary;
    font-size: 1.1rem;
    margin: 0;
  }
}
</style>
