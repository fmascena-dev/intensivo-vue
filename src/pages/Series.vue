<script>
import { fetchSeries } from "../services/tmdb";

export default {
  data() {
    return {
      series: [],
    };
  },
  async created() {
    const data = await fetchSeries();
    this.series = data.results;
  },
  methods: {
    goToDetail(id) {
      this.$router.push(`/series/${id}`);
    },
  },
};
</script>

<template>
  <section class="series">
    <h1>Séries Populares</h1>
    <div
      class="grid"
      v-for="serie in series"
      :key="serie.id"
      @click="goToDetail(serie.id)"
    >
        <img
          :src="`https://image.tmdb.org/t/p/w300${serie.poster_path}`"
          :alt="serie.name"
        />
        <h3>{{ serie.name }}</h3>
    </div>
  </section>
</template>

<style scoped>
.series {
  padding: 20px;
  color: var(--white);
  border: 1px solid red;
}

.series h1 {
  margin: 2rem 0;
  font-family: var(--font-two);
  font-size: 3.5rem;
  text-align: center;
}

.series h3 {
  margin-top: 0.5rem;
  font-size: 1.8rem;
  color: var(--text-gray);
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 5rem;
  border: 1px solid red;
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
