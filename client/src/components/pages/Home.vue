// Home is purely for showing all recent category posts.
<template>
  <div id="page">
    <div class="container categories">
      <Category category="discussion" src="/static/images/categories/discussion.jpg" />
      <Category category="media" src="/static/images/categories/media.jpg" />
      <Category category="events" src="/static/images/categories/events.jpg" />
      <Category category="tour" src="/static/images/categories/tour.jpg" />
    </div>
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
    justify-content: center;
  }

  @media (min-width: 1200px) {
    .categories {
      justify-content: space-around;
    }
  }
</style>
