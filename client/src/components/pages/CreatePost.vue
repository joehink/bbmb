<template>
  <div id="page">
    <div class="container">
      <error-message />
      <div class="create-form-container">
        <header>
          <nav class="secondary-nav">
            <span class="brand">Create Post</span>
          </nav>
        </header>
        <div class="create-form">
          <div class="form-row">
            <label for="title">Title:</label>
            <form-input id="title" :value="postFormTitle" v-on:input="setPostFormTitle"/>
          </div>

          <div class="form-row">
            <label for="body">Body:</label>
            <editor
              :content="postFormBody"
              :editable="true"
              :displayMenu="true"
              v-on:input="setPostFormBody"
              id="body"
            />
            <div class="btn-group">
              <button
                class="btn border green sm"
                :disabled="isSavingPost"
                v-on:click="createPost($route.params.category)"
              >
                <spinner v-if="isSavingPost" class="btn-spinner green" /> Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import Editor from '../reusable/Editor';
import ErrorMessage from '../reusable/errors/ErrorMessage';
import FormInput from '../reusable/forms/FormInput';
import Spinner from '../Spinner';

export default {
  name: 'CreatePost',
  components: {
    Editor,
    ErrorMessage,
    FormInput,
    Spinner,
  },
  beforeDestroy() {
    // Remove error message when user navigates away from form
    this.setError('');
    this.resetPost('');
  },
  watch: {
    title() {
      this.setError('');
    },
    content() {
      this.setError('');
    },
  },
  computed: {
    ...mapGetters([
      'token',
      'isSavingPost',
      'postFormTitle',
      'postFormBody',
    ]),
  },
  methods: {
    ...mapActions(['createPost', 'resetPost']),
    ...mapMutations(['setError', 'setPostFormTitle', 'setPostFormBody']),
  },
};
</script>

<style scoped>
  .create-form-container {
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    border-radius: 15px;
    border: 1px solid var(--primary-color);
    background: var(--white);
  }
  .secondary-nav {
    border: none;
    padding: 15px 25px;
    border-radius: 15px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .create-form {
    padding: 0 25px 25px;
  }
  .form-row:first-of-type {
    margin-bottom: 25px;
  }
</style>
