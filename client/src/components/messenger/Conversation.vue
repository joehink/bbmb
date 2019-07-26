<template>
  <div class="conversation">
    <conversation-header :to="to" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import ConversationHeader from '../messenger/ConversationHeader';

export default {
  name: 'Conversation',
  components: {
    ConversationHeader,
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
    flex: 1;
  }
</style>

