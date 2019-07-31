<template>
  <div class="conversation" v-if="activeConversation.participants">
    <conversation-header
      :to="to"
      v-if="activeConversation.id"
    />
    <div class="messages-container">
      <div class="messages">
        <message
          v-for="message in activeConversation.messages"
          :key="message._id"
          :message="message"
          :user="user"
        />
      </div>
    </div>
    <message-input
      :message="activeConversation.message"
      :setMessage="setMessage"
      v-on:messageSent="sendMessage"
      :disable="isSendingMessage"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import ConversationHeader from '../messenger/ConversationHeader';
import Message from '../messenger/Message';
import MessageInput from '../messenger/MessageInput';

export default {
  name: 'Conversation',
  components: {
    ConversationHeader,
    Message,
    MessageInput,
  },
  mounted() {
    this.getConversation(this.$route.params.conversationId);
  },
  beforeDestroy() {
    this.resetActiveConversation();
  },
  computed: {
    ...mapGetters(['activeConversation', 'user', 'isSendingMessage']),
    to() {
      return this
        .activeConversation
        .participants.filter(participant => participant._id !== this.user._id);
    },
  },
  methods: {
    ...mapActions(['getConversation', 'sendMessage']),
    ...mapMutations(['resetActiveConversation', 'setMessage']),
  },
};
</script>

<style scoped>
  .conversation {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
  }
  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding-top: 15px;
  }
  .messages {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: 1000px;
    margin: 0 auto;
  }
  .messages::after {
    padding-bottom: 5px;
    content: '';
  }
</style>

