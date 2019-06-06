<template>
  <div class="container">
    <PostListItem
      v-for="(post, index) in posts"
      :key="post._id"
      :post="post"
      :index="index"
      v-on:like="updateLikes"
    />
  </div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';
import PostListItem from '../posts/PostListItem';

export default {
  name: 'CategoryPosts',
  components: {
    PostListItem,
  },
  data() {
    return {
      posts: null,
      nextPage: false,
      loading: false,
    };
  },
  created() {
    this.getPosts();
  },
  methods: {
    async getPosts() {
      try {
        this.loading = true;
        const res = await axios({
          method: 'GET',
          url: `/api/posts/category/${this.$route.params.category}`,
        });

        this.posts = res.data.posts;
        this.nextPage = res.data.nextPage;
        this.loading = false;
      } catch (err) {
        this.loading = false;
      }
    },
    updateLikes(likedPost, index) {
      // update posts array at index with updated post
      Vue.set(this.posts, index, likedPost);
    },
  },
};
</script>

<style></style>
