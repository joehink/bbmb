<template>
  <div class="container categories">
    <Category category="discussion" src="/static/images/categories/discussion.jpg" />
    <Category category="media" src="/static/images/categories/media.jpg" />
    <Category category="events" src="/static/images/categories/events.jpg" />
    <Category category="tour" src="/static/images/categories/tour.jpg" />
  </div>
</template>

<script>
import Category from '../Category';

export default {
  name: 'Home',
  components: {
    Category,
  },
};
</script>

<style scoped>
  .categories {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
</style>
