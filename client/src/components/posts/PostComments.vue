<template>
  <div class="comments" v-if="comments">
    <Comment
      v-for="(comment, index) in comments"
      :key="comment._id"
      :comment="comment"
      :index="index"
      :token="token"
      @likeComment="updateCommentAtIndex"
      @updateComment="updateCommentAtIndex"
      @removeComment="removeCommentAtIndex"
      :belongsToUser="user && user._id === comment.author._id"
      :userId="user && user._id"
      :displayModal="displayModal"
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
  props: ['comments'],
  computed: {
    ...mapGetters(['token', 'user']),
  },
  methods: {
    ...mapActions(['displayModal']),
    ...mapMutations(['updateCommentAtIndex']),
    ...mapMutations(['removeCommentAtIndex']),
  },
};
</script>

<style scoped>
.comments {
  margin-top: 25px;
}
</style>
