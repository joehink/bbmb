<template>
  <div id="page">
    <side-bar :conversations="conversations" :user="user"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import SideBar from '../messenger/SideBar';

export default {
  name: 'Messenger',
  components: {
    SideBar,
  },
  mounted() {
    this.getConversations();
  },
  computed: {
    ...mapGetters(['conversations', 'user']),
  },
  methods: {
    ...mapActions(['getConversations']),
  },
};
</script>

<style scoped>

</style>
