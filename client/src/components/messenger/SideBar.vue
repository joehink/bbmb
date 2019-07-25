<template>
  <div class="sidebar">
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
  props: ['conversations', 'user'],
};
</script>

<style scoped>
  .sidebar {
    background: var(--white);
    height: 100%;
    max-width: 250px;
    overflow-y: auto;
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
  }
</style>
