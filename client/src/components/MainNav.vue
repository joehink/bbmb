<template>
  <nav class="nav">
    <div class="nav-container">
      <span class="nav-brand nav-item"><router-link to="/">BBMB</router-link></span>
      <search-input />
      <account-menu
        :user="user"
        :hasUnreadMessages="hasUnreadMessages"
        :logout="logout"
        v-if="user"
      />
      <router-link v-if="!isLoggedIn" to="/login" class="nav-item">Log In</router-link>
      <router-link v-if="!isLoggedIn" to="/signup" class="nav-item">Sign Up</router-link>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ProfilePhoto from './profile/ProfilePhoto';
import SearchInput from './SearchInput';
import AccountMenu from './AccountMenu';

export default {
  name: 'MainNav',
  components: {
    ProfilePhoto,
    SearchInput,
    AccountMenu,
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'user', 'hasUnreadMessages']),
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
    z-index: 1000;
  }
  .nav-container {
    display: flex;
    max-width: 1200px;
    margin: auto;
    align-items: center;
  }
  .nav-brand {
    font-size: 2em;
    font-weight: bold;
  }
  .nav-brand a {
    color: var(--white);
  }
  .nav-button {
    border: none;
    background: none;
  }
  .nav-item {
    padding: 10px 10px;
    color: var(--white);
  }
  .photo-container {
    position: relative;
    margin-left: auto;
  }
  .dot {
    background: red;
    border-radius: 100%;
    width: 10px;
    height: 10px;
    display: block;
    position: absolute;
    top: 1px;
    right: 1px;
    box-shadow: 0 3px 6px rgba(255,0,0,0.75);
  }

  @media (min-width: 768px) {
    .nav-brand {
      margin-right: 10px;
    }
  }
</style>

