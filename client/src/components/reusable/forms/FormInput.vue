<template>
  <input :type="type" :value="value" :placeholder="placeholder" @input="handleInput">
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'FormInput',
  props: ['type', 'value', 'placeholder'],
  methods: {
    ...mapMutations(['setError']),
    handleInput(event) {
      this.$emit('input', event.target.value);
      this.setError('');
    },
  },
};
</script>

<style scoped>
  input {
    box-sizing: border-box;
    display: block;
    border-radius: 50px;
    border: 1px solid var(--border-gray);
    margin: 10px 0;
    width: 100%;
    padding: 10px 20px;
    outline: none;
  }

  input:disabled {
    opacity: .8;
  }

  input:focus {
    box-shadow: 0 0 0 2px var(--primary-color);
    border-color: var(--primary-color);
  }
</style>
