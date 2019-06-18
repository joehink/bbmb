<template>
  <div class="comments" v-if="comments">
    <Comment
      v-for="comment in comments"
      :key="comment._id"
      :comment="comment"
  />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
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
    ...mapGetters(['comments']),
  },
  methods: {
    ...mapActions(['getPostComments']),
  },
};
</script>

<style scoped>
.comments {
  margin-top: 25px;
}
</style>
