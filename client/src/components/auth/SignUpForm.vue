<template>
  <form @submit="onSubmit">
    Sign Up
    <p v-if="error">{{ error }}</p>
    <FormInput type="text" v-model="username" />
    <FormInput type="password" v-model="password" />
    <FormInput type="password" v-model="confirmPassword" />
    <input type="submit" value="Sign Up">
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import FormInput from '../FormInput';

export default {
  name: 'SignUpForm',
  components: {
    FormInput,
  },
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
    };
  },
  computed: {
    ...mapGetters(['error']),
  },
  methods: {
    ...mapActions(['signup']),
    onSubmit(event) {
      event.preventDefault();
      this.signup({
        username: this.username,
        password: this.password,
        confirmPassword: this.confirmPassword,
      });
    },
  },
};
</script>

<style>

</style>
