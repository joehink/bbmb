<template>
  <div class="post">
    <div class="post-header" v-if="post">
      <div class="likes">
        <font-awesome-icon
          v-on:click="likePost"
          class="sun"
          :class="{ spin: liking }"
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
          v-if="user && user._id === post.author._id && !editable"
        >
          Delete
        </button>
        <button
          class="btn border blue sm"
          v-if="user && user._id === post.author._id && !updating"
          v-on:click="toggleEdit"
        >
          {{ editable ? 'Cancel' : 'Edit' }}
        </button>
        <button
          v-if="user && user._id === post.author._id && editable"
          v-on:click="updatePost"
          class="btn border green sm"
          :disabled="!contentChanged"
        >
          <Spinner class="btn-spinner green" v-if="updating" />
          Save
        </button>
      </div>
    </div>
    <editor
      :content="content"
      :editable="editable"
      :displayMenu="displayEditorMenu"
      v-model="content"
    />
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import moment from 'moment';
import Editor from '../reusable/Editor';
import Spinner from '../Spinner';

export default {
  name: 'Post',
  components: {
    Editor,
    Spinner,
  },
  props: ['post'],
  data() {
    return {
      liking: false,
      editable: false,
      content: this.post.body,
      contentChanged: false,
      updating: false,
    };
  },
  watch: {
    content() {
      this.contentChanged = true;
    },
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'token', 'user']),
    date() {
      // format date posted using moment
      return moment(this.post.createdAt).format('MMMM D, YYYY');
    },
    displayEditorMenu() {
      // determine whether or not the editor menubar should be displayed
      return this.user && this.post.author._id === this.user._id && this.editable;
    },
  },
  methods: {
    async likePost() {
      try {
        // if like request is not being made and user is logged in
        if (!this.liking && this.isLoggedIn) {
          this.liking = true;
          // Make request to like or unlike post
          const res = await axios({
            method: 'PATCH',
            url: `/api/posts/${this.post._id}/like`,
            headers: {
              authorization: this.token,
            },
          });
          const updatedPost = res.data;
          this.$emit('likePost', updatedPost);
          this.liking = false;
        }
      } catch (err) {
        this.liking = false;
      }
    },
    async updatePost() {
      try {
        this.updating = true;
        // update post with new title and body
        const res = await axios({
          method: 'PATCH',
          url: `/api/posts/${this.post._id}`,
          headers: {
            authorization: this.token,
          },
          data: {
            title: this.post.title,
            body: this.content,
          },
        });

        // emit event to update post in PostPage Component
        this.$emit('postUpdate', res.data);
        this.updating = false;
        this.editable = false;
      } catch (err) {
        this.updating = false;
      }
    },
    toggleEdit() {
      this.editable = !this.editable;
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
</style>
