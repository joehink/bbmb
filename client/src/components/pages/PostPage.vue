<template>
  <div class="container">
    <Post />
    <PostComments />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import PostComments from '../posts/PostComments';
import Post from '../posts/Post';

export default {
  name: 'PostPage',
  components: {
    Post,
    PostComments,
  },
  beforeDestroy() {
    this.resetPost();
  },
  methods: {
    ...mapActions(['resetPost']),
  },
};
</script>
