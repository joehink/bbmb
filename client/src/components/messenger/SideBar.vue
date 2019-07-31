<template>
  <div class="sidebar">
    <div v-if="conversations && conversations.length > 0">
      <conversation-list-item
        v-for="conversation in conversations"
        :key="conversation._id"
        :conversation="conversation"
        :user="user"
      />
    </div>

    <h5 v-if="conversations && conversations.length === 0">
      No conversations yet.
    </h5>
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
    display: none;
    flex-direction: column;
  }

  h5 {
    margin: auto;
    color: #AAA;
  }

  @media (min-width: 768px) {
    .sidebar {
      display: flex;
    }
  }
</style>
