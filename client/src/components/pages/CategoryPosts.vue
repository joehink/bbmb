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
      category: this.$route.params.category,
    };
  },
  mounted() {
    // Get first page of posts for category
    this.getPosts();
  },
  activated() {
    // If selected category is different than previously selected category
    if (this.category !== this.$route.params.category) {
      // reset data
      this.posts = [];
      this.page = 0;
      this.nextPage = true;
      this.category = this.$route.params.category;
      this.getPosts();
    }
    // Initialize infinite scroll function
    this.scroll();
  },
  deactivated() {
    // remove infinite scroll function when component is not shown
    window.onscroll = null;
  },
  methods: {
    async getPosts() {
      try {
        // If request is not currently being made and if there is a next page
        if (!this.loading && this.nextPage) {
          this.loading = true;
          // fetch next page of posts
          const res = await axios({
            method: 'GET',
            url: `/api/posts/category/${this.$route.params.category}`,
            params: {
              page: this.page + 1,
            },
          });
          // add posts array onto existing array of posts
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
      window.onscroll = () => {
        const { innerHeight } = window;
        const { scrollTop, scrollHeight } = event.target.scrollingElement;
        const bottomOfWindow = (innerHeight * 1.25) + scrollTop >= scrollHeight;

        // if user is a quarter of the screen's height away from the bottom of the page
        if (bottomOfWindow) {
          // get next page of posts
          this.getPosts();
        }
      };
    },
  },
};
</script>

<style scoped></style>
