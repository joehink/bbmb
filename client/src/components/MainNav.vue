<template>
  <nav class="nav">
    <span class="nav-brand"><a href="/">BBMB</a></span>
  </nav>
</template>

<script>
export default {
  name: 'MainNav',
};
</script>

<style>
  .nav {
    background: var(--primary-color);
    display: flex;
  }
  .nav * {
    color: var(--white);
  }
</style>

