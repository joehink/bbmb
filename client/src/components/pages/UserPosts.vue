<template>
  <div id="page">
    <div class="container">
      <nav class="secondary-nav">
        <span class="brand">
          {{ posts.length ? `Posts by ${posts[0].author.username}` : '' }}
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
  name: 'UserPosts',
  components: {
    PostListItem,
    SelectBox,
  },
  data() {
    return {
      userId: this.$route.params.userId,
      scrollTopPosition: 0,
      sort: '-updatedAt',
    };
  },
  mounted() {
    // Get first page of posts by user
    this.getUserPosts({ userId: this.$route.params.userId });
  },
  computed: {
    ...mapGetters(['posts']),
  },
  methods: {
    ...mapActions(['resetPostsData', 'getUserPosts']),
    ...mapMutations(['updatePostAtIndex', 'emptyPosts', 'setPage', 'setNextPage']),
    handleChange(event) {
      this.emptyPosts();
      this.setPage(0);
      this.setNextPage(true);
      this.getUserPosts({ userId: this.$route.params.userId, sort: event.target.value });
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
          this.getUserPosts({ userId: this.$route.params.userId, sort: this.sort });
        }
      };
    },
  },
  activated() {
    // If userId is different than previously selected user
    if (this.userId !== this.$route.params.userId) {
      // reset data
      this.resetPostsData();
      this.userId = this.$route.params.userId;
      this.scrollTopPosition = 0;
      this.getUserPosts({ userId: this.$route.params.userId });
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
.select-box {
  margin-left: 5px;
}
</style>
