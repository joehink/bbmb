<template>
  <div class="comments" v-if="comments">
    <Comment
      v-for="(comment, index) in comments"
      :key="comment._id"
      :comment="comment"
      :index="index"
      :token="token"
      v-on:likeComment="updateCommentAtIndex"
      v-on:updateComment="updateCommentAtIndex"
      :belongsToUser="user && user._id === comment.author._id"
      :userId="user && user._id"
  />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Comment from './Comment';

export default {
  name: 'PostComments',
  components: {
    Comment,
  },
  mounted() {
    this.getPostComments(this.$route.params.postId);
  },
  computed: {
    ...mapGetters(['comments', 'token', 'user']),
  },
  methods: {
    ...mapActions(['getPostComments']),
    ...mapMutations(['updateCommentAtIndex']),
  },
};
</script>

<style scoped>
.comments {
  margin-top: 25px;
}
</style>
