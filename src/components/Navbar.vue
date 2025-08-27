<script>
import { onBeforeMount, onMounted, ref } from "vue";

export default {
  name: "Navbar",
  setup() {
    const letters = [
      "Todos",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
    const activeLetter = ref("Todos");
    const navbar = ref(null);

    const setActive = (letter) => {
      activeLetter.value = letter;
    };

    const scrollHorizontally = (e) => {
      const delta = Math.sign(e.deltaY);
      if (navbar.value) {
        navbar.value.scrollLeft += delta * 40;
      }
      e.preventDefault();
    };

    onMounted(() => {
      if (navbar.value) {
        navbar.value.addEventListener("wheel", scrollHorizontally, {
          passive: true,
        });
      }
    });

    onBeforeMount(() => {
      if (navbar.value) {
        navbar.value.removeEventListener("wheel", scrollHorizontally);
      }
    });

    return {
      letters,
      activeLetter,
      setActive,
      navbar,
    };
  },
};
</script>

<template>
  <section class="navbar-section">
    <nav class="navbar" ref="navbar">
      <Router-link
      to="#"
        v-for="(letter, index) in letters"
        :key="index"
        class="navlink"
        :class="{ todos: letter === 'Todos', active: activeLetter === letter }"
        @click.prevent="setActive(letter)"
      >
        {{ letter }}
      </Router-link>
    </nav>
  </section>
</template>

<style scoped>
.navbar-section {
  width: 100%;
  height: auto;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  padding-inline: 1.5rem;
}

.navbar {
  padding-block: 1rem 3rem;
  max-width: 120rem;
  width: 100%;
  display: flex;
  column-gap: 2rem;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  overscroll-behavior-inline: contain;
}

.navlink {
  color: var(--white);
  display: inline-block;
  text-decoration: none;
  text-align: center;
  background-color: var(--dark-blue);
  border: 0.1rem solid var(--gray);
  border-radius: 100vmax;
  padding: 0.2rem 2.5rem;
  font-size: 1.8rem;
  transition: all 0.3s ease;
  user-select: none;
}

.navlink:hover,
.navlink.active {
  background: var(--gray);
}

.navlink.todos {
  background: var(--medium-blue);
  border: 0.1rem solid var(--gray);
}

.navlink.todos:hover,
.navlink.todos.active {
  border: 0.1rem solid var(--gray);
}

@media (max-width: 500px) {
  .navlink {
    min-width: 7rem;
    height: 4.6rem;
    font-size: 1.4rem;
  }
}
</style>
