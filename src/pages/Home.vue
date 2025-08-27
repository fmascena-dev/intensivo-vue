<script>
export default {
  name: 'Home'
}
</script>

<template>
  <section class="home">
    <div>
      <h1>Bem-vindo ao Catálogo 🎥</h1>
      <p>Escolha entre filmes e séries no menu acima.</p>
    </div>
  </section>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  gap: 1rem;
  text-align: center;
  margin-top: 2rem;
  position: relative;
  background-image: url('../assets/images/filmes-cartaz.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.home::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.home div {
  position: relative;
  z-index: 2;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h1 {
  font-family: var(--font-two);
  font-size: 4.5rem;
  letter-spacing: 3px;
  color: #FFF;
  z-index: 2;
}

p {
  font-family: var(--font-two);
  font-size: 2rem;
  letter-spacing: 2px;
  color: #FFF;
  z-index: 2;
}

</style>
