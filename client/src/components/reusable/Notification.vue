<template>
  <p class="notification">{{ message }}</p>
</template>

<script>

export default {
  name: 'Notification',
  props: ['message'],
};
</script>

<style scoped>
  .notification {
    background: green;
    color: var(--white);
    padding: 15px;
    margin: 5px 0;
    border-radius: 5px;
  }
</style>
