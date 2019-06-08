// Auth is a full screen component with a slideshow on the right
// and a Log In or Sign Up form on the left.
<template>
  <main class="auth full-screen">
    <div
      class="auth-form-container"
      :class="{
        beach: randomNumer === 0,
        city: randomNumer === 1,
        farm: randomNumer === 2,
      }">
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
  data() {
    return {
      randomNumer: Math.floor(Math.random() * 3),
    };
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
  }
  .beach {
    background: url('/static/images/auth/beach-2.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center bottom;
  }
  .city {
    background: url('/static/images/auth/city-2.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center bottom;
  }
  .farm {
    background: url('/static/images/auth/farm-2.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center bottom;
  }
  .auth > * {
    flex: 1;
  }
</style>
