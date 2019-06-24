<template>
  <textarea
    :value="value"
    :placeholder="placeholder"
    @input="handleInput"
    ref="textarea"
  ></textarea>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'FormInput',
  props: ['type', 'value', 'placeholder', 'onBlur'],
  mounted() {
    this.$refs.textarea.focus();
  },
  methods: {
    ...mapMutations(['setError']),
    handleInput(event) {
      // emit 'input' so v-model can be used in parent component
      this.$emit('input', event.target.value);
      // Clear error message whenever user types
      this.setError('');
    },
  },
};
</script>

<style scoped>
  textarea {
    box-sizing: border-box;
    display: block;
    border-radius: 5px;
    border: 1px solid var(--border-gray);
    width: 100%;
    max-width: 100%;
    padding: 12.5px 15px;
    outline: none;
  }
  textarea:disabled {
    opacity: .8;
  }
  textarea:focus {
    box-shadow: 0 0 2px 2px var(--primary-color);
  }
</style>
