<template>
  <form @submit="onSubmit">
    <h1>Welcome Back!</h1>
    <h4>Log In</h4>
    <ErrorMessage class="text-center" />
    <FormInput
      type="text"
      placeholder="Username"
      v-model="username"
      :disabled="isAuthLoading"
    />
    <FormInput
      type="password"
      placeholder="Password"
      v-model="password"
      :disabled="isAuthLoading"
    />
    <button
      class="btn blue"
      type="submit"
      :disabled="isAuthLoading"
    >
      <Spinner class="btn-spinner" v-if="isAuthLoading" />Log In
    </button>
  </form>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import FormInput from '../reusable/forms/FormInput';
import ErrorMessage from '../reusable/errors/ErrorMessage';
import Spinner from '../Spinner';

export default {
  name: 'LogInForm',
  components: {
    FormInput,
    ErrorMessage,
    Spinner,
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
  computed: {
    ...mapGetters(['isAuthLoading']),
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
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 25px auto auto;
  }
</style>
