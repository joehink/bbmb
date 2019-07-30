<template>
  <div class="start-conversation ">
    <conversation-header
      v-on:toggle="$emit('toggle')"
      :to="to"
      v-if="activeConversation.id"
    />

    <message-input
      :message="activeConversation.message"
      :setMessage="setMessage"
      v-on:messageSent="createConversation"
      :disable="isSendingMessage"
      class="message-input"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import ConversationHeader from './ConversationHeader';
import MessageInput from './MessageInput';
import router from '../../router';

export default {
  name: 'StartConversation',
  components: {
    ConversationHeader,
    MessageInput,
  },
  mounted() {
    if (this.activeConversation.participants.length <= 0) {
      router.push('/');
    }
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
    ...mapActions(['createConversation']),
    ...mapMutations(['resetActiveConversation', 'setMessage']),
  },
};
</script>

<style scoped>
.start-conversation {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}
.message-input {
  margin-top: auto;
}
</style>

