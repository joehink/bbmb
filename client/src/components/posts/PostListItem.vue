<template>
  <div class="post-list-item">
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
      <router-link :to="`/posts/${post._id}`" class="post-link">
        <h3>{{ post.title }}</h3>
      </router-link>
      <span class="post-data">{{ date }} by {{ post.author.username }}</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  name: 'PostListItem',
  props: ['post', 'index'],
  data() {
    return {
      liking: false,
    };
  },
  computed: {
    ...mapGetters(['token', 'isLoggedIn']),
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
          // Emit custom 'like' event
          this.$emit('like', { index: this.index, updatedPost });
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
  .post-list-item {
    display: flex;
    align-items: center;
    padding: 10px 25px;
    background: var(--white);
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    margin-bottom: 10px;
    border-radius: 10px;
  }
  .post-list-item.recent {
    border-top: 1px solid #ddd;
    border-radius: 0;
    margin: 0;
    box-shadow: none;
  }
  .post-link {
    color: var(--black);
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
