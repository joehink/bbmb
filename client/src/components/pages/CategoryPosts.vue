<template>
  <div class="container">
    <nav class="secondary-nav">
      <span class="brand">{{ $route.params.category }}</span>
      <router-link
        :to="`/posts/category/${$route.params.category}/create`"
        class="btn border blue sm"
      >
        Create New Post
      </router-link>
    </nav>
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
      posts: [],
      page: 0,
      nextPage: true,
      loading: false,
    };
  },
  created() {
    this.getPosts();
  },
  mounted() {
    this.scroll();
  },
  methods: {
    async getPosts() {
      try {
        if (!this.loading && this.nextPage) {
          this.loading = true;
          const res = await axios({
            method: 'GET',
            url: `/api/posts/category/${this.$route.params.category}`,
            params: {
              page: this.page + 1,
            },
          });

          this.posts = [...this.posts, ...res.data.posts];
          this.nextPage = res.data.nextPage;
          this.page += 1;
          this.loading = false;
        }
      } catch (err) {
        this.loading = false;
      }
    },
    updateLikes(likedPost, index) {
      // update posts array at index with updated post
      Vue.set(this.posts, index, likedPost);
    },
    scroll() {
      window.onscroll = (event) => {
        const { innerHeight } = window;
        const { scrollTop, scrollHeight } = event.target.scrollingElement;
        const bottomOfWindow = (innerHeight * 1.25) + scrollTop >= scrollHeight;

        if (bottomOfWindow) {
          this.getPosts();
        }
      };
    },
  },
};
</script>

<style></style>
