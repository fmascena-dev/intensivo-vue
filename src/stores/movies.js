import { defineStore } from 'pinia'
import { ref } from 'vue'
import { movieService } from '@/services/movieService'

export const useMoviesStore = defineStore('movies', () => {
  const popularMovies = ref([])
  const searchResults = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchPopularMovies = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await movieService.getPopularMovies()
      popularMovies.value = response.results
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const searchMovies = async query => {
    if (!query.trim()) {
      searchResults.value = []
      return
    }

    loading.value = true
    error.value = null
    try {
      const response = await movieService.searchMovies(query)
      searchResults.value = response.results
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const clearSearch = () => {
    searchResults.value = []
  }

  return {
    popularMovies,
    searchResults,
    loading,
    error,
    fetchPopularMovies,
    searchMovies,
    clearSearch
  }
})
