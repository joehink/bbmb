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
  --black: #2A2B2A;
  --white: #F7F4F3;
  --gray: #F5F5F5;
  --border-gray: silver;
  --gray-text: #555;
  --error-red: #E84855;

  color: var(--black);
  font-family: 'Roboto', sans-serif;
}

* {
  box-sizing: border-box;
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

.text-center {
  text-align: center;
}

a {
  text-decoration: none;
}

button {
  outline: none;
  cursor: pointer;
}

.container {
  max-width: 1200px;
  margin: auto;
}

/* Headings */
h1 {
  font-weight: bold;
  font-size: 2em;
  margin: 5px 0;
}

h4 {
  color: var(--gray-text);
  font-weight: normal;
  font-size: 1.2em;
  margin: 5px 0;
}

/* Buttons */
.btn {
  border: none;
  border-radius: 50px;
  text-decoration: none;
  padding: 10px 20px;
  cursor: pointer;
  outline: none;
}

.btn:disabled {
  opacity: .8;
}

.btn:hover {
  opacity: .8;
}

.btn.blue {
  background: var(--primary-color);
  color: var(--white);
}
</style>
