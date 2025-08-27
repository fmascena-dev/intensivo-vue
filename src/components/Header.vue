<script setup>
import Navbar from './Navbar.vue';

</script>

<template>
  <header>
    <img src="/logo.png" alt="logo filmes & series" />
    <nav>
      <Router-link to="/home">Home</Router-link>
      <Router-link to="/movies">Filmes</Router-link>
      <Router-link to="/series">Séries</Router-link>
    </nav>
  </header>
  <Navbar />
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

img {
  width: 25%;
}

nav {
  display: flex;
  justify-content: space-between;
  width: 25%;
}

nav a {
  text-decoration: none;
  color: #FFF;
  font-weight: bold;
  font-size: 2rem;
}
</style>
