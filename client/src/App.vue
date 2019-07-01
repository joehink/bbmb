<template>
  <div id="app">
    <MainNav />
    <keep-alive include="CategoryPosts">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import 'normalize.css';
import { mapActions } from 'vuex';
import MainNav from '@/components/MainNav';

export default {
  name: 'App',
  components: {
    MainNav,
  },
  created() {
    // Fetch the logged in user when app is created
    this.getCurrentUser();
  },
  methods: {
    ...mapActions(['getCurrentUser']),
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');

:root {
  /* Colors */
  --primary-color: #5186EB;
  --black: #2A2B2A;
  --white: #FFF;
  --gray: #F5F5F5;
  --border-gray: silver;
  --gray-text: #555;
  --error-red: #E84855;

  /* Breakpoints */
  --small: 768px;
  --medium: 992px;
  --large: 1200px;

  color: var(--black);
  font-family: 'Roboto', sans-serif;
}

* {
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  min-height: 100%;
  background: var(--gray);
}

#app {
  display: flex;
  flex-direction: column;
}
#page {
  flex: 1;
  overflow: auto;
}

.full-screen {
  height: 100%;
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
  width: 100%;
  margin: 0 auto;
  padding-top: 40px;
}

/* Headings */
h1 {
  font-weight: bold;
  font-size: 2em;
  margin: 5px 0;
}

h3 {
  font-size: 1.2em;
  margin: 0;
}

h4 {
  color: var(--gray-text);
  font-weight: normal;
  font-size: 1.2em;
  margin: 5px 0;
}

/* Forms */
label {
  margin-bottom: 10px;
  display: inline-block;
  font-style: italic;
  border-bottom: 2px solid var(--black);
  font-size: 1.1em;
}

/* Buttons */
.btn {
  border: none;
  border-radius: 50px;
  text-decoration: none;
  padding: 10px 20px;
  cursor: pointer;
  outline: none;
  display: inline-flex;
}

.btn.border.blue {
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  background: var(--white);
}
.btn.border.green {
  border: 2px solid green;
  color: green;
  background: var(--white);
}
.btn.border.red {
  border: 2px solid var(--error-red);
  color: var(--error-red);
  background: var(--white);
}

.btn.sm {
  padding: 5px 20px;
}

.btn.border.blue:disabled,
.btn.border.red:disabled,
.btn.border.green:disabled {
  border-color: #ddd;
  color: #aaa;
  opacity: 0.8;
  cursor: default;
}

.btn:hover {
  opacity: .8;
}

.btn.blue {
  background: var(--primary-color);
  color: var(--white);
}

.btn.green {
  background: green;
  color: var(--white);
}
.btn.red {
  background: var(--error-red);
  color: var(--white);
}

.btn-group {
  margin-top: 15px;
}

/* Secondary Nav */
.secondary-nav {
  box-shadow: 0 3px 6px rgba(0,0,0,0.25);
  border-radius: 10px;
  margin-bottom: 25px;
  padding: 10px 25px;
  background: var(--white);
  border: 1px solid var(--primary-color);
  display: flex;
  align-items: center;
}

.secondary-nav .brand {
  text-transform: capitalize;
  font-weight: bold;
  margin-right: auto;
  font-size: 1.1em;
}

/* Transitions */
.spin {
  animation: spin 1s infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg) }
  100% { transform: rotate(360deg) }
}
</style>
