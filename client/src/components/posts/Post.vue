<template>
  <div class="container">
    {{ post.title }}
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Post',
  data() {
    return {
      post: null,
      loading: false,
    };
  },
  mounted() {
    this.getPost();
  },
  methods: {
    async getPost() {
      try {
        this.loading = true;
        const res = await axios({
          method: 'GET',
          url: `/api/posts/${this.$route.params.postId}`,
        });

        this.post = res.data;
        this.loading = false;
      } catch (err) {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
</style>
