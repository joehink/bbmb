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
    </div>
    <div class="post-body">
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  name: 'Post',
  props: ['post'],
  data() {
    return {
      liking: false,
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'token']),
    date() {
      // format date posted using moment
      return moment(this.post.createdAt).format('MMMM D, YYYY');
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
    min-height: 300px;
  }
  .post-header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #DDD;
    padding-bottom: 10px;
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
  .post-body {
    padding: 0;
    white-space: pre-wrap;
    line-height: 1.5;
  }
</style>
