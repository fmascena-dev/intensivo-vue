import { api } from './api'

export const seriesService = {
  async getPopularSeries(page = 1) {
    return api.get('/tv/popular', {
      params: { page }
    })
  },

  async getTopRatedSeries(page = 1) {
    return api.get('/tv/top_rated', {
      params: { page }
    })
  },

  async getAiringTodaySeries(page = 1) {
    return api.get('/tv/airing_today', {
      params: { page }
    })
  },

  async getOnTheAirSeries(page = 1) {
    return api.get('/tv/on_the_air', {
      params: { page }
    })
  },

  async searchSeries(query, page = 1) {
    return api.get('/search/tv', {
      params: { query, page }
    })
  },

  async getSeriesDetails(seriesId) {
    return api.get(`/tv/${seriesId}`, {
      params: {
        append_to_response: 'videos,credits,similar'
      }
    })
  },

  async getSeriesVideos(seriesId) {
    return api.get(`/tv/${seriesId}/videos`)
  },

  async getSeriesGenres() {
    return api.get('/genre/tv/list')
  },

  async getSeriesByGenre(genreId, page = 1) {
    return api.get('/discover/tv', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc'
      }
    })
  }
}
