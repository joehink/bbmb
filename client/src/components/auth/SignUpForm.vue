<template>
  <form @submit="onSubmit">
    <h1>Catch a wave!</h1>
    <h4>Sign Up</h4>
    <ErrorMessage />
    <FormInput type="text" placeholder="Username" v-model="username" />
    <FormInput type="password" placeholder="Password" v-model="password" />
    <FormInput type="password" placeholder="Confirm Password" v-model="confirmPassword" />
    <input class="btn blue" type="submit" value="Sign Up">
  </form>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import FormInput from '../reusable/forms/FormInput';
import ErrorMessage from '../reusable/errors/ErrorMessage';

export default {
  name: 'SignUpForm',
  components: {
    FormInput,
    ErrorMessage,
  },
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
    };
  },
  beforeDestroy() {
    this.setError('');
  },
  methods: {
    ...mapActions(['signup']),
    ...mapMutations(['setError']),
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

<style scoped>
  form {
    max-width: 320px;
    width: 90%;
  }
  h1 {
    text-align: center;
  }
  h4 {
    text-align: center;
    margin-bottom: 25px;
  }
  .btn {
    display: block;
    margin: auto;
    margin-top: 25px;
  }
</style>
