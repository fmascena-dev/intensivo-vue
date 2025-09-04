import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref([])

  const getFavorites = computed(() => favorites.value)
  const getFavoriteMovies = computed(() =>
    favorites.value.filter(item => item.media_type === 'movie')
  )
  const getFavoriteSeries = computed(() => favorites.value.filter(item => item.media_type === 'tv'))

  const addToFavorites = item => {
    const exists = favorites.value.find(
      fav => fav.id === item.id && fav.media_type === item.media_type
    )
    if (!exists) {
      favorites.value.push({ ...item, addedAt: new Date().toISOString() })
      saveFavorites()
    }
  }

  const removeFromFavorites = (id, mediaType) => {
    const index = favorites.value.findIndex(fav => fav.id === id && fav.media_type === mediaType)
    if (index !== -1) {
      favorites.value.splice(index, 1)
      saveFavorites()
    }
  }

  const isFavorite = (id, mediaType) => {
    return favorites.value.some(fav => fav.id === id && fav.media_type === mediaType)
  }

  const saveFavorites = () => {
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      favorites.value = JSON.parse(savedFavorites)
    }
  }

  const clearFavorites = () => {
    favorites.value = []
    localStorage.removeItem('favorites')
  }

  return {
    favorites,
    getFavorites,
    getFavoriteMovies,
    getFavoriteSeries,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    loadFavorites,
    clearFavorites
  }
})
