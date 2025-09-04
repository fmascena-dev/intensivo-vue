import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR'
  }
})

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null
  return `${IMAGE_BASE_URL}/${size}${path}`
}

export const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return null
  return `${IMAGE_BASE_URL}/${size}${path}`
}

api.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const message = error.response?.data?.status_message || 'Erro na requisição'
    return Promise.reject(new Error(message))
  }
)
