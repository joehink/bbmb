// Auth is a full screen component with a slideshow on the right
// and a Log In or Sign Up form on the left.
<template>
  <main class="auth full-screen">
    <div class="auth-form-container">
      <router-view></router-view>
    </div>
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
    display: flex;
  }
  .auth-form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--gray);
  }
  .auth > * {
    flex: 1;
  }
</style>
