import { createRouter, createWebHistory } from "vue-router";
import Home from '../pages/Home.vue';
import Movies from "../pages/Movies.vue";
import Series from "../pages/Series.vue";

const routes = [{ path: "/", redirect: "/home" },
    {path: "/home", component: Home},
    {path: "/movies", component: Movies},
    {path: "/series", component: Series}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
