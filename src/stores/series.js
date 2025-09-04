import { defineStore } from 'pinia'
import { ref } from 'vue'
import { seriesService } from '@/services/seriesService'

export const useSeriesStore = defineStore('series', () => {
  const popularSeries = ref([])
  const searchResults = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchPopularSeries = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await seriesService.getPopularSeries()
      popularSeries.value = response.results
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const searchSeries = async query => {
    if (!query.trim()) {
      searchResults.value = []
      return
    }

    loading.value = true
    error.value = null
    try {
      const response = await seriesService.searchSeries(query)
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
    popularSeries,
    searchResults,
    loading,
    error,
    fetchPopularSeries,
    searchSeries,
    clearSearch
  }
})
