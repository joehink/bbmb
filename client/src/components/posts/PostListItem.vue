<template>
  <div class="post">
    <div class="likes">
      <font-awesome-icon class="sun" icon="sun" />
      <span class="like-count">{{ post.likesCount }}</span>
    </div>
    <div class="post-info">
      <h3>{{ post.title }}</h3>
      <span class="post-data">{{ date }} by {{ post.author.username }}</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'PostListItem',
  props: ['post'],
  computed: {
    date() {
      return moment(this.post.createdAt).format('MMMM D, YYYY');
    },
  },
};
</script>

<style scoped>
  .post {
    display: flex;
    align-items: center;
    padding: 10px 25px;
    border-top: 1px solid #ddd;
    background: var(--white);
  }
  .likes {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 10px;
  }
  .sun {
    font-size: 1.75em;
    color: goldenrod;
    cursor: pointer;
  }
  .like-count {
    margin-top: 5px;
  }
  .post-data {
    color: var(--gray-text);
    font-size: .8em;
    margin-top: 10px;
  }
</style>
