<template>
  <div class="search-bar">
    <div class="search-input-container">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        @input="handleInput"
        @keyup.enter="handleSearch"
        class="search-input"
      />
      <button
        @click="handleSearch"
        class="search-button btn btn-primary"
        :disabled="!searchQuery.trim()"
      >
        🔍
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'SearchBar',
  props: {
    placeholder: {
      type: String,
      default: 'Pesquisar...'
    },
    debounce: {
      type: Number,
      default: 500
    }
  },
  emits: ['search', 'clear'],
  setup(props, { emit }) {
    const searchQuery = ref('')
    let debounceTimer = null

    const handleInput = () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      debounceTimer = setTimeout(() => {
        if (searchQuery.value.trim()) {
          emit('search', searchQuery.value.trim())
        } else {
          emit('clear')
        }
      }, props.debounce)
    }

    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        emit('search', searchQuery.value.trim())
      }
    }

    watch(searchQuery, newValue => {
      if (!newValue.trim()) {
        emit('clear')
      }
    })

    return {
      searchQuery,
      handleInput,
      handleSearch
    }
  }
}
</script>

<style lang="scss" scoped>
.search-bar {
  margin-bottom: $spacing-xl;
}

.search-input-container {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  gap: $spacing-sm;
}

.search-input {
  flex: 1;
  padding: $spacing-md $spacing-lg;
  border: 1px solid $border-color;
  border-radius: $border-radius-md;
  background-color: $background-card;
  color: $text-primary;
  font-size: 1.1rem;

  &:focus {
    outline: none;
    border-color: $accent-primary;
    box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
  }

  &::placeholder {
    color: $text-muted;
  }
}

.search-button {
  padding: $spacing-md $spacing-lg;
  font-size: 1.2rem;
  border-radius: $border-radius-md;
  min-width: 60px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@media (max-width: $mobile) {
  .search-input-container {
    flex-direction: column;
  }

  .search-button {
    align-self: stretch;
  }
}
</style>
