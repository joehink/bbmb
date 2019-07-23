<template>
  <div id="page">
    <div class="container">
      <nav class="secondary-nav">
        <span class="brand">{{category}}</span>
        <router-link
          :to="`/posts/category/${category}/create`"
          class="btn border green sm"
        >
          Create New Post
        </router-link>
        <select-box class="select-box" :sort="sort" @change="handleChange" />
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
import SelectBox from '../reusable/SelectBox';

export default {
  name: 'CategoryPosts',
  components: {
    PostListItem,
    SelectBox,
  },
  data() {
    return {
      category: this.$route.params.category,
      scrollTopPosition: 0,
      sort: '-updatedAt',
    };
  },
  mounted() {
    // Get first page of posts for category
    this.getPosts({ category: this.category });
  },
  computed: {
    ...mapGetters(['posts', 'postsFilter']),
  },
  methods: {
    ...mapActions(['resetPostsData', 'getPosts']),
    ...mapMutations(['updatePostAtIndex', 'emptyPosts', 'setPage', 'setNextPage']),
    handleChange(event) {
      this.emptyPosts();
      this.setPage(0);
      this.setNextPage(true);
      this.getPosts({ category: this.category, sort: event.target.value });
      this.sort = event.target.value;
    },
    scroll() {
      const page = document.getElementById('page');
      page.onscroll = () => {
        const { clientHeight, scrollTop, scrollHeight } = page;
        const bottomOfWindow = (clientHeight * 1.25) + scrollTop >= scrollHeight;

        this.scrollTopPosition = scrollTop;

        // if user is a quarter of the screen's height away from the bottom of the page
        if (bottomOfWindow) {
          // get next page of posts
          this.getPosts({ category: this.category, sort: this.sort });
        }
      };
    },
  },
  activated() {
    // If selected category is different than previously selected category
    if (this.category !== this.$route.params.category || this.postsFilter !== 'category') {
      // reset data
      this.resetPostsData();
      this.category = this.$route.params.category;
      this.scrollTopPosition = 0;
      this.getPosts({ category: this.category });
      this.sort = '-updatedAt';
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

<style scoped>
@media(min-width: 768px) {
  .select-box {
    margin-left: 5px;
  }
}
</style>
