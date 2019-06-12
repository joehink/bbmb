<template>
  <div class="container">
    <div class="create-form-container">
      <header>
        <nav class="secondary-nav">
          <span class="brand">Create Post</span>
          <button class="btn border green sm">Create</button>
        </nav>
      </header>
      <form class="create-form">
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
      </form>
    </div>
  </div>
</template>

<script>
import Editor from '../reusable/Editor';
import FormInput from '../reusable/forms/FormInput';

export default {
  name: 'CreatePost',
  components: {
    Editor,
    FormInput,
  },
  data() {
    return {
      title: '',
      content: '',
    };
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

