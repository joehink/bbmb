<template>
  <div id="page">
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
      scrollTopPosition: 0,
    };
  },
  mounted() {
    // Get first page of posts for category
    this.getPosts(this.category);
  },
  computed: {
    ...mapGetters(['posts']),
  },
  methods: {
    ...mapActions(['resetPostsData', 'getPosts']),
    ...mapMutations(['updatePostAtIndex']),
    scroll() {
      const page = document.getElementById('page');
      page.onscroll = () => {
        const { clientHeight, scrollTop, scrollHeight } = page;
        const bottomOfWindow = (clientHeight * 1.25) + scrollTop >= scrollHeight;

        this.scrollTopPosition = scrollTop;

        // if user is a quarter of the screen's height away from the bottom of the page
        if (bottomOfWindow) {
          // get next page of posts
          this.getPosts(this.category);
        }
      };
    },
  },
  activated() {
    // If selected category is different than previously selected category
    if (this.category !== this.$route.params.category) {
      // reset data
      this.resetPostsData();
      this.category = this.$route.params.category;
      this.scrollTopPosition = 0;
      this.getPosts(this.category);
    } else {
      const page = document.getElementById('page');
      page.scrollTop = this.scrollTopPosition;
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
