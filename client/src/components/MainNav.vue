<template>
  <nav class="nav">
    <div class="nav-container">
      <span class="nav-brand nav-item"><router-link to="/">BBMB</router-link></span>
      <search-input />
      <div class="photo-container">
        <span v-if="conversations && hasUnreadMessages" class="dot"></span>
        <ProfilePhoto
          v-if="user"
          class="nav-item profile-img-sm"
          :key="user.photo ? user.photo : null"
          v-lazy:background-image="user.photo ? `/api/photos/${user.photo}` : null"
          :style="{
            backgroundImage: !user.photo && `url('/static/images/auth/error.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }"
        />
      </div>
      <button v-if="isLoggedIn" v-on:click="logout" class="nav-button nav-item">Log Out</button>
      <router-link v-if="!isLoggedIn" to="/login" class="nav-item">Log In</router-link>
      <router-link v-if="!isLoggedIn" to="/signup" class="nav-item">Sign Up</router-link>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ProfilePhoto from './profile/ProfilePhoto';
import SearchInput from './SearchInput';

export default {
  name: 'MainNav',
  components: {
    ProfilePhoto,
    SearchInput,
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'user', 'hasUnreadMessages', 'conversations']),
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
  .nav-container * {
    color: var(--white);
  }
  .nav-brand {
    font-size: 2em;
    font-weight: bold;
  }
  .nav-button {
    border: none;
    background: none;
  }
  .nav-item {
    padding: 10px 10px;
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

