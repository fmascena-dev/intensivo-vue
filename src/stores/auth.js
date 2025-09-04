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
    try {
      const savedAuth = localStorage.getItem('auth')
      if (savedAuth) {
        const authData = JSON.parse(savedAuth)
        if (authData.isAuthenticated && authData.user) {
          isAuthenticated.value = true
          user.value = authData.user
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      // Clear invalid data
      localStorage.removeItem('auth')
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
