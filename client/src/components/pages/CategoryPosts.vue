<template>
  <div class="container">
    <nav class="secondary-nav">
      <span class="brand">{{category}}</span>
      <router-link
        :to="`/posts/category/${category}/create`"
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
      v-on:like="updatePostAtIndex"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import PostListItem from '../posts/PostListItem';

export default {
  name: 'CategoryPosts',
  components: {
    PostListItem,
  },
  data() {
    return {
      category: this.$route.params.category,
    };
  },
  computed: {
    ...mapGetters(['posts']),
  },
  methods: {
    ...mapActions(['getPosts', 'resetPostsData']),
    ...mapMutations(['updatePostAtIndex']),
    scroll() {
      window.onscroll = () => {
        const { innerHeight } = window;
        const { scrollTop, scrollHeight } = event.target.scrollingElement;
        const bottomOfWindow = (innerHeight * 1.25) + scrollTop >= scrollHeight;

        // if user is a quarter of the screen's height away from the bottom of the page
        if (bottomOfWindow) {
          // get next page of posts
          this.getPosts(this.category);
        }
      };
    },
  },
  mounted() {
    // Get first page of posts for category
    this.getPosts(this.category);
  },
  activated() {
    // If selected category is different than previously selected category
    if (this.category !== this.$route.params.category) {
      // reset data
      this.resetPostsData();
      this.category = this.$route.params.category;
      this.getPosts(this.category);
    }
    // Initialize infinite scroll function
    this.scroll();
  },
  deactivated() {
    // remove infinite scroll function when component is not shown
    window.onscroll = null;
  },
};
</script>
