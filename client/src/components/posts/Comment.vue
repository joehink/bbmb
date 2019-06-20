<template>
  <div class="comment">
    <header>
      <span class="username">{{ comment.author.username }}</span>
      <span class="date">{{ date }}</span>
      <font-awesome-icon
        class="sun"
        icon="sun"
        :class="{ spin: liking }"
        v-on:click="likeComment"
      />
      <span class="like-count">{{ comment.likesCount }}</span>
      <font-awesome-icon icon="reply" class="reply" />
      <font-awesome-icon icon="edit" />
      <font-awesome-icon icon="trash-alt" class="trash" />
    </header>
    <div class="body">
      {{ comment.body }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'Comment',
  props: ['comment', 'index', 'token'],
  data() {
    return {
      liking: false,
    };
  },
  computed: {
    date() {
      // format date posted using moment
      return moment(this.comment.createdAt).format('MMMM D, YYYY');
    },
  },
  methods: {
    async likeComment() {
      try {
        // if like request is not being made and user is logged in
        if (!this.liking && !!this.token) {
          this.liking = true;
          // Make request to like or unlike post
          const res = await axios({
            method: 'PATCH',
            url: `/api/posts/${this.$route.params.postId}/comments/${this.comment._id}/like`,
            headers: {
              authorization: this.token,
            },
          });
          this.$emit('likeComment', { index: this.index, updatedComment: res.data });
          this.liking = false;
        }
      } catch (err) {
        this.liking = false;
      }
    },
  },
};
</script>

<style scoped>
.comment {
  padding: 15px 25px;
  background: var(--white);
  box-shadow: 0 3px 6px rgba(0,0,0,0.25);
  margin-bottom: 20px;
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
.sun {
  font-size: 1.25em;
  color: goldenrod;
  cursor: pointer;
  margin: 0 2.5px 0 10px;
}
.reply {
  margin: 0 10px 0 auto;
}
.like-count {
  margin: 2px 2.5px 0 0;
}
.trash {
  margin-left: 10px;
  color: var(--error-red);
  cursor: pointer;
}
.body {
  border-left: 2px solid #aaa;
  padding-left: 10px;
}
</style>
