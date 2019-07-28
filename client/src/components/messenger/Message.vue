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
    padding: 10px 20px;
    border-radius: 25px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.15);
    line-height: 1.5;
    position: relative;
  }
  .message:first-child {
    margin-top: auto;
  }
  .sent {
    align-self: flex-end;
    background: var(--primary-color);
    color: var(--white);
    border-bottom-right-radius: 0;
  }
  .sent:before {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    right: 0;
    bottom: -5px;
    border: 10px solid;
    border-color: var(--primary-color) var(--primary-color) transparent transparent;
  }
  .received {
    align-self: flex-start;
    background: var(--white);
    border-bottom-left-radius: 0;
  }
  .received:before {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    left: 0;
    bottom: -5px;
    border: 10px solid;
    border-color: var(--white) transparent transparent var(--white);
  }
</style>
