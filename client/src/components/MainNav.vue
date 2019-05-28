<template>
  <nav class="nav">
    <div class="nav-container">
      <span class="nav-brand nav-item"><router-link to="/">BBMB</router-link></span>
      <button v-if="isLoggedIn" v-on:click="logout" class="nav-button nav-item">Log Out</button>
      <router-link v-if="!isLoggedIn" to="/login" class="nav-item">Log In</router-link>
      <router-link v-if="!isLoggedIn" to="/signup" class="nav-item">Sign Up</router-link>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'MainNav',
  computed: {
    ...mapGetters(['isLoggedIn']),
  },
  methods: {
    ...mapActions(['logout']),
  },
};
</script>

<style>
  .nav {
    background: var(--primary-color);
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    position: sticky;
  }
  .nav-container {
    display: flex;
    max-width: 1024px;
    margin: auto;
    align-items: center;
  }
  .nav-container * {
    color: var(--white);
  }
  .nav-brand {
    margin-right: auto;
    font-size: 2em;
    font-weight: bold;
  }
  .nav-button {
    border: none;
    background: none;
  }
  .nav-item {
    padding: 5px 10px;
  }
</style>

