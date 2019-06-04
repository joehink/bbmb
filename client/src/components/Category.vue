<template>
  <div class="category">
    <header>
      <h2>{{ category }}</h2>
      <img :src="src" alt="" width="160px" height="160px">
    </header>
    <div class="posts">
      <div v-if="posts && posts.length" class="posts-list">
        <PostListItem
          v-for="(post, index) in posts"
          :key="post._id"
          :index="index"
          :post="post"
          v-on:like="updateLikes"
        />
      </div>
      <!-- Message is shown when there are no posts yet in the category -->
      <p v-if="posts && !posts.length" class="center">No posts yet.</p>
      <!-- Spinner is shown while posts are being fetched -->
      <Spinner v-if="posts === null" class="center" />
    </div>
    <router-link to='/posts/category' class="see-more">See More</router-link>
  </div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';

import PostListItem from './posts/PostListItem';
import Spinner from './Spinner';

export default {
  name: 'Category',
  components: {
    PostListItem,
    Spinner,
  },
  created() {
    // Get recent category posts when component is created
    this.getPosts();
  },
  data() {
    return {
      posts: null,
      error: '',
    };
  },
  props: ['category', 'src'],
  methods: {
    async getPosts() {
      try {
        // Get 5 most recent posts for category
        const res = await axios({
          method: 'GET',
          url: `/api/posts/category/${this.category}/recent`,
        });
        this.posts = res.data;
      } catch (err) {
        this.posts = [];
        this.error = `Something went wrong while getting ${this.category} posts`;
      }
    },
    updateLikes(likedPost, index) {
      // update posts array at index with updated post
      Vue.set(this.posts, index, likedPost);
    },
  },
};
</script>

<style scoped>
.category {
  border-radius: 20px;
  overflow: hidden;
  background: var(--primary-color);
  box-shadow: 0 3px 6px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  min-height: 700px;
  max-width: 350px;
  flex: 1 1 350px;
  margin: 0 12.5px 40px;
}
header {
  color: white;
  text-align: center;
  position: relative;
  padding-bottom: 80px;
}
h2 {
  text-transform: capitalize;
}
img {
  border-radius: 100%;
  box-shadow: 0 3px 6px rgba(0,0,0,0.25);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.posts {
  padding: 97.5px 0 25px;
  background: var(--white);
  display: flex;
  flex-direction: column;
  flex: 1;
}
.center {
  margin: auto;
}
.see-more {
  background: transparent;
  color: var(--white);
  display: block;
  text-align: center;
  padding: 15px 0;
  width: 100%;
}
</style>
