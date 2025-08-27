<script>
import { fetchMovies } from "../services/tmdb";

export default {
  data() {
    return {
      movies: [],
    };
  },
  async created() {
    const data = await fetchMovies();
    this.movies = data.results;
  },
  methods: {
    goToDetail(id) {
      this.$router.push(`/movie/${id}`);
    },
  },
};
</script>

<template>
  <div class="movies">
    <h1>Filmes 🎥</h1>
    <div class="grid">
      <div
        class="card"
        v-for="movie in movies"
        :key="movie.id"
        @click="goToDetail(movie.id)"
      >
        <img
          :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`"
          :alt="movie.title"
        />
        <h3>{{ movie.title }}</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movies {
    padding: 20px;
    color: var(--white);
}

.movies h1 {
    margin: 2rem;
    font-family: var(--font-two);
    font-size: 3.5rem;
    text-align: center;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1.5rem;
    margin-top: 5rem;
}

.card {
    cursor: pointer;
    text-align: center;
}

.card img {
    width: 100%;
    border-radius: 8px;
    border: 1px solid var(--gray);
}

</style>
