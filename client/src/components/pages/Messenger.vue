<template>
  <div id="page">
    <side-bar
      :conversations="conversations"
      :user="user"
      :show="showSidebar"
      v-on:close="hideSidebar"
    />
    <div
      class="sidebar-screen"
      :class="{ show: showSidebar }"
      @click="hideSidebar"
    ></div>
    <router-view
      :key="$route.fullPath"
      v-on:toggle="toggleSidebar"
    ></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SideBar from '../messenger/SideBar';

export default {
  name: 'Messenger',
  data() {
    return {
      showSidebar: false,
    };
  },
  components: {
    SideBar,
  },
  computed: {
    ...mapGetters(['conversations', 'user']),
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    hideSidebar() {
      this.showSidebar = false;
    },
  },
};
</script>

<style scoped>
  #page {
    display: flex;
    height: 100%;
  }
  .sidebar-screen {
    display: none;
  }
  @media (max-width: 768px) {
    .sidebar-screen {
      display: none;
    }
    .sidebar-screen.show {
      display: block;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0,0,0,0.75);
      z-index: 1000;
    }
  }
</style>
