<template>
  <form @submit="onSubmit">
    Log In
    <p v-if="error">{{ error }}</p>
    <FormInput type="text" v-model="username" />
    <FormInput type="password" v-model="password" />
    <input type="submit" value="Log In">
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import FormInput from '../FormInput';

export default {
  name: 'LogInForm',
  components: {
    FormInput,
  },
  data() {
    return {
      username: '',
      password: '',
    };
  },
  computed: {
    ...mapGetters(['error']),
  },
  methods: {
    ...mapActions(['login']),
    onSubmit(event) {
      event.preventDefault();
      this.login({ username: this.username, password: this.password });
    },
  },
};
</script>

<style>

</style>
