<template>
  <form @submit="onSubmit">
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
    this.setError('');
  },
  computed: {
    ...mapGetters(['isAuthLoading']),
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
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 25px auto auto;
  }
</style>
