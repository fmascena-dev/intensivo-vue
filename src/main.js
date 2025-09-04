import "./assets/styles/main.scss";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { useAuthStore } from "./stores/auth";
import { useFavoritesStore } from "./stores/favorites";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize stores from localStorage
const authStore = useAuthStore();
authStore.initializeAuth();

const favoritesStore = useFavoritesStore();
favoritesStore.loadFavorites();

app.mount("#app");
