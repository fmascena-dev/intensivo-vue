import { createRouter, createWebHistory } from "vue-router";
import Home from '../pages/Home.vue';

const routes = [{ path: "/", redirect: "/home" },
    {path: "/home", component: Home},
    {path: "/movies", component: () => import('../pages/Movies.vue')},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
