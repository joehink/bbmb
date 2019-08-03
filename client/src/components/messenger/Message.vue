<template>
  <div
    class="message-container"
    :class="{
      sent: user._id === message.from,
      received: user._id !== message.from
    }"
  >
    <div class="message">
      <div class="message-body" v-html="messageWithLinks"></div>
    </div>
    <span class="message-date">{{ date }}</span>
  </div>
</template>

<script>
import moment from 'moment';
import Autolinker from 'autolinker';

export default {
  name: 'Message',
  props: ['message', 'user'],
  computed: {
    date() {
      const messageDate = moment(this.message.createdAt);

      if (messageDate.isSame(moment(), 'hour')) {
        return messageDate.fromNow();
      }

      return messageDate.calendar();
    },
    messageWithLinks() {
      return Autolinker.link(this.message.body, { newWindow: true });
    },
  },
};
</script>

<style scoped>
  .message-container {
    margin: 10px 0;
  }
  .message-container:first-child {
    margin-top: auto;
  }
  .message {
    margin: 10px 0;
    display: inline-block;
    padding: 10px 20px;
    border-radius: 25px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.15);
    position: relative;
  }
  .message-body {
    line-height: 1.5;
  }
  .message-date {
    display: block;
    font-size: .5em;
    color: #AAA;
  }
  .sent {
    align-self: flex-end;
    padding: 0 15px;
    text-align: right;
  }
  .sent .message {
    background: var(--primary-color);
    color: var(--white);
    border-bottom-right-radius: 0;
    text-align: left;
  }
  .sent .message:before {
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
    padding: 0 15px;
    text-align: left;
  }
  .received .message {
    background: var(--white);
    border-bottom-left-radius: 0;
  }
  .received .message:before {
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
