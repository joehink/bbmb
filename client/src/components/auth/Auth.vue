<template>
  <main class="auth full-screen">
    <router-view></router-view>
    <SlideShow />
  </main>
</template>

<script>
import SlideShow from '../SlideShow';

export default {
  name: 'Auth',
  components: {
    SlideShow,
  },
};
</script>

<style scoped>
  .auth {
    height: 100%;
    display: flex;
  }

  .auth > * {
    width: 50%;
    flex: 1;
    height: 100%;
  }
</style>
