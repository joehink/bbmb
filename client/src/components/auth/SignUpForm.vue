<template>
  <form v-on:submit.prevent="onSubmit">
    <h1>Catch a wave!</h1>
    <h4>Sign Up</h4>
    <ErrorMessage class="text-center" />
    <FormInput
      type="text"
      placeholder="Username"
      :disabled="isAuthLoading"
      v-model="username"
    />
    <FormInput
      type="password"
      placeholder="Password"
      maxlength="50"
      :disabled="isAuthLoading"
      v-model="password"
    />
    <FormInput
      type="password"
      placeholder="Confirm Password"
      maxlength="50"
      :disabled="isAuthLoading"
      v-model="confirmPassword"
    />
    <button
      class="btn blue"
      type="submit"
      :disabled="isAuthLoading"
    >
      <!-- Spinner is shown when sign up request is being made -->
      <Spinner class="btn-spinner" v-if="isAuthLoading" />Sign Up
    </button>
  </form>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import FormInput from '../reusable/forms/FormInput';
import ErrorMessage from '../reusable/errors/ErrorMessage';
import Spinner from '../Spinner';

export default {
  name: 'SignUpForm',
  components: {
    FormInput,
    ErrorMessage,
    Spinner,
  },
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
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
    ...mapActions(['signup']),
    ...mapMutations(['setError']),
    onSubmit() {
      // Try to sign the user up when the form is submitted
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
