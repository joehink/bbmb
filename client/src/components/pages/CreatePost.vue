<template>
  <div class="container">
    <error-message />
    <div class="create-form-container">
      <header>
        <nav class="secondary-nav">
          <span class="brand">Create Post</span>
          <button class="btn border green sm" v-on:click="createPost">
            <spinner v-if="saving" class="btn-spinner green" /> Create
          </button>
        </nav>
      </header>
      <div class="create-form">
        <div class="form-row">
          <label for="title">Title:</label>
          <form-input id="title" v-model="title" />
        </div>

        <div class="form-row">
          <label for="body">Body:</label>
          <editor
            :content="content"
            :editable="true"
            :displayMenu="true"
            v-model="content"
            id="body"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapMutations } from 'vuex';
import router from '../../router';
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
  data() {
    return {
      title: '',
      content: '',
      saving: false,
    };
  },
  beforeDestroy() {
    // Remove error message when user navigates away from form
    this.setError('');
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
    ...mapGetters(['token']),
  },
  methods: {
    ...mapMutations(['setError']),
    async createPost() {
      try {
        if (!this.content || !this.title) {
          this.setError('Must provide a title and a body.');
        } else {
          this.saving = true;
          const res = await axios({
            method: 'POST',
            url: '/api/posts',
            headers: {
              authorization: this.token,
            },
            data: {
              title: this.title,
              body: this.content,
              category: this.$route.params.category,
            },
          });
          router.push(`/posts/${res.data._id}`);
        }
        this.saving = false;
      } catch (err) {
        this.setError(err.response.data.message);
        this.saving = false;
      }
    },
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

