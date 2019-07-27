<template>
  <div class="sidebar" :class="{ show: show }">
    <div v-if="conversations && conversations.length > 1">
      <conversation-list-item
        v-for="conversation in conversations"
        :key="conversation._id"
        :conversation="conversation"
        :user="user"
      />
    </div>
  </div>
</template>

<script>
import ConversationListItem from './ConversationListItem';

export default {
  name: 'SideBar',
  components: {
    ConversationListItem,
  },
  props: ['conversations', 'user', 'show'],
};
</script>

<style scoped>
  .sidebar {
    background: var(--white);
    height: 100%;
    width: 250px;
    overflow-y: auto;
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    z-index: 100;
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 0;
    }
    .sidebar.show {
      display: block;
      position: fixed;
      top: 0;
      bottom: 0;
      z-index: 1001;
      width: 80%;
    }
  }
</style>
