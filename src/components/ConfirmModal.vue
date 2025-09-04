<template>
  <Modal :is-visible="isVisible" title="Confirmar ação" @close="$emit('close')">
    <div class="confirm-modal">
      <div class="confirm-content">
        <div class="confirm-icon">⚠️</div>
        <p class="confirm-message">{{ message }}</p>
      </div>
      <div class="confirm-actions">
        <button @click="$emit('close')" class="btn btn-secondary">Cancelar</button>
        <button @click="handleConfirm" class="btn btn-primary">Confirmar</button>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from './Modal.vue'

export default {
  name: 'ConfirmModal',
  components: {
    Modal
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Tem certeza que deseja continuar?'
    }
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    const handleConfirm = () => {
      emit('confirm')
      emit('close')
    }

    return {
      handleConfirm
    }
  }
}
</script>

<style lang="scss" scoped>
.confirm-modal {
  text-align: center;
  min-width: 400px;

  @media (max-width: $mobile) {
    min-width: auto;
    width: 100%;
  }
}

.confirm-content {
  margin-bottom: $spacing-xl;

  .confirm-icon {
    font-size: 3rem;
    margin-bottom: $spacing-lg;
  }

  .confirm-message {
    font-size: 1.1rem;
    color: $text-primary;
    line-height: 1.5;
    margin: 0;
  }
}

.confirm-actions {
  display: flex;
  gap: $spacing-md;
  justify-content: center;

  .btn {
    padding: $spacing-md $spacing-xl;
    font-weight: 500;
  }

  @media (max-width: $mobile) {
    flex-direction: column;
  }
}
</style>
