<template>
  <div class="no-conversation">
    <h3><font-awesome-icon icon="arrow-left" /> Select a conversation</h3>
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
}
h3 {
  font-weight: 400;
  color: #AAA;
}
</style>

