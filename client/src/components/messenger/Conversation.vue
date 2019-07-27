<template>
  <div class="conversation" v-if="activeConversation.participants">
    <conversation-header
      v-on:toggle="$emit('toggle')"
      :to="to"
      v-if="activeConversation.participants"
    />
    <div class="messages">
      <message
        v-for="message in activeConversation.messages"
        :key="message._id"
        :message="message"
        :user="user"
      />
    </div>
    <message-input />
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
    ...mapGetters(['activeConversation', 'user']),
    to() {
      return this
        .activeConversation
        .participants.filter(participant => participant._id !== this.user._id);
    },
  },
  methods: {
    ...mapActions(['getConversation']),
    ...mapMutations(['resetActiveConversation']),
  },
};
</script>

<style scoped>
  .conversation {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .messages {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    flex: 1;
  }
</style>

