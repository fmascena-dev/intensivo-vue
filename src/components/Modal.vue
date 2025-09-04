<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h2 v-if="title" class="modal-title">{{ title }}</h2>
            <button @click="close" class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { watch, nextTick } from 'vue'

export default {
  name: 'Modal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    closeOnOverlay: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const close = () => {
      emit('close')
    }

    const handleOverlayClick = () => {
      if (props.closeOnOverlay) {
        close()
      }
    }

    watch(
      () => props.isVisible,
      newValue => {
        if (newValue) {
          nextTick(() => {
            document.body.style.overflow = 'hidden'
          })
        } else {
          document.body.style.overflow = ''
        }
      }
    )

    return {
      close,
      handleOverlayClick
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $overlay;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-md;
}

.modal-container {
  background-color: $background-card;
  border-radius: $border-radius-lg;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: $shadow-lg;
  position: relative;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md;
  border-bottom: 1px solid $border-color;

  .modal-title {
    margin: 0;
    color: $text-primary;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 2rem;
    color: $text-secondary;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
      background-color: $background-tertiary;
      color: $text-primary;
    }
  }
}

.modal-body {
  padding: $spacing-md;
  overflow-y: auto;
  max-height: calc(90vh - 100px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;

  .modal-container {
    transition: transform 0.3s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-container {
    transform: scale(0.8);
  }
}
</style>
