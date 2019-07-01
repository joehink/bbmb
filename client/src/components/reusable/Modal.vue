<template>
  <div v-if="modal" @click="hideModal" class="modal-container">
    <div class="modal">
      <p>{{ modalMessage }}</p>
      <div>
        <button class="btn blue" @click="hideModal">
          Cancel
        </button>
        <button class="btn" :class="{red: modalBtnColor === 'red'}" @click="modalAction">
          {{ modalBtnText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Modal',
  computed: {
    ...mapGetters(['modal', 'modalMessage', 'modalAction', 'modalBtnText', 'modalBtnColor']),
  },
  methods: {
    ...mapMutations(['hideModal']),
  },
};
</script>

<style scoped>
  .modal-container {
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
