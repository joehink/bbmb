<template>
  <div class="no-conversation">
    <h3>Select a conversation or go to a user profile and click "Send Message"</h3>
  </div>
</template>

<script>
export default {
  name: 'NoConversation',
};
</script>

<style scoped>
.no-conversation {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 50px;
}
h3 {
  font-weight: 400;
  color: #AAA;
  text-align: center;
}
</style>

