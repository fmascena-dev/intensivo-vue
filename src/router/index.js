import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/pages/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/movies',
      name: 'Movies',
      component: () => import('@/pages/MoviesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/series',
      name: 'Series',
      component: () => import('@/pages/SeriesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: () => import('@/pages/FavoritesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/movies/:id',
      name: 'MovieDetail',
      component: () => import('@/pages/MovieDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/series/:id',
      name: 'SerieDetail',
      component: () => import('@/pages/SerieDetailView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
