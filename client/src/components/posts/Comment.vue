<template>
  <div class="comment">
    <header>
      <span class="username">{{ comment.author.username }}</span>
      <span class="date">{{ date }}</span>
    </header>
    <div class="body">
      {{ comment.body }}
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'Comment',
  props: ['comment'],
  computed: {
    date() {
      // format date posted using moment
      return moment(this.comment.createdAt).format('MMMM D, YYYY');
    },
  },
};
</script>

<style scoped>
.comment {
  padding: 15px 25px;
  background: var(--white);
  box-shadow: 0 3px 6px rgba(0,0,0,0.25);
  margin-bottom: 15px;
  border-radius: 10px;
}
.comment header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.username {
  background: #ddd;
  border-radius: 20px;
  display: inline-block;
  padding: 2.5px 15px;
  font-size: .9em;
}
.date {
  color: #aaa;
  font-size: .9em;
  margin-left: 10px;
}
.body {
  border-left: 2px solid #aaa;
  padding-left: 10px;
}
</style>
