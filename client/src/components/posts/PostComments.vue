<template>
  <div class="comments">
    <Comment
      v-for="comment in comments"
      :key="comment._id"
      :comment="comment"
  />
  </div>
</template>

<script>
import Comment from './Comment';

export default {
  name: 'PostComments',
  components: {
    Comment,
  },
  props: ['comments'],
};
</script>

<style scoped>
.comments {
  margin-top: 25px;
}
</style>
