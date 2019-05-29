<template>
  <input :type="type" :value="value" @input="handleInput">
</template>

<script>
export default {
  name: 'FormInput',
  props: ['type', 'value'],
  methods: {
    handleInput(event) {
      this.$emit('input', event.target.value);
    },
  },
};
</script>

<style scoped>

</style>
