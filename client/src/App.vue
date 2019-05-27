<template>
  <div id="app">
    <MainNav />
  </div>
</template>

<script>
import 'normalize.css';
import MainNav from './components/MainNav';

export default {
  name: 'App',
  components: {
    MainNav,
  },
};
</script>

<style>
:root {
  --primary-color: #5186EB;
  --white: #FFF;
}
a {
  text-decoration: none;
}
</style>
