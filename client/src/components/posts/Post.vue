<template>
  <div class="post">
    <div class="post-header" v-if="post" :class="{'border-bottom': !editable}">
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
      <button
        class="btn border blue sm"
        v-if="user && user._id === post.author._id"
        v-on:click="toggleEdit"
      >
        Edit
      </button>
      <button
        v-if="user && user._id === post.author._id && editable"
        v-on:click="updatePost"
      >
        Save
      </button>
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

export default {
  name: 'Post',
  components: {
    Editor,
  },
  props: ['post'],
  data() {
    return {
      liking: false,
      editable: false,
      content: this.post.body,
      updating: false,
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'token', 'user']),
    date() {
      // format date posted using moment
      return moment(this.post.createdAt).format('MMMM D, YYYY');
    },
    displayEditorMenu() {
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

        this.$emit('postUpdate', res.data);
        this.updating = false;
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
    padding: 30px 40px;
  }
  .post-header {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
  }
  .post-header.border-bottom {
    border-bottom: 1px solid #ddd;
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
