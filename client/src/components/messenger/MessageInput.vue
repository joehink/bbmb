<template>
  <form @submit.prevent="$emit('messageSent')">
    <button class="btn blue">
      <font-awesome-icon class="paper-plane" icon="paper-plane" /> Send
    </button>
    <form-input class="search-input" :value="message" @input="setMessage" />
  </form>
</template>

<script>
import FormInput from '../reusable/forms/FormInput';

export default {
  name: 'MessageInput',
  components: {
    FormInput,
  },
  props: ['message', 'setMessage'],
};
</script>

<style scoped>
form {
  padding: 10px;
  background: var(--white);
  border-top: 2px solid #EAEAEA;
  display: flex;
}
button {
  margin-right: 10px;
}
.paper-plane {
  margin-right: 5px;
}
.search-input {
  margin: 0;
}
</style>

