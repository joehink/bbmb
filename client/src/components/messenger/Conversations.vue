<template>
  <div class="conversations">
    <div class="conversations-list" v-if="conversations && conversations.length > 0">
      <h2>Conversations</h2>
      <conversation-list-item
        v-for="conversation in conversations"
        :key="conversation._id"
        :conversation="conversation"
        :user="user"
        v-on:close="$emit('close')"
      />
    </div>

    <h5 class="conversations-warning" v-if="conversations && conversations.length === 0">
      No conversations yet.
    </h5>

    <h3>
      Select a conversation or go to a user profile and click "Send Message"
    </h3>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ConversationListItem from './ConversationListItem';

export default {
  name: 'SideBar',
  components: {
    ConversationListItem,
  },
  computed: {
    ...mapGetters(['conversations', 'user']),
  },
};
</script>

<style scoped>
  .conversations {
    background: var(--white);
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  h2 {
    margin: 15px;
    color: var(--black);
    text-align: center;
    font-size: 1.1em;
  }

  h5 {
    margin: auto;
    color: #AAA;
  }

  h3 {
    font-weight: 400;
    color: #AAA;
    text-align: center;
    display: none;
    margin: auto;
    padding: 15px;
  }

  @media (min-width: 768px) {
    h3 {
      display: block;
    }
    .conversations-list, .conversations-warning {
      display: none;
    }
  }
</style>
