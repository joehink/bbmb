<template>
  <div v-if="modal" @click.self="handleClose" class="modal-container">
    <div class="modal">
      <p>{{ modalMessage }}</p>
      <div>
        <button class="btn blue" @click="hideModal" :disabled="modalDisabled">
          Cancel
        </button>
        <button
          :disabled="modalDisabled"
          class="btn"
          :class="{red: modalBtnColor === 'red'}"
          @click="modalAction"
        >
          <Spinner v-if="modalDisabled" class="btn-spinner gray" />
          {{ modalBtnText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Spinner from '../Spinner';

export default {
  name: 'Modal',
  components: {
    Spinner,
  },
  computed: {
    ...mapGetters(['modal', 'modalMessage', 'modalAction', 'modalBtnText', 'modalBtnColor', 'modalDisabled']),
  },
  methods: {
    ...mapMutations(['hideModal']),
    handleClose() {
      if (!this.modalDisabled) {
        this.hideModal();
      }
    },
  },
};
</script>

<style scoped>
  .modal-container {
    z-index: 1000;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,0.75);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal {
    background: var(--white);
    padding: 25px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
