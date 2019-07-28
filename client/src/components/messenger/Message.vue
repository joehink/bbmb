<template>
  <div
    class="message"
    :class="{
      sent: user._id === message.from,
      received: user._id !== message.from
    }"
  >
    {{ message.body }}
  </div>
</template>

<script>
export default {
  name: 'Message',
  props: ['message', 'user'],
};
</script>

<style scoped>
  .message {
    margin: 10px 15px;
    display: inline-block;
    padding: 10px 15px;
    border-radius: 25px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.15);
  }
  .message:first-child {
    margin-top: auto;
  }
  .sent {
    align-self: flex-start;
    background: var(--primary-color);
    color: var(--white);
  }
  .received {
    align-self: flex-end;
    background: var(--white);
  }
</style>
