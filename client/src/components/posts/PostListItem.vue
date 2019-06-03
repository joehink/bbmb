<template>
  <div class="post">
    <div class="likes">
      <font-awesome-icon
        v-on:click="likePost"
        class="sun"
        :class="{ spin: liking }"
        icon="sun"
      />
      <span class="like-count">{{ post.likesCount }}</span>
    </div>
    <div class="post-info">
      <h3>{{ post.title }}</h3>
      <span class="post-data">{{ date }} by {{ post.author.username }}</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  name: 'PostListItem',
  props: ['post', 'index'],
  data() {
    return {
      liking: false,
    };
  },
  computed: {
    ...mapGetters(['token', 'isLoggedIn']),
    date() {
      return moment(this.post.createdAt).format('MMMM D, YYYY');
    },
  },
  methods: {
    async likePost() {
      try {
        if (!this.liking && this.isLoggedIn) {
          this.liking = true;
          const res = await axios({
            method: 'PATCH',
            url: `/api/posts/${this.post._id}/like`,
            headers: {
              authorization: this.token,
            },
          });
          this.$emit('like', res.data, this.index);
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
