<template>
  <div id="page">
    <side-bar
      :conversations="conversations"
      :user="user"
      :class="{ show: showSidebar }"
    />
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
  },
};
</script>

<style scoped>
  #page {
    display: flex;
  }
  .sidebar {
    display: block;
  }
  @media (max-width: 768px) {
    .sidebar {
      display: none;
    }
    .sidebar.show {
      display: block;
    }
  }
</style>
