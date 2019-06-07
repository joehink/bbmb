<template>
  <form v-on:submit.prevent="onSubmit">
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
      <!-- Spinner is shown when log in request is being made -->
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
    // Remove error message when user navigates away from form
    this.setError('');
  },
  computed: {
    ...mapGetters(['isAuthLoading']),
  },
  methods: {
    ...mapActions(['login']),
    ...mapMutations(['setError']),
    onSubmit() {
      // Try to log in the user when the form is submitted
      this.login({ username: this.username, password: this.password });
    },
  },
};
</script>

<style scoped>
  form {
    max-width: 350px;
    width: 90%;
    background: var(--white);
    padding: 50px 25px;
    border-radius: 15px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
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
