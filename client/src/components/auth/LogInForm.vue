<template>
  <form @submit="onSubmit">
    <h1>Welcome Back!</h1>
    <h4>Log In</h4>
    <ErrorMessage />
    <FormInput type="text" placeholder="Username" v-model="username" />
    <FormInput type="password" placeholder="Password" v-model="password" />
    <input class="btn blue" type="submit" value="Log In">
  </form>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import FormInput from '../reusable/forms/FormInput';
import ErrorMessage from '../reusable/errors/ErrorMessage';

export default {
  name: 'LogInForm',
  components: {
    FormInput,
    ErrorMessage,
  },
  data() {
    return {
      username: '',
      password: '',
    };
  },
  beforeDestroy() {
    this.setError('');
  },
  methods: {
    ...mapActions(['login']),
    ...mapMutations(['setError']),
    onSubmit(event) {
      event.preventDefault();
      this.login({ username: this.username, password: this.password });
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
