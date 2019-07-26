<template>
  <div id="page">
    <side-bar
      :conversations="conversations"
      :user="user"
    />
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SideBar from '../messenger/SideBar';

export default {
  name: 'Messenger',
  components: {
    SideBar,
  },
  computed: {
    ...mapGetters(['conversations', 'user']),
  },
};
</script>

<style scoped>
  #page {
    display: flex;
  }
</style>
