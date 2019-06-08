<template>
  <div class="container">
    <Post :post="post" v-on:likePost="updateLikes"/>
    <PostComments :comments="comments" />
  </div>
</template>

<script>
import axios from 'axios';

import PostComments from '../posts/PostComments';
import Post from '../posts/Post';

export default {
  name: 'PostPage',
  components: {
    Post,
    PostComments,
  },
  data() {
    return {
      post: false,
      comments: [],
      commentsLoading: true,
    };
  },
  mounted() {
    this.getPost();
    this.getPostComments();
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
    async getPostComments() {
      try {
        this.commentsLoading = true;
        const res = await axios({
          method: 'GET',
          url: `/api/posts/${this.$route.params.postId}/comments`,
        });

        this.comments = [...this.comments, ...res.data.comments];
        this.commentsLoading = false;
      } catch (err) {
        this.commentsLoading = false;
      }
    },
    updateLikes(updatedPost) {
      this.post = updatedPost;
    },
  },
};
</script>

<style>
</style>
