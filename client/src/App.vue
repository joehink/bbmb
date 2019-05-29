<template>
  <div id="app">
    <MainNav />
    <router-view></router-view>
  </div>
</template>

<script>
import 'normalize.css';
import MainNav from '@/components/MainNav';

export default {
  name: 'App',
  components: {
    MainNav,
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');

:root {
  --primary-color: #5186EB;
  --white: #FFF;

  font-family: 'Roboto', sans-serif;
}
html, body, #app {
  height: 100%;
  min-height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
}
.full-screen {
  flex: 1;
}
a {
  text-decoration: none;
}
button {
  cursor: pointer;
  outline: none;
}
.container {
  max-width: 1200px;
  margin: auto;
}
</style>
