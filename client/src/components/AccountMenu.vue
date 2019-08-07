<template>
  <div class="account-menu-container">
    <div class="photo-container">
      <span v-if="hasUnreadMessages" class="dot"></span>
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
    <div class="account-menu">
      <h5>{{ user.username }}</h5>
      <nav>
        <router-link :to="`/users/${user._id}`">Profile</router-link>
        <router-link to="/conversations">Conversations</router-link>
        <button @click="logout">Log Out</button>
      </nav>
    </div>
  </div>
</template>

<script>
import ProfilePhoto from './profile/ProfilePhoto';

export default {
  name: 'AccountMenu',
  components: {
    ProfilePhoto,
  },
  props: ['user', 'hasUnreadMessages', 'logout'],
};
</script>

<style scoped>
.account-menu-container {
  position: relative;
  cursor: pointer;
  margin-right: 10px;
}
.account-menu-container:hover .account-menu {
  display: block;
}
.account-menu {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 200px;
  background: var(--white);
  color: var(--black);
  padding: 15px 40px 10px 20px;
  display: none;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.25);
}
.photo-container {
  z-index: 1000;
}
h5 {
  color: var(--black);
  text-align: left;
  margin: 0;
}
</style>

