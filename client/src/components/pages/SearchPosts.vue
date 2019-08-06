<template>
  <div id="page">
    <div class="container">
      <nav class="secondary-nav">
        <span class="brand">
          Search
        </span>
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
  name: 'SearchPosts',
  components: {
    PostListItem,
    SelectBox,
  },
  data() {
    return {
      searchTerm: this.$route.params.searchTerm,
      scrollTopPosition: 0,
      sort: '-lastCommentAt',
    };
  },
  mounted() {
    // Get first page of posts by user
    this.searchPosts({ searchTerm: this.$route.params.searchTerm, sort: this.sort });
  },
  watch: {
    '$route.params.searchTerm': {
      handler(to, from) {
        if (to && from) {
          this.resetPostsData();
          this.searchPosts({ searchTerm: to, sort: this.sort });
        }
      },
    },
  },
  computed: {
    ...mapGetters(['posts', 'postsFilter']),
  },
  methods: {
    ...mapActions(['resetPostsData', 'searchPosts']),
    ...mapMutations(['updatePostAtIndex', 'emptyPosts', 'setPage', 'setNextPage']),
    handleChange(event) {
      this.emptyPosts();
      this.setPage(0);
      this.setNextPage(true);
      this.searchPosts({ searchTerm: this.$route.params.searchTerm, sort: event.target.value });
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
          this.searchPosts({ searchTerm: this.$route.params.searchTerm, sort: this.sort });
        }
      };
    },
  },
  activated() {
    // If userId is different than previously selected user
    if (this.searchTerm !== this.$route.params.searchTerm || this.postsFilter !== 'search') {
      // reset data
      this.resetPostsData();
      this.searchTerm = this.$route.params.searchTerm;
      this.scrollTopPosition = 0;
      this.searchPosts({ searchTerm: this.$route.params.searchTerm, sort: this.sort });
      this.sort = '-lastCommentAt';
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
.select-box {
  margin-left: 5px;
}
</style>
