import { api } from './api'

export const movieService = {
  async getPopularMovies(page = 1) {
    return api.get('/movie/popular', {
      params: { page }
    })
  },

  async getTopRatedMovies(page = 1) {
    return api.get('/movie/top_rated', {
      params: { page }
    })
  },

  async getNowPlayingMovies(page = 1) {
    return api.get('/movie/now_playing', {
      params: { page }
    })
  },

  async getUpcomingMovies(page = 1) {
    return api.get('/movie/upcoming', {
      params: { page }
    })
  },

  async searchMovies(query, page = 1) {
    return api.get('/search/movie', {
      params: { query, page }
    })
  },

  async getMovieDetails(movieId) {
    return api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,credits,similar'
      }
    })
  },

  async getMovieVideos(movieId) {
    return api.get(`/movie/${movieId}/videos`)
  },

  async getMovieGenres() {
    return api.get('/genre/movie/list')
  },

  async getMoviesByGenre(genreId, page = 1) {
    return api.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc'
      }
    })
  }
}
