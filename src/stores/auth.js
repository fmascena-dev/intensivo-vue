import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)

  const login = userData => {
    isAuthenticated.value = true
    user.value = userData
    localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user: userData }))
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    localStorage.removeItem('auth')
  }

  const initializeAuth = () => {
    const savedAuth = localStorage.getItem('auth')
    if (savedAuth) {
      const authData = JSON.parse(savedAuth)
      isAuthenticated.value = authData.isAuthenticated
      user.value = authData.user
    }
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
    initializeAuth
  }
})
