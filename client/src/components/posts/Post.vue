<template>
  <div>
    <Notification message="Post changes were successfully saved." v-if="isPostSaved" />
    <error-message />
    <div class="post" v-if="post">
      <div class="post-header" v-if="post">
        <div class="likes">
          <font-awesome-icon
            v-on:click="likePost"
            class="sun"
            :class="{ spin: isLikingPost }"
            icon="sun"
          />
          <span class="like-count">{{ post.likesCount }}</span>
        </div>
        <div class="post-info">
          <h3>{{ post.title }}</h3>
          <span class="post-data">{{ date }} by {{ post.author.username }}</span>
        </div>
        <div class="post-controls">
          <button
            class="btn border red sm"
            v-if="user && user._id === post.author._id && !isPostEditable"
          >
            Delete
          </button>
          <button
            class="btn border blue sm"
            v-if="user && user._id === post.author._id && !isSavingPost"
            v-on:click="toggleEdit"
          >
            {{ isPostEditable ? 'Cancel' : 'Edit' }}
          </button>
          <button
            v-if="user && user._id === post.author._id && isPostEditable"
            v-on:click="updatePost"
            class="btn border green sm"
            :disabled="!isPostContentChanged"
          >
            <Spinner class="btn-spinner green" v-if="isSavingPost" />
            Save
          </button>
        </div>
      </div>
      <div class="edit-form">
        <div class="form-row" v-if="isPostEditable">
          <label for="title">Title:</label>
          <form-input id="title" :value="postFormTitle" v-on:input="setPostFormTitle" />
        </div>
        <div class="form-row">
          <label for="body" v-if="isPostEditable">Body:</label>
          <editor
            :content="postFormBody"
            :editable="isPostEditable"
            :displayMenu="displayEditorMenu"
            v-on:input="setPostFormBody"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import moment from 'moment';
import Editor from '../reusable/Editor';
import ErrorMessage from '../reusable/errors/ErrorMessage';
import FormInput from '../reusable/forms/FormInput';
import Notification from '../reusable/Notification';
import Spinner from '../Spinner';

export default {
  name: 'Post',
  components: {
    Editor,
    ErrorMessage,
    FormInput,
    Notification,
    Spinner,
  },
  mounted() {
    this.getPost(this.$route.params.postId);
  },
  beforeDestroy() {
    // Remove error message when user navigates away from form
    this.setError('');
  },
  watch: {
    postFormBody() {
      this.setPostContentChanged(true);
      this.setPostSaved(false);
      this.setError('');
    },
    postFormTitle() {
      this.setPostContentChanged(true);
      this.setPostSaved(false);
      this.setError('');
    },
    isPostEditable(newVal) {
      this.setPostContentChanged(false);
      if (!newVal) {
        this.setPostFormBody(this.post.body);
        this.setPostFormTitle(this.post.title);
      }
    },
  },
  computed: {
    ...mapGetters([
      'isLoggedIn',
      'token',
      'user',
      'post',
      'postFormTitle',
      'postFormBody',
      'isSavingPost',
      'isPostSaved',
      'isPostEditable',
      'isLikingPost',
      'isPostContentChanged',
    ]),
    date() {
      // format date posted using moment
      return moment(this.post.createdAt).format('MMMM D, YYYY');
    },
    displayEditorMenu() {
      // determine whether or not the editor menubar should be displayed
      return this.user && this.post.author._id === this.user._id && this.isPostEditable;
    },
  },
  methods: {
    ...mapActions(['getPost', 'likePost', 'updatePost']),
    ...mapMutations([
      'setError',
      'setPostEditable',
      'setPostSaved',
      'setPostContentChanged',
      'setPostFormTitle',
      'setPostFormBody',
    ]),
    toggleEdit() {
      this.setPostEditable(!this.isPostEditable);
    },
  },
};
</script>

<style scoped>
  .post {
    background: var(--white);
    border-radius: 15px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    border: 1px solid var(--primary-color);
  }
  .post-header {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    padding: 12.5px 25px;
  }
  .post-controls {
    margin-left: auto;
  }
  .likes {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 10px;
  }
  .sun {
    font-size: 1.75em;
    color: goldenrod;
    cursor: pointer;
  }
  .like-count {
    margin-top: 5px;
  }
  .post-data {
    color: var(--gray-text);
    font-size: .8em;
    margin-top: 10px;
  }
  .edit-form {
    padding: 25px;
  }
  .form-row:first-of-type {
    margin-bottom: 25px;
  }
</style>
