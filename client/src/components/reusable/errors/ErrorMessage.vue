<template>
  <p class="error" v-if="error">{{ error }}</p>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'LogInForm',
  computed: {
    ...mapGetters(['error']),
  },
};
</script>

<style scoped>
  .error {
    background: var(--error-red);
    color: var(--white);
    padding: 15px;
    margin: 5px 0;
    border-radius: 5px;
  }
</style>
